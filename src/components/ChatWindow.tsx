import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, ArrowRight, Loader2, Compass, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearHistory: () => void;
}

const SUGGESTIONS = [
  "What are the Schengen visa requirements for UAE residents?",
  "I'm Indian planning to visit Saudi Arabia. What do I need?",
  "What documents are required for a UK tourist visa?",
  "I don't have a salary certificate. Can I still apply?",
];

export default function ChatWindow({
  messages,
  onSendMessage,
  isLoading,
  onClearHistory,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div id="chat-window-container" className="flex flex-col h-[600px] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div id="chat-header" className="px-6 py-4 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-500">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-amber-500 text-sm md:text-base tracking-wide flex items-center gap-1.5">
              Al Saqer AI Visa Consultant
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h3>
            <p className="text-xs text-slate-400">Senior Travel Advisory Board</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              id="clear-chat-btn"
              onClick={onClearHistory}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Clear Consultation History"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div id="chat-messages" className="flex-1 overflow-y-auto px-6 py-4 bg-slate-950/40 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-md mx-auto py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4"
            >
              <Bot className="w-8 h-8" />
            </motion.div>
            <h4 className="font-display text-lg font-medium text-slate-200 mb-2">
              Welcome to Al Saqer Al Thahabi
            </h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Ahlan wa sahlan. I am your premium visa & travel assistant. Please ask any questions regarding destination visas, document verification, or eligibility.
            </p>

            <div className="w-full text-left">
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest block mb-2 text-center">
                Frequently Asked Inquiries
              </span>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => !isLoading && onSendMessage(s)}
                    className="text-left text-xs bg-slate-900 disabled:opacity-50 disabled:pointer-events-none hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/20 p-3 rounded-xl transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{s}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200 text-amber-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 mt-1 shadow-inner">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                      m.role === "user"
                        ? "bg-amber-600 text-white rounded-tr-none font-medium"
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    {m.content}
                    <div
                      className={`text-[10px] mt-1.5 font-mono ${
                        m.role === "user" ? "text-amber-200/80 text-right" : "text-slate-500 text-left"
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1 shadow-inner">
                      <User className="w-4.5 h-4.5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3.5 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 mt-1 animate-pulse">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2">
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-amber-500" />
                  <span>Analyzing requirements and verifying rules...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer input form */}
      <form
        id="chat-input-form"
        onSubmit={handleSend}
        className="p-4 bg-slate-950 border-t border-amber-500/20 flex gap-2 items-center"
      >
        <input
          id="chat-message-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe your travel plan (e.g., I am Lebanese going to Germany...)"
          disabled={isLoading}
          className="flex-1 bg-slate-900 hover:bg-slate-900/80 focus:bg-slate-900 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 py-3 border border-slate-800 focus:border-amber-500 focus:outline-none transition-all duration-200 disabled:opacity-60"
        />
        <button
          id="send-message-btn"
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl transition-all duration-200 shrink-0 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-amber-950/20"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-500" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
