"use client";

import React, { useState } from 'react';
import { Bot, MessageSquare, Sparkles, Send, Zap, HelpCircle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ChatbotPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const suggestions = [
    { icon: <GraduationCap size={16} />, text: "Find alumni in Google" },
    { icon: <MessageSquare size={16} />, text: "Draft a networking message" },
    { icon: <Zap size={16} />, text: "Upcoming events for engineers" },
    { icon: <HelpCircle size={16} />, text: "How do I update my profile?" },
  ];

  return (
    <div className="w-full h-[calc(100vh-100px)] flex gap-6 max-w-7xl mx-auto">

      {/* Sidebar */}
      <div className={`hidden lg:flex flex-col w-80 bg-white rounded-3xl border border-[#e4f0ff] p-6 shadow-sm flex-shrink-0 transition-all duration-300`}>
        
        {/* Top AI Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-[#e4f0ff] rounded-2xl flex items-center justify-center text-[#001145] mb-4">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#001145]">AI Assistant</h2>
          <p className="text-[#001145]/60 font-medium mt-1">Your personal alumni guide</p>
        </div>

        {/* Capabilities */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-[#001145]/40 uppercase tracking-wider mb-3">
              Capabilities
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-[#f8fbff] rounded-xl text-sm font-medium text-[#001145] border border-transparent hover:border-[#e4f0ff] transition-colors">
                <Sparkles size={16} className="text-blue-900" />
                <span>Smart Recommendations</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#f8fbff] rounded-xl text-sm font-medium text-[#001145] border border-transparent hover:border-[#e4f0ff] transition-colors">
                <Zap size={16} className="text-blue-900" />
                <span>Instant Alumni Search</span>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="text-xs font-bold text-[#001145]/40 uppercase tracking-wider mb-3">Try Asking</h3>
            <div className="space-y-2">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-[#e4f0ff] rounded-xl text-sm font-medium text-[#001145] hover:bg-[#e4f0ff] transition-colors text-left group shadow-sm hover:shadow-md"
                >
                  <span className="text-[#001145]/60 group-hover:text-[#001145] transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-auto pt-6 border-t border-[#e4f0ff]">
          <p className="text-xs text-center text-[#001145]/40 font-medium">
            This AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex-grow flex flex-col bg-white rounded-3xl border border-[#e4f0ff] shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#001145] via-[#4a5f7c] to-[#e4f0ff]"></div>

        <iframe
          src="https://sih-chatbot-1-8yd5.onrender.com/"
          className="w-full h-full border-none bg-white"
          title="AI Chatbot Interaction"
          allow="microphone"
        />
      </div>
    </div>
  );
}
