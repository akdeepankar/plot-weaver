import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, profile, paragraphIndex, previousParagraphs, selectedOption, useEmojis = true, locale = "en", mood = "neutral", context } = await request.json();

    const profileContext = {
      explorer: "Write in an adventurous, discovery-focused style with vivid descriptions and exciting action.",
      philosopher: "Write with deep introspection, philosophical themes, and contemplative prose that makes readers think.",
      survivor: "Write with raw honesty, gritty realism, and emotional intensity that captures the struggle of survival.",
      caregiver: "Write with warmth, empathy, and emotional depth, focusing on relationships and healing."
    };

    const moodContext = {
      neutral: "Maintain a balanced, neutral mood.",
      happy: "Make the story feel happy, uplifting, and positive.",
      sad: "Give the story a sad, emotional, or bittersweet tone.",
      excited: "Make the story energetic, thrilling, and full of excitement.",
      relaxed: "Give the story a calm, peaceful, and relaxing mood."
    };

    const emojiInstruction = useEmojis 
      ? "Use relevant emojis throughout the paragraph to enhance the storytelling and make it more engaging. Place emojis naturally within sentences to emphasize emotions, actions, or key moments."
      : "Do not use any emojis in the text.";

    // Context-aware prompt generation
    let contextPrompt = "";
    if (context) {
      const timeContexts = {
        morning: "Create an energizing, optimistic tone perfect for starting the day.",
        afternoon: "Use a balanced, engaging tone suitable for midday focus.",
        evening: "Craft a reflective, calming tone perfect for winding down.",
        night: "Write with a contemplative, peaceful tone suitable for late hours."
      };
      
      const weatherContexts = {
        sunny: "Include bright, uplifting elements and outdoor scenes.",
        cloudy: "Use a balanced tone with moments of both brightness and reflection.",
        rainy: "Incorporate cozy, indoor elements and contemplative moments.",
        snowy: "Include magical, peaceful elements and winter wonder.",
        stormy: "Use dramatic elements but balance with moments of calm.",
        unknown: "Maintain a neutral, adaptable tone."
      };
      
      const seasonContexts = {
        spring: "Include themes of renewal, growth, and new beginnings.",
        summer: "Incorporate warmth, adventure, and vibrant energy.",
        autumn: "Use themes of change, reflection, and cozy moments.",
        winter: "Include elements of magic, warmth, and peaceful contemplation."
      };
      
      contextPrompt = `
      Context-aware storytelling:
      Time of day: ${timeContexts[context.timeOfDay as keyof typeof timeContexts] || timeContexts.afternoon}
      Weather: ${weatherContexts[context.weather as keyof typeof weatherContexts] || weatherContexts.unknown}
      Season: ${seasonContexts[context.season as keyof typeof seasonContexts] || seasonContexts.summer}
      ${context.location.city ? `Location: Consider the cultural and environmental context of ${context.location.city}.` : ''}
      `;
    }

    const systemPrompt = `You are a master storyteller. Write one compelling paragraph (3-5 sentences) that continues the story. 
    
    Style guide based on reader archetype:
    ${profileContext[profile as keyof typeof profileContext] || profileContext.explorer}
    
    Mood: ${moodContext[mood as keyof typeof moodContext] || moodContext.neutral}
    
    ${contextPrompt}
    
    Emoji usage: ${emojiInstruction}
    
    Language: Write in ${locale === "en" ? "English" : locale === "es" ? "Spanish" : locale === "fr" ? "French" : locale === "de" ? "German" : locale === "it" ? "Italian" : "English"}
    
    Important rules:
    - Write exactly ONE paragraph (3-5 sentences)
    - Do not include chapter numbers or section breaks
    - Continue the story naturally from where it left off
    - Make each paragraph feel complete but leave room for continuation
    - Use vivid imagery and engaging prose
    - Match the tone and style of previous paragraphs if continuing
    - Write in the specified language`;

    const userPrompt = paragraphIndex === 0 
      ? `Start a story with this premise: ${prompt}`
      : selectedOption 
        ? `Continue the story following this specific direction: "${selectedOption}". Previous paragraphs: ${previousParagraphs.join('\n\n')}`
        : `Continue the story from where it left off. Previous paragraphs: ${previousParagraphs.join('\n\n')}`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: true,
      temperature: 0.8,
      max_tokens: 200,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
} 