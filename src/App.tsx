import React, { useState } from "react";
import { Compass, CheckCircle, HelpCircle, FileText, Globe, AlertTriangle, ArrowRight, MessageSquare, PhoneCall, Mail, Clock, Award, Shield } from "lucide-react";
import { Message, VisaProfile } from "./types";
import ChatWindow from "./components/ChatWindow";
import QuickGuide from "./components/QuickGuide";
import OfficeInfo from "./components/OfficeInfo";
import DocumentGuide from "./components/DocumentGuide";
import WhatsAppTester from "./components/WhatsAppTester";
import KnowledgeBase from "./components/KnowledgeBase";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: text,
      timestamp: formatTimestamp(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Proxying to our server-side API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server response was not okay");
      }

      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.reply,
        timestamp: formatTimestamp(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("Failed to fetch response:", error);
      
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: `Masa'a Al Khair (Good evening). I apologize, but I am currently facing a connection issue while communicating with our visa systems.\n\nTo ensure your query is addressed with absolute accuracy, please contact our office directly where our senior travel experts are ready to assist you:\n\n📞 Phone: +971 56 628 5241\n💬 WhatsApp: +971 56 628 5241\n📧 Email: Tameralam0@gmail.com\n📍 AL Nakheel 2, Ajman, UAE\n\nAhlan wa Sahlan—we look forward to verifying your requirements!`,
        timestamp: formatTimestamp(),
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsultationFromProfile = (profile: VisaProfile) => {
    const checkedDocs: string[] = [];
    const missingDocs: string[] = [];

    const docMap = {
      hasPassport: "Valid Passport (>6 months)",
      hasPhoto: "Biometric Photos (White BG)",
      hasResidency: "UAE Residence Visa / EID",
      hasNoc: "Company NOC Letter",
      hasBankStatement: "Stamped Bank Statements (3-6m)",
      hasInsurance: "Travel Insurance",
    };

    Object.entries(docMap).forEach(([key, label]) => {
      if (profile[key as keyof VisaProfile]) {
        checkedDocs.push(label);
      } else {
        missingDocs.push(label);
      }
    });

    const purposeStr = profile.purpose ? ` for ${profile.purpose}` : "";

    const text = `Ahlan! Please evaluate my visa requirements. Here is my traveler profile:
• Nationality: ${profile.nationality}
• Destination: ${profile.destination}${purposeStr}

I have already prepared the following documents:
${checkedDocs.length > 0 ? checkedDocs.map((d) => `  - ✓ ${d}`).join("\n") : "  - None" }

I still need clarification on these requirements:
${missingDocs.length > 0 ? missingDocs.map((d) => `  - ? ${d}`).join("\n") : "  - None" }

What visa type do you recommend, what exact documents are required, and how do I submit my application through your office?`;

    handleSendMessage(text);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Luxurious Header Bar */}
      <header className="bg-slate-900 border-b border-amber-500/20 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 p-[1px] shadow-lg shadow-amber-950/20">
              <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center text-amber-500">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 tracking-wide uppercase">
                Al Saqer Al Thahabi
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-widest uppercase">
                Visa Services & Travel Consultant
              </p>
            </div>
          </div>
          
          {/* Quick Contact Badge */}
          <div className="hidden md:flex items-center gap-4 bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Premium Support</p>
              <p className="text-xs font-mono font-semibold text-amber-500">+971 56 628 5241</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner / Introductory Section */}
      <div className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden border-b border-slate-900">
        {/* Abstract Golden Backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full tracking-wide">
            <Award className="w-3.5 h-3.5" /> Licensed Government Submission Partner
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-none max-w-3xl mx-auto">
            World-Class Visa Processing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 font-normal italic">
              Made Simple & Hassle-Free
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to Al Saqer Al Thahabi (The Golden Falcon). We specialize in securing Schengen, UK, US, Canada, Japan, and GCC visas. Evaluate your eligibility and documents below with our AI Senior Consultant, then contact our offices to submit.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick eligibility profiler and contact directories (span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <QuickGuide
              onStartConsultation={handleStartConsultationFromProfile}
              isLoading={isLoading}
            />
            
            <WhatsAppTester />
            
            <OfficeInfo />
          </div>

          {/* Right Column: AI Consultant Chat area and Document Reference panel (span 7) */}
          <div className="lg:col-span-7 space-y-8">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onClearHistory={handleClearHistory}
            />
            
            <DocumentGuide />
            
            <KnowledgeBase />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <p>© {new Date().getFullYear()} Al Saqer Al Thahabi Visa Services. All Rights Reserved.</p>
        <p className="text-[10px] text-slate-600 max-w-md mx-auto leading-normal">
          Disclaimer: Visa processing is subject to authority approvals. Requirements are retrieved for general advisory purposes and verified directly at our office. Never submit false documentation.
        </p>
      </footer>
    </div>
  );
}
