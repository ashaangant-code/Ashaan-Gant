import React, { useState } from "react";
import { MessageSquare, Key, AlertCircle, CheckCircle2, Send, HelpCircle, ArrowRight, Loader2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function WhatsAppTester() {
  const [recipient, setRecipient] = useState("+971 56 628 5241");
  const [messageText, setMessageText] = useState("Ahlan! This is a test message from Al Saqer Al Thahabi AI assistant.");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "not_configured" | "error";
    text: string;
    details?: any;
  }>({ type: "idle", text: "" });

  const handleTestSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !messageText.trim() || isLoading) return;

    setIsLoading(true);
    setStatus({ type: "idle", text: "" });

    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipient, message: messageText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with the server-side WhatsApp handler.");
      }

      if (data.status === "not_configured") {
        setStatus({
          type: "not_configured",
          text: "WhatsApp Cloud API is not yet configured on the server. Please define WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in your environment secrets.",
        });
      } else if (data.success) {
        setStatus({
          type: "success",
          text: `Message dispatched successfully via WhatsApp Cloud API! Message ID: ${data.data?.messages?.[0]?.id || "N/A"}.`,
          details: data.data,
        });
      } else {
        setStatus({
          type: "error",
          text: data.error || "An error occurred while sending the message.",
        });
      }
    } catch (error: any) {
      console.error("Test send failed:", error);
      setStatus({
        type: "error",
        text: error.message || "Could not complete the API request. Please verify your internet connection and backend status.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const directWhatsappUrl = `https://wa.me/${recipient.replace(/\+/g, "").replace(/\s/g, "")}?text=${encodeURIComponent(messageText)}`;

  return (
    <div id="whatsapp-tester-container" className="bg-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <MessageSquare className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-bold text-slate-100 text-base">
            WhatsApp API Hub
          </h3>
          <p className="text-slate-400 text-xs">Official WhatsApp Business Cloud Integration</p>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed">
        Deliver instant visa applications and advisory updates straight to user devices. Connect your Meta Developer WhatsApp Account below.
      </p>

      <form onSubmit={handleTestSend} className="space-y-4">
        {/* Recipient Phone */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Recipient Phone Number (with Country Code)
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
            <input
              id="whatsapp-test-to"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="+971 56 628 5241"
              className="w-full bg-slate-950 text-slate-200 border border-slate-850 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none font-mono transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Message body */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Template Message / Text
          </label>
          <textarea
            id="whatsapp-test-body"
            rows={3}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 border border-slate-850 focus:border-amber-500 rounded-xl px-4 py-3 text-xs focus:outline-none transition-all duration-200 resize-none"
            placeholder="Write your custom message..."
            required
          />
        </div>

        {/* Trigger Button */}
        <button
          id="send-whatsapp-test-btn"
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-semibold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/25"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Connecting to Meta Platform...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send WhatsApp via API</span>
            </>
          )}
        </button>
      </form>

      {/* State Callouts */}
      <AnimatePresence mode="wait">
        {status.type !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-xl text-xs leading-relaxed space-y-3 border ${
              status.type === "success"
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                : status.type === "not_configured"
                ? "bg-amber-500/5 border-amber-500/20 text-amber-300"
                : "bg-red-500/5 border-red-500/20 text-red-300"
            }`}
          >
            <div className="flex gap-2.5 items-start">
              {status.type === "success" ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <p className="font-medium text-[11px] leading-relaxed">
                {status.text}
              </p>
            </div>

            {status.type === "not_configured" && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-slate-400 space-y-2.5">
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> SETUP INSTRUCTIONS
                </span>
                <p className="text-[10px] leading-relaxed">
                  To test live WhatsApp Business messaging from this website:
                </p>
                <ol className="list-decimal list-inside text-[10px] space-y-1 pl-1 text-slate-400">
                  <li>Visit Meta Developers Dashboard and generate a System Token.</li>
                  <li>Click <strong>Settings</strong> (top-right of AI Studio) &gt; <strong>Secrets</strong>.</li>
                  <li>Add <strong>WHATSAPP_ACCESS_TOKEN</strong> and <strong>WHATSAPP_PHONE_NUMBER_ID</strong> keys.</li>
                </ol>
                <div className="pt-2 border-t border-slate-850 flex justify-end">
                  <a
                    id="whatsapp-deeplink-btn"
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all duration-200"
                  >
                    <span>Use Direct WhatsApp Link instead</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
