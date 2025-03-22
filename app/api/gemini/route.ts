// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Define the system prompt for the fitness assistant
const SYSTEM_PROMPT = `You are a highly knowledgeable fitness assistant. Your goal is to create a detailed and personalized fitness plan based on the user's goals, experience level, available equipment, and schedule or help the user with anything related to fitness, working out, the gym etc. 
The plan should include:
- A structured weekly workout routine (including exercises, sets, reps, and rest times).
- A progression strategy to ensure continuous improvement.
- Warm-up and cool-down routines.
- Nutrition guidance tailored to the user’s fitness goals.
- Recovery tips and injury prevention strategies.
- Any additional recommendations based on the user's preferences.

Say "Hi, I am Iron. How can I help you reach your fitness goals?" as the first message to see how you can help the user. Then in following messages ask relevant questions to gather user information, then generate a well-structured response. `;

// Handle POST request to interact with Gemini API
export async function POST(req: NextRequest) {
  try {
    const { messages, userEmail } = await req.json();

    // If there's no chat history, include the SYSTEM_PROMPT in the history
    const isFirstMessage = messages.length === 1 && messages[0].message === SYSTEM_PROMPT;

    const chat = model.startChat({
      history: isFirstMessage
        ? [{ role: 'user', parts: [{ text: SYSTEM_PROMPT }] }] // Add SYSTEM_PROMPT on first interaction
        : messages.map((msg: { sender: 'user' | 'ai'; message: string }) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.message }],
          })),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].message);
    const aiResponse = result.response.text();

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}