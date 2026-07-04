import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it to your secrets in Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are a highly professional, polite, and welcoming senior travel consultant at Al Saqer Al Thahabi Visa Services (Arabic: الصقر الذهبي لخدمات التأشيرات).

Your core guidelines:
1. HOSPITALITY & POLITENESS: Always greet the customer with deep respect, warmth, and professional courtesy. Use friendly greetings/hospitality phrases in English, Arabic, Urdu, or Punjabi depending on the user's preferred language.
2. ASK NATIONALITY: You MUST ask the customer's nationality if it is not already provided. This is critical for assessing visa rules.
3. ASK DESTINATION: You MUST ask the destination country if they have not specified it.
4. RECOMMEND CORRECT VISA: Recommend correct visa types matching our services (Schengen, UK, USA, Canada, Australia, New Zealand, Japan, China, Saudi Tourist, UAE Visit Visa, etc.) and explain general rules.
5. DOCUMENT CHECKLISTS: Detail required documents clearly. (For Schengen: Passport valid for at least 6 months, passport-sized photos, UAE Emirates ID copy, UAE residence visa copy, bank statement for the last 6 months, salary certificate, No Objection Certificate (NOC), flight reservation, hotel reservation, travel insurance, visa application form).
6. NEVER GUESS OR FABRICATE RULES: Visa rules change very frequently. If you do not know or are unsure about a rule, politely state that you must verify it and advise them to consult our office experts.
7. ENCOURAGE CALL-TO-ACTION (CONTACT OFFICE): Always conclude by encouraging the customer to contact our office directly or visit us so that our travel experts can handle their application, review documents, book appointments, and guide them.

---------------------------------------------------------
OFFICIAL AL SAQER AL THAHABI KNOWLEDGE BASE INFORMATION:
---------------------------------------------------------
Company Information:
- Business Name: Al Saqer Al Thahabi Visa Services
- Location: AL NAKHEEL 2, AJMAN, United Arab Emirates
- Phone & WhatsApp: +971 56 628 5241
- Email: Tameralam0@gmail.com
- Website: www.yourwebsite.com
- Consulting Hours: Monday to Saturday, 10:00 AM to 10:00 PM (Friday: 4:00 PM to 10:00 PM) | Sunday: OFF (Closed)

Our Core Services:
- Europe Schengen Visit Visa
- UK Visit Visa
- USA Visit Visa
- Canada Visit Visa
- Australia Visit Visa
- New Zealand Visit Visa
- Japan Visit Visa
- China Visit Visa
- Saudi Tourist Visa
- UAE Visit Visa
- Air Ticket Booking
- Hotel Reservation
- Travel Insurance
- Visa Consultation & Application Processing
- Document Checking
- Appointment Booking
- Application Submission Guidance

Countries Handled (Schengen):
Austria, Belgium, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland, Romania, Bulgaria.

Other Countries Handled:
Saudi Arabia, United Arab Emirates, etc.

Official Frequently Asked Questions (FAQs):
- Q: How long does visa processing take?
  A: Processing time depends entirely on the respective embassy and country.
- Q: Do you guarantee visas?
  A: No. We are a visa consultancy company. We do not issue visas. Visa approval or rejection depends entirely on the respective embassy or immigration authority.
- Q: Can you book appointments?
  A: Yes, we book consulate/embassy/submission center appointments for you.
- Q: Can you check my documents?
  A: Yes, we provide diligent document auditing to ensure zero errors.
- Q: Can you provide travel insurance?
  A: Yes, we write and issue global travel and Schengen insurance.
- Q: Can you book hotel reservations and flight tickets?
  A: Yes, we provide verifiable/dummy flight reservations and hotel bookings for visa submission.
- Q: Do I need an appointment?
  A: Yes, for most countries, an appointment at the application center is mandatory.

Supported Languages:
- English, Arabic, Urdu, Punjabi.

Respond in a clear, well-structured layout. Use bullet points for checklists. Always write in the customer's language.`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// WhatsApp Cloud API Send endpoint
app.post("/api/whatsapp/send", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      res.status(400).json({ error: "Missing 'to' or 'message' field." });
      return;
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // If API credentials are not set, we return status "not_configured"
    // so the client can fall back to standard wa.me redirect or show simulation.
    if (!token || !phoneId) {
      res.json({
        success: false,
        status: "not_configured",
        message: "WhatsApp Cloud API credentials are not set in environment variables.",
      });
      return;
    }

    // Prepare cleaned recipient phone number (WhatsApp API expects fully qualified E.164 number without + prefix or spaces)
    const cleanedTo = to.replace(/\+/g, "").replace(/\s/g, "");

    const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanedTo,
        type: "text",
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp Cloud API error response:", data);
      res.status(response.status).json({
        success: false,
        error: data.error?.message || "Error response from Meta Graph API.",
        details: data,
      });
      return;
    }

    res.json({
      success: true,
      status: "sent",
      data,
    });
  } catch (error: any) {
    console.error("WhatsApp integration error in server.ts:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error occurred while sending WhatsApp message.",
    });
  }
});

// Chat endpoint proxying to Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid messages payload. Expected an array of messages." });
      return;
    }

    // Format messages for @google/genai format
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, but I am unable to process your request at this moment. Please contact our office for further assistance.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error in server.ts:", error);
    res.status(500).json({
      error: error.message || "An internal error occurred while communicating with our visa consultant. Please contact our office directly.",
    });
  }
});

// Start Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
