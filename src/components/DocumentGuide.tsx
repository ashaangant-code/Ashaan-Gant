import React, { useState } from "react";
import { FileText, ShieldAlert, Award, Globe, HelpCircle, Check, ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  summary: string;
  requirements: string[];
  tips: string;
}

export default function DocumentGuide() {
  const [expandedId, setExpandedId] = useState<string | null>("passport");

  const categories: Category[] = [
    {
      id: "passport",
      title: "Primary Passport Requirements",
      icon: <Globe className="w-4.5 h-4.5 text-amber-500" />,
      summary: "Primary identification document. Must be in pristine physical condition.",
      requirements: [
        "Validity must exceed 6 months from the date of planned return.",
        "Must contain at least two empty, adjacent visa pages.",
        "Cannot be damaged, torn, or have faded stamps.",
        "Provide copies of previous visas (Schengen, UK, US, Canada) if applicable.",
      ],
      tips: "If your passport has less than 6 months validity, renew it first before booking any consulate appointments.",
    },
    {
      id: "finance",
      title: "Stamped Financial Statements",
      icon: <FileText className="w-4.5 h-4.5 text-amber-500" />,
      summary: "Proof of sufficient funds to support yourself during your stay.",
      requirements: [
        "3 to 6 months of active bank statements.",
        "Each page must be stamped by your bank (electronic seals are sometimes rejected).",
        "Maintain a healthy closing balance matching your travel itinerary cost.",
        "Avoid sudden, unexplained bulk deposits right before submission.",
      ],
      tips: "Consulates audit statements for transaction activity. A consistent balance is preferred over sudden cash injections.",
    },
    {
      id: "noc",
      title: "NOC Employment Letter",
      icon: <Award className="w-4.5 h-4.5 text-amber-500" />,
      summary: "No Objection Certificate from your current UAE sponsor/employer.",
      requirements: [
        "Must be on official company letterhead with company logo.",
        "Must state your exact salary, role, joining date, and approved travel dates.",
        "Must be signed and stamped by an authorized HR manager.",
        "For business owners: attach valid trade license copy.",
      ],
      tips: "Ensure the travel dates mentioned in the NOC match your flight ticket and hotel reservation exactly.",
    },
    {
      id: "photo",
      title: "Biometric Photographs",
      icon: <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />,
      summary: "Recent photos meeting exact biometric standards.",
      requirements: [
        "Taken within the last 6 months.",
        "Sized 35mm x 45mm (Schengen) or 2in x 2in (US) as applicable.",
        "High quality, white background, no shadows, teeth or hair covering ears.",
        "Neutral facial expression with both eyes fully open.",
      ],
      tips: "Do not reuse photos from old visa labels. Consulates scan your passport stamps and will reject old photos.",
    },
  ];

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="document-guide-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div>
        <h3 className="font-display font-semibold text-slate-100 text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Document Standard Guidelines
        </h3>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          Most visa refusals occur due to incorrect document formats or mismatching dates. Review our expert guidelines:
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const isExpanded = expandedId === cat.id;
          return (
            <div
              key={cat.id}
              className={`border rounded-xl transition-all duration-300 ${
                isExpanded ? "bg-slate-950 border-amber-500/20" : "bg-slate-950/40 border-slate-850"
              }`}
            >
              <button
                id={`doc-toggle-${cat.id}`}
                onClick={() => toggle(cat.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:text-amber-500 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5">
                  {cat.icon}
                  <span className="text-xs font-semibold text-slate-200">{cat.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 space-y-3 animate-fadeIn">
                  <p className="text-slate-400 leading-relaxed italic">{cat.summary}</p>
                  <ul className="space-y-1.5 pl-1.5 border-l border-amber-500/30">
                    {cat.requirements.map((req, index) => (
                      <li key={index} className="flex gap-2 items-start text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2.5 bg-amber-500/5 rounded-lg border border-amber-500/10 text-slate-300">
                    <strong className="text-amber-400">Pro Advisor Tip:</strong> {cat.tips}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
