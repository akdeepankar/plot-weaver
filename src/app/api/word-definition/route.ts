import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { word, locale = 'en' } = await request.json();

    if (!word) {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    // Determine target language
    const languageMap = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French', 
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic'
    };
    const targetLanguage = languageMap[locale as keyof typeof languageMap] || 'English';

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful dictionary assistant. Provide clear, concise definitions for words in ${targetLanguage}. Include the part of speech and a simple example if helpful. Keep responses under 100 words.`
        },
        {
          role: "user",
          content: `Define the word "${word}" in ${targetLanguage} in a clear, simple way.`
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const definition = completion.choices[0]?.message?.content || 'Definition not available';

    return NextResponse.json({ definition });
  } catch (error) {
    console.error('Error in word definition API:', error);
    return NextResponse.json(
      { error: 'Failed to get definition' },
      { status: 500 }
    );
  }
} 