import React from "react";
import { MapPin, Phone, MessageSquare, Mail, Clock, Shield, Award, Compass } from "lucide-react";

export default function OfficeInfo() {
  const contact = {
    address: "AL Nakheel 2, Ajman, UAE",
    phone: "+971 56 628 5241",
    whatsapp: "+971 56 628 5241",
    email: "Tameralam0@gmail.com",
    hours: "Mon - Sat: 10:00 AM - 10:00 PM (Fri: 4:00 PM - 10:00 PM) | Sun: OFF",
  };

  const whatsappMessage = encodeURIComponent("Ahlan, I would like to inquire about visa services at Al Saqer Al Thahabi.");
  const whatsappUrl = `https://wa.me/${contact.whatsapp.replace(/\+/g, "").replace(/\s/g, "")}?text=${whatsappMessage}`;

  return (
    <div id="office-info-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Directory Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-amber-500" />
          <h3 className="font-display font-semibold text-slate-100 text-lg">
            Al Saqer Al Thahabi Offices
          </h3>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Premium visa consultants and document verification experts in Ajman, UAE. Visit or contact our office for complete, hassle-free processing.
        </p>
      </div>

      {/* Quick Interactive Portals */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          id="office-call-link"
          href={`tel:${contact.phone}`}
          className="flex flex-col items-center justify-center p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-amber-500/20 rounded-xl text-center group transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2 group-hover:scale-105 transition-transform">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300">Call Advisory</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{contact.phone}</span>
        </a>

        <a
          id="office-whatsapp-link"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-emerald-500/20 rounded-xl text-center group transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300">WhatsApp Chat</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">Instant Reply</span>
        </a>
      </div>

      {/* Directory Details */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 mt-0.5 shrink-0">
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Office Location
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {contact.address}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 mt-0.5 shrink-0">
            <Mail className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Email Support
            </h4>
            <a href={`mailto:${contact.email}`} className="text-xs text-amber-500 hover:text-amber-400 hover:underline">
              {contact.email}
            </a>
          </div>
        </div>

        {/* Office Hours */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 mt-0.5 shrink-0">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Consulting Hours
            </h4>
            <p className="text-xs text-slate-300">
              {contact.hours}
            </p>
          </div>
        </div>
      </div>

      {/* Credentials Banner */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-amber-500" /> Why Al Saqer Al Thahabi?
        </h4>
        <div className="space-y-2">
          <div className="flex gap-2.5 items-start">
            <span className="text-amber-500 text-xs font-bold mt-0.5">✓</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>99% Success Rate:</strong> Diligent document audits and compliance checks.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="text-amber-500 text-xs font-bold mt-0.5">✓</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Fast submissions:</strong> Direct booking of appointments for Schengen, UK, US, and Canada.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="text-amber-500 text-xs font-bold mt-0.5">✓</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>No hidden fees:</strong> Transparent consulting and document drafting services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
