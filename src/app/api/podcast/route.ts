import { NextRequest } from "next/server";
import { tavily } from "@tavily/core";
import OpenAI from "openai";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { url, voiceId: reqVoiceId } = await request.json();

  const validUrl = getValidUrl(url);
  if (!validUrl) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const tavilyApiKey = process.env.TAVILY_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (!tavilyApiKey || !openaiApiKey || !elevenLabsApiKey) {
      return Response.json({ error: "Missing API key(s)" }, { status: 500 });
    }

    // Tavily extraction
    const tvly = tavily({ apiKey: tavilyApiKey });
    const dataArr = await tvly.extract([validUrl]);
    const data = Array.isArray(dataArr) ? dataArr[0] : dataArr;
    const rawContent =
      data.rawContent ||
      data.raw_content ||
      (data.results && (data.results[0]?.rawContent || data.results[0]?.raw_content));

    // OpenAI podcast script generation
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const prompt = `You are a podcast script writer. Write a friendly, engaging, and informative podcast script (about 15 seconds when read aloud) based on the following content. The script should have a short intro, a main body, and a closing.\n\nContent:\n${rawContent}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    const script = completion.choices[0].message.content || "";
    console.log("Generated podcast script:", script);

    // ElevenLabs audio generation
    const voiceId = reqVoiceId || process.env.ELEVENLABS_VOICE_ID || "Rachel";
    const elevenLabsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsApiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: script,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!elevenLabsRes.ok) {
      const errText = await elevenLabsRes.text();
      console.error("ElevenLabs error:", errText);
      return Response.json({ error: `ElevenLabs error: ${errText}` }, { status: 500 });
    }

    // Save audio to /public/audio_generations
    const audioBuffer = await elevenLabsRes.arrayBuffer();
    const filename = `${randomUUID()}.mp3`;
    const audioDir = path.join(process.cwd(), "public", "audio_generations");
    await fs.mkdir(audioDir, { recursive: true });
    const filePath = path.join(audioDir, filename);
    await fs.writeFile(filePath, Buffer.from(audioBuffer));
    const audioUrl = `/audio_generations/${filename}`;

    return Response.json({ script, audioUrl });
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