"use client";
import { API_BASE_URL } from "@/config/api";
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, RefreshCw, Trash2, Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [userExchangeCount, setUserExchangeCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("devnexa_chat_history");
      if (stored) {
        try {
          setMessages(JSON.parse(stored));
        } catch (e) {
          initDefaultMessage();
        }
      } else {
        initDefaultMessage();
      }
    }
  }, []);

  // Save chat history on update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("devnexa_chat_history", JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const initDefaultMessage = () => {
    setMessages([
      { sender: "bot", text: "Hello! I am Devna, your DevNexa digital agency assistant. How can I help you scope or scale your project today?" }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent | string) => {
    if (typeof e !== "string") {
      e.preventDefault();
    }
    const messageText = typeof e === "string" ? e : inputVal;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    if (typeof e !== "string") {
      setInputVal("");
    }
    setUserExchangeCount((prev) => prev + 1);
    setLoading(true);

    const systemPrompt = "You are Devna, the AI assistant for DevNexa Global, a premium digital agency. We specialize in: Web Development, Mobile Apps, AI Solutions, SaaS, CRM, ERP. Our pricing starts at $3,000. Response times: 24 hours. We offer free consultations. Always be professional, helpful, and encourage visitors to book a call or request a quote. If someone mentions a project, ask about their budget and timeline. Keep answers concise.\n\nUser Message: " + messageText;

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: systemPrompt })
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

  const clearHistory = () => {
    localStorage.removeItem("devnexa_chat_history");
    initDefaultMessage();
    setUserExchangeCount(0);
  };

  const quickReplies = [
    "What services do you offer?",
    "How much does a website cost?",
    "Book a consultation",
    "View our portfolio"
  ];

  const handleQuickReply = (reply: string) => {
    if (reply === "Book a consultation") {
      setIsOpen(false);
      window.location.href = "/booking";
      return;
    }
    handleSendMessage(reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Trigger Button */}
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
        <div className="w-[360px] sm:w-[420px] h-[550px] sm:h-[580px] glass-card flex flex-col justify-between overflow-hidden shadow-2xl animate-fade-in border-white/10">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] flex items-center justify-center font-bold text-xs text-white">
                DN
              </div>
              <div>
                <h4 className="font-grotesk font-bold text-xs text-white">Devna</h4>
                <span className="text-[9px] text-[#00E5FF] uppercase font-mono font-bold tracking-widest">AI Strategist</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearHistory}
                title="Clear Chat History"
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[380px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex max-w-[85%] flex-col ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] text-white rounded-tr-none shadow-md"
                    : "bg-white/5 text-slate-300 rounded-tl-none border border-white/5"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Lead Capture Card after 2 exchanges */}
            {userExchangeCount >= 2 && (
              <div className="w-full bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-2xl p-4 text-center space-y-3">
                <p className="font-sans text-[11px] text-slate-300">
                  Ready to map out project specifics and secure a formal pricing breakdown?
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    href="/quote"
                    onClick={() => setIsOpen(false)}
                    className="py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#2563EB] font-sans font-bold text-[10px] text-white flex items-center gap-1.5"
                  >
                    <FileText className="w-3 h-3" />
                    Request Quote
                  </Link>
                  <Link
                    href="/booking"
                    onClick={() => setIsOpen(false)}
                    className="py-1.5 px-3.5 rounded-lg border border-white/10 hover:bg-white/5 font-sans font-bold text-[10px] text-slate-300"
                  >
                    Book Call
                  </Link>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                <span>Formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(reply)}
                  className="text-[10px] font-sans text-slate-400 bg-white/5 border border-white/5 rounded-full px-3 py-1 hover:border-[#00E5FF]/30 hover:text-white transition-all cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Panel */}
          <div className="border-t border-white/5 bg-black/20">
            <form onSubmit={handleSendMessage} className="p-3 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Message Devna..."
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
            <div className="px-4 pb-3 flex justify-between items-center text-[9px] text-slate-500 font-sans border-t border-white/5 pt-2 bg-black/40">
              <span>Escalate queries:</span>
              <Link href="/booking" onClick={() => setIsOpen(false)} className="text-[#00E5FF] hover:underline flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Schedule Strategy Session
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
