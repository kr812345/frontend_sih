"use client";

import { useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle } from "lucide-react";

export default function ChatPage() {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    if (!message.trim() || !socket.current) return;

    socket.current.emit("send-message", message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("receive-message", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.current?.off("receive-message");
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Real-time Chat
              </h1>
              <p className="text-sm text-gray-600">
                Powered by Socket.IO • Open in multiple tabs to test
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="shadow-2xl backdrop-blur-sm bg-white/90 border-0 overflow-hidden">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-white to-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start typing to send your first message
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className="group animate-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-[80%] shadow-md group-hover:shadow-lg transition-shadow">
                    <p className="text-sm leading-relaxed">{msg}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-3">
              <Input
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                🚀 Testing Instructions
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Open this page in multiple browser tabs or windows to see
                real-time message broadcasting in action!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
