// app/components/ChatBox.tsx
'use client';

import React, { useState } from 'react';

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');

  // Function to send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add user message to the chat
    const newMessages: ChatMessage[] = [...messages, { sender: 'user', message: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response (you'll integrate OpenAI API later)
    const aiResponse = 'This is an AI response based on your input!';
    setMessages([...newMessages, { sender: 'ai', message: aiResponse } as ChatMessage]);
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
