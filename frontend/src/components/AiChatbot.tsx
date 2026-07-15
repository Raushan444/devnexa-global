"use client";
import { API_BASE_URL } from "@/config/api";

import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, RefreshCw } from "lucide-react";

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: String }>>([
    { sender: "bot", text: "Hello! I am the DevNexa AI assistant. How can I help you today?" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = inputVal;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInputVal("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I am having trouble connecting to my brain right now." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: `Failed to connect to backend server. Make sure Spring Boot (${API_BASE_URL}) is running!` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Liquid Trigger Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 liquid-glass-icon bg-gradient-to-tr from-[#7C3AED] via-[#2563EB] to-[#00E5FF] text-white shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 transition-all hover:scale-110 flex items-center justify-center cursor-pointer border-none"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] h-[480px] glass-card flex flex-col justify-between overflow-hidden shadow-2xl animate-fade-in border-white/10">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00E5FF]" />
              <div>
                <h4 className="font-grotesk font-bold text-xs text-white">DevNexa Assistant</h4>
                <span className="text-[9px] text-[#00E5FF] uppercase font-mono font-bold tracking-widest">Powered by Gemini</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex max-w-[80%] flex-col ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`p-3 rounded-2xl text-xs leading-normal ${
                  msg.sender === "user"
                    ? "bg-[#2563EB] text-white rounded-tr-none shadow-md"
                    : "bg-white/5 text-slate-300 rounded-tl-none border border-white/5"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-black/20 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00E5FF]/40"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] text-white hover:scale-105 transition-all flex items-center justify-center cursor-pointer border-none"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
