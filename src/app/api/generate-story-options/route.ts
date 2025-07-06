import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, profile, storySoFar, currentParagraph, locale = 'en' } = await request.json();

    const profileContext = {
      explorer: "Focus on adventure, discovery, and exciting new developments.",
      philosopher: "Emphasize deep thinking, moral dilemmas, and philosophical themes.",
      survivor: "Highlight challenges, resilience, and survival instincts.",
      caregiver: "Focus on relationships, healing, and emotional connections."
    };

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

    const systemPrompt = `You are a creative storyteller. Generate 3 short, punchy story continuation options in ${targetLanguage}.

Style guide based on reader archetype:
${profileContext[profile as keyof typeof profileContext] || profileContext.explorer}

Requirements:
- Generate exactly 3 options in ${targetLanguage}
- Each option should be ONE short sentence (max 8-10 words)
- Make them exciting and action-focused
- Keep them very concise and punchy
- Focus on immediate next events
- Return as a JSON array of strings`;

    const userPrompt = `Current story: ${storySoFar}

Latest paragraph: ${currentParagraph}

Generate 3 very short, exciting options for what happens next in ${targetLanguage}. Keep each under 10 words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Try to parse as JSON, if not, split by newlines
    let options: string[] = [];
    try {
      const parsed = JSON.parse(content);
      options = Array.isArray(parsed) ? parsed : [];
    } catch {
      // Fallback: split by newlines and clean up
      options = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('-') && !line.startsWith('*'))
        .slice(0, 3);
    }

    // Ensure we have exactly 3 options
    while (options.length < 3) {
      options.push(`Continue the story in an interesting direction`);
    }

    return NextResponse.json({ options: options.slice(0, 3) });

  } catch (error) {
    console.error('Options generation error:', error);
    return NextResponse.json({ 
      options: [
        "Continue with an unexpected twist",
        "Focus on character development",
        "Introduce a new challenge"
      ] 
    }, { status: 500 });
  }
} 