// app/api/gemini/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Start a new chat if no conversation exists
    let chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    // Send the message and get the response
    const result = await chat.sendMessage(prompt);

    return NextResponse.json({ message: result.response.text() });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return NextResponse.json({ error: 'Failed to generate response from AI.' }, { status: 500 });
  }
}
