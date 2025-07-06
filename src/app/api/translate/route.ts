import { NextRequest, NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

// Server-side SDK initialization
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY || process.env.NEXT_PUBLIC_LINGO_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { content, sourceLocale = "en", targetLocale } = await request.json();

    if (!content || !targetLocale) {
      return NextResponse.json(
        { error: "Missing required fields: content and targetLocale" },
        { status: 400 }
      );
    }

    const translated = await lingoDotDev.localizeObject(content, {
      sourceLocale,
      targetLocale,
    });

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
} 