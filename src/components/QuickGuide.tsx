import React, { useState } from "react";
import { Compass, CheckCircle, HelpCircle, FileText, Globe, AlertTriangle, ArrowRight } from "lucide-react";
import { VisaProfile } from "../types";

interface QuickGuideProps {
  onStartConsultation: (profile: VisaProfile) => void;
  isLoading: boolean;
}

const COMMON_NATIONALITIES = [
  "United Arab Emirates",
  "India",
  "Pakistan",
  "Lebanon",
  "Syria",
  "Egypt",
  "Jordan",
  "United Kingdom",
  "Philippines",
  "South Africa",
];

const COMMON_DESTINATIONS = [
  "France (Schengen)",
  "Germany (Schengen)",
  "United Kingdom",
  "United States",
  "Japan",
  "Saudi Arabia",
  "Canada",
  "Turkey",
];

export default function QuickGuide({ onStartConsultation, isLoading }: QuickGuideProps) {
  const [profile, setProfile] = useState<VisaProfile>({
    nationality: "",
    destination: "",
    purpose: "",
    duration: "",
    hasPassport: false,
    hasPhoto: false,
    hasResidency: false,
    hasNoc: false,
    hasBankStatement: false,
    hasInsurance: false,
  });

  const [customNationality, setCustomNationality] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [error, setError] = useState("");

  const handleCheckboxChange = (field: keyof VisaProfile) => {
    setProfile((prev) => ({ ...prev, [field]: !prev[field] as any }));
  };

  const getReadinessScore = () => {
    let score = 0;
    if (profile.hasPassport) score += 25;
    if (profile.hasPhoto) score += 15;
    if (profile.hasResidency) score += 15;
    if (profile.hasNoc) score += 15;
    if (profile.hasBankStatement) score += 20;
    if (profile.hasInsurance) score += 10;
    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const finalProfile = {
      ...profile,
      nationality: profile.nationality === "Other" ? customNationality : profile.nationality,
      destination: profile.destination === "Other" ? customDestination : profile.destination,
    };
    if (!finalProfile.nationality || !finalProfile.destination) {
      setError("Please specify both your nationality and destination country.");
      return;
    }
    onStartConsultation(finalProfile);
  };

  const score = getReadinessScore();

  return (
    <div id="quick-guide-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-amber-500" />
        <h3 className="font-display font-semibold text-slate-100 text-lg">
          Visa Eligibility Profiler
        </h3>
      </div>
      <p className="text-slate-400 text-xs mb-5 leading-relaxed">
        Establish your travel profile below. Our AI consultant will analyze your inputs and recommend the matching visa and specific document requirements.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nationality Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-500" /> 1. Nationality / Passport
          </label>
          <select
            id="nationality-select"
            value={profile.nationality}
            onChange={(e) => setProfile((p) => ({ ...p, nationality: e.target.value }))}
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-all duration-200"
            required
          >
            <option value="">-- Select Nationality --</option>
            {COMMON_NATIONALITIES.map((nat) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
            <option value="Other">Other Nationality (Type below)</option>
          </select>

          {profile.nationality === "Other" && (
            <input
              id="custom-nationality-input"
              type="text"
              value={customNationality}
              onChange={(e) => setCustomNationality(e.target.value)}
              placeholder="Type your nationality..."
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm mt-2 focus:outline-none transition-all duration-200"
              required
            />
          )}
        </div>

        {/* Destination Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-500" /> 2. Destination Country
          </label>
          <select
            id="destination-select"
            value={profile.destination}
            onChange={(e) => setProfile((p) => ({ ...p, destination: e.target.value }))}
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-all duration-200"
            required
          >
            <option value="">-- Select Destination --</option>
            {COMMON_DESTINATIONS.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
            <option value="Other">Other Destination (Type below)</option>
          </select>

          {profile.destination === "Other" && (
            <input
              id="custom-destination-input"
              type="text"
              value={customDestination}
              onChange={(e) => setCustomDestination(e.target.value)}
              placeholder="Type destination country..."
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm mt-2 focus:outline-none transition-all duration-200"
              required
            />
          )}
        </div>

        {/* Purpose */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            3. Travel Purpose
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["Tourism", "Business", "Transit", "Education"] as const).map((purp) => (
              <button
                key={purp}
                type="button"
                onClick={() => setProfile((p) => ({ ...p, purpose: purp }))}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  profile.purpose === purp
                    ? "bg-amber-500/10 border-amber-500 text-amber-400"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                {purp}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Checklist & Readiness */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            4. Document Inventory
          </label>
          <p className="text-[11px] text-slate-500">Check documents you currently have prepared:</p>

          <div className="space-y-2">
            {[
              { id: "hasPassport", label: "Valid Passport (>6 months remaining)" },
              { id: "hasPhoto", label: "Biometric Photos (White BG)" },
              { id: "hasResidency", label: "UAE Residency Visa / EID (If applicable)" },
              { id: "hasNoc", label: "NOC Letter / Employment Certificate" },
              { id: "hasBankStatement", label: "3-6 Months Stamped Bank Statement" },
              { id: "hasInsurance", label: "Schengen/Global Travel Insurance" },
            ].map((doc) => (
              <label
                key={doc.id}
                className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={profile[doc.id as keyof VisaProfile] as boolean}
                  onChange={() => handleCheckboxChange(doc.id as keyof VisaProfile)}
                  className="rounded border-slate-800 text-amber-500 focus:ring-amber-500 bg-slate-950 w-4 h-4"
                />
                <span>{doc.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Document Readiness score:</span>
            <span
              className={`font-mono font-bold ${
                score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400"
              }`}
            >
              {score}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            {score === 100
              ? "Excellent! All standard documents are verified. Submit to consult."
              : "We will consult on the outstanding requirements."}
          </p>
        </div>

        {/* Start Inquiry Button */}
        <button
          id="profile-consultation-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/20"
        >
          <span>Evaluate Travel Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
