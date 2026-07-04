import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, FileQuestion, BookOpen, AlertCircle, CheckCircle, Globe2, Compass, Languages } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<"faqs" | "countries" | "policy">("faqs");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How long does visa processing take?",
      answer: "Processing time depends entirely on the respective embassy and destination country. Some countries process within 5-15 working days, while others may take longer.",
    },
    {
      question: "Do you guarantee visa approval?",
      answer: "No. We are a visa consultancy company. We do not issue visas. Visa approval or rejection depends entirely on the respective embassy or immigration authority.",
    },
    {
      question: "Can you book consulate or embassy appointments?",
      answer: "Yes, we handle complete appointment booking, scheduling, and queue coordination for application submission centers.",
    },
    {
      question: "Can you check and audit my documents?",
      answer: "Yes, we provide diligent professional document checking to verify that your bank statements, NOC, passport, and photographs meet precise consulate parameters.",
    },
    {
      question: "Can you write and provide travel insurance?",
      answer: "Yes, we generate and issue standard worldwide and Schengen-compliant travel insurance policies matching your trip dates.",
    },
    {
      question: "Can you assist with flight and hotel bookings?",
      answer: "Yes, we book and provide authentic, verifiable hotel reservations and flight itineraries for visa processing purposes.",
    },
    {
      question: "Do I need to book an appointment to submit documents?",
      answer: "Yes, for almost all major countries (including Schengen, UK, US, Canada), an appointment at the VFS Global or corresponding submission center is mandatory.",
    }
  ];

  const schengenCountries = [
    "Austria", "Belgium", "Croatia", "Czech Republic", "Denmark", "Estonia",
    "Finland", "France", "Germany", "Greece", "Hungary", "Iceland",
    "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
    "Netherlands", "Norway", "Poland", "Portugal", "Slovakia", "Slovenia",
    "Spain", "Sweden", "Switzerland", "Romania", "Bulgaria"
  ];

  const otherCountries = ["Saudi Arabia", "United Arab Emirates", "United Kingdom", "United States", "Canada", "Australia", "New Zealand", "Japan", "China"];

  return (
    <div id="knowledge-base-root" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h3 className="font-display font-semibold text-slate-100 text-lg">
            Advisory Knowledge Base
          </h3>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Official guidelines, policies, handled countries, and frequently asked questions for Al Saqer Al Thahabi.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs">
        <button
          id="kb-tab-faqs"
          onClick={() => setActiveTab("faqs")}
          className={`pb-2.5 px-4 font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "faqs" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Frequently Asked (FAQs)
        </button>
        <button
          id="kb-tab-countries"
          onClick={() => setActiveTab("countries")}
          className={`pb-2.5 px-4 font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "countries" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Destinations Handled
        </button>
        <button
          id="kb-tab-policy"
          onClick={() => setActiveTab("policy")}
          className={`pb-2.5 px-4 font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === "policy" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Company Policies
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[220px]">
        {activeTab === "faqs" && (
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-850 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    id={`faq-toggle-${idx}`}
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:text-amber-400 transition-all duration-150"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileQuestion className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-200">{faq.question}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-350 leading-relaxed border-t border-slate-900/50 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "countries" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-amber-500" /> Europe Schengen Nations ({schengenCountries.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
                {schengenCountries.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="text-amber-500/60">•</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-500" /> Additional Global Destinations
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
                {otherCountries.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <span className="text-emerald-500/70">✓</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "policy" && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Important Regulatory Notice
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Al Saqer Al Thahabi is a licensed private visa consultancy, travel facilitator, and document processing agent based in Ajman, UAE.
              </p>
              <p className="text-slate-400 leading-relaxed font-semibold">
                We are NOT an embassy, consulate, or government authority, and we DO NOT issue visas. Visa approval or rejection is at the sole discretion of the respective foreign embassy or immigration authority.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3 text-xs">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-amber-500" /> Multi-lingual Support
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Our in-office travel coordinators and digital AI consultants are fully fluent to guide you in multiple global languages:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["English", "العربية (Arabic)", "اردو (Urdu)", "ਪੰਜਾਬੀ / पंजाबी (Punjabi)"].map((lang, idx) => (
                  <span key={idx} className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg font-medium text-slate-300 text-[11px]">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
