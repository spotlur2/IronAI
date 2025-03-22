// app/components/ChatBox.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { db, doc, setDoc, getDoc } from '../../lib/firebase';

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
}

const ChatBox: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (session?.user?.email) {
      // Fetch chat history from Firestore when the user logs in
      const chatRef = doc(db, 'chats', session.user.email);
      getDoc(chatRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setMessages(docSnapshot.data()?.messages || []);
        }
      });
    }
  }, [session]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (session?.user?.email) {
      // Add user message to chat history
      const newMessages: ChatMessage[] = [
        ...messages,
        { sender: 'user', message: input },
      ];
      setMessages(newMessages);
      setInput('');

      try {
        // Send message to Gemini API via Next.js route
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),
        });

        const data = await response.json();
        const aiResponse = data.message || 'Sorry, I could not generate a response.';

        // Add AI response to chat history
        setMessages([...newMessages, { sender: 'ai', message: aiResponse }]);

        // Save chat history to Firestore
        const chatRef = doc(db, 'chats', session.user.email);
        await setDoc(chatRef, { messages: [...newMessages, { sender: 'ai', message: aiResponse }] });
      } catch (error) {
        console.error('Error fetching AI response:', error);
      }
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
