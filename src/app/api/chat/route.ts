import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiText } from '@/lib/geminiGenerate';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { question, code, language } = body as {
      question?: string;
      code?: string;
      language?: string;
    };

    if (typeof question !== 'string' || !question.trim()) {
      return NextResponse.json({ error: 'Missing question.' }, { status: 400 });
    }
    if (typeof code !== 'string') {
      return NextResponse.json({ error: 'Missing code context.' }, { status: 400 });
    }

    const lang = typeof language === 'string' ? language : 'code';

    const prompt = `You are a helpful coding tutor in DevSphere.\nThe user is working with this ${lang} code:\n\`\`\`${lang}\n${code}\n\`\`\`\nUser's question: ${question}\nAnswer concisely and helpfully.`;

    const text = await generateGeminiText(prompt, apiKey);

    return NextResponse.json({ text });
  } catch (err: unknown) {
    console.error('Error in /api/chat:', err);
    const message = err instanceof Error ? err.message : 'Failed to get answer from Gemini';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
