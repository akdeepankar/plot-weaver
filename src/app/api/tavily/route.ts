import { NextRequest } from "next/server";
import { tavily } from "@tavily/core";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  const validUrl = getValidUrl(url);
  if (!validUrl) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!tavilyApiKey || !openaiApiKey) {
      return Response.json({ error: "Missing API key(s)" }, { status: 500 });
    }

    // Tavily extraction
    const tvly = tavily({ apiKey: tavilyApiKey });
    const dataArr = await tvly.extract([validUrl]);
    const data = Array.isArray(dataArr) ? dataArr[0] : dataArr;

    // Debug log
    console.log("Tavily SDK data:", JSON.stringify(data, null, 2));

    // Defensive: check for both camelCase and snake_case
    const rawContent =
      data.rawContent ||
      data.raw_content ||
      (data.results && (data.results[0]?.rawContent || data.results[0]?.raw_content));
    const urlField = data.url || (data.results && data.results[0]?.url);
    const favicon = data.favicon || (data.results && data.results[0]?.favicon);
    const images = data.images || (data.results && data.results[0]?.images);

    // OpenAI flashcard generation
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const prompt = `Convert the following text into flashcards. Each flashcard should be in the format:\nfront: <question or prompt>\nback: <answer or explanation>\nReturn as a JSON array of objects with 'front' and 'back' keys.\n\nText:\n${rawContent}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Try to parse the response as JSON
    let flashcards = [];
    try {
      const text = completion.choices[0].message.content || "";
      flashcards = JSON.parse(text);
    } catch (e) {
      // fallback: return as plain text if not valid JSON
      // Ensure flashcards is always an array to satisfy type
      const fallbackContent = completion.choices[0].message.content;
      flashcards = fallbackContent ? [{ front: "Flashcards", back: fallbackContent }] : [];
    }

    return Response.json({
      content: rawContent,
      flashcards,
      metadata: {
        url: urlField,
        favicon,
        images,
      },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

function getValidUrl(url: string) {
  try {
    return new URL(url).toString();
  } catch (error) {
    console.error("Error parsing URL", error);
    return false;
  }
} 