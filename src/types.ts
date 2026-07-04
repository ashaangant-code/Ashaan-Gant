export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface VisaProfile {
  nationality: string;
  destination: string;
  purpose: "Tourism" | "Business" | "Transit" | "Education" | "";
  duration: string;
  hasPassport: boolean;
  hasPhoto: boolean;
  hasResidency: boolean;
  hasNoc: boolean;
  hasBankStatement: boolean;
  hasInsurance: boolean;
}

export interface DocumentInfo {
  id: string;
  title: string;
  description: string;
  details: string[];
  iconName: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
}
