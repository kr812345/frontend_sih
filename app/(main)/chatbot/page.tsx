"use client";

import React from 'react';

export default function ChatbotPage() {
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#001339]">AI Assistant</h1>
        <p className="text-slate-500">How can I help you today?</p>
      </div>
      
      <div className="flex-grow w-full border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <iframe 
          src="https://sih-chatbot-1-8yd5.onrender.com/"
          className="w-full h-full border-0"
          title="AI Chatbot"
          allow="microphone"
        />
      </div>
    </div>
  );
}
