'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { db, doc, setDoc, getDoc } from '../../lib/firebase';

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
}

const SYSTEM_PROMPT: ChatMessage = {
  sender: 'user', // Send as user message to trigger the system prompt in Gemini
  message: `You are a highly knowledgeable fitness assistant. Your goal is to create a detailed and personalized fitness plan based on the user's goals, experience level, available equipment, and schedule or help the user with anything related to fitness, working out, the gym etc. 
The plan should include:
- A structured weekly workout routine (including exercises, sets, reps, and rest times).
- A progression strategy to ensure continuous improvement.
- Warm-up and cool-down routines.
- Nutrition guidance tailored to the user’s fitness goals.
- Recovery tips and injury prevention strategies.
- Any additional recommendations based on the user's preferences.

Say "Hi, I am Iron. How can I help you reach your fitness goals?" as the first message to see how you can help the user. Then in following messages ask relevant questions to gather user information, then generate a well-structured response. `,
};

const ChatBox: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?.email) {
      const chatRef = doc(db, 'chats', session.user.email);
      getDoc(chatRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setMessages(docSnapshot.data()?.messages || []);
        } else {
          // If no history, add the SYSTEM_PROMPT as the first user message and trigger AI response
          setMessages([SYSTEM_PROMPT]);
          setDoc(chatRef, { messages: [SYSTEM_PROMPT] });

          // Send the system prompt to AI after it's stored in the database
          sendMessage(SYSTEM_PROMPT.message);
        }
      });
    }
  }, [session]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !session?.user?.email) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user' as 'user', message }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userEmail: session.user.email }),
      });

      const data = await response.json();
      const aiResponse: string = data.message || 'Sorry, I could not generate a response.';

      const updatedMessages = [...newMessages, { sender: 'ai' as 'ai', message: aiResponse }];
      setMessages(updatedMessages);

      const chatRef = doc(db, 'chats', session.user.email);
      await setDoc(chatRef, { messages: updatedMessages });
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages
          .filter((msg) => msg.sender !== 'user' || msg.message !== SYSTEM_PROMPT.message) // Hide the SYSTEM_PROMPT message
          .map((msg, idx) => (
            <div key={idx} className={msg.sender}>
              <p>{msg.message}</p>
            </div>
          ))}
        {loading && <p className="loading">AI is thinking...</p>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;