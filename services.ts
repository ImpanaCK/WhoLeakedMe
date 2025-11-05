
import { GoogleGenAI } from "@google/genai";
import { Breach, RecommendedAction, ScanResult, PwnedPasswordResult, ChatMessage } from './types';
import { calculateRiskScore, sha1 } from './utils';
import { MOCK_BREACHES, RECOMMENDED_ACTIONS } from './constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Breach Scanning Service (Simulated) ---
export const scanForBreaches = (query: string): Promise<ScanResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate finding breaches based on query
      const foundBreaches: Breach[] = MOCK_BREACHES.filter(
        () => Math.random() > 0.4
      ).slice(0, Math.floor(Math.random() * 5) + 1);

      const risk = calculateRiskScore(foundBreaches);
      const actions: RecommendedAction[] = [...RECOMMENDED_ACTIONS].sort(() => 0.5 - Math.random()).slice(0,3);

      resolve({
        query,
        breaches: foundBreaches,
        risk,
        actions,
      });
    }, 1500);
  });
};

// --- Pwned Passwords Service (Live API) ---
export const checkPwnedPassword = async (password: string): Promise<PwnedPasswordResult> => {
    if (!password) {
        return { isPwned: false, count: 0 };
    }
    try {
        const hash = await sha1(password);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) {
            throw new Error('Failed to fetch from Pwned Passwords API');
        }
        
        const text = await response.text();
        const lines = text.split('\n');

        for (const line of lines) {
            const [hashSuffix, countStr] = line.split(':');
            if (hashSuffix && hashSuffix.trim() === suffix) {
                return { isPwned: true, count: parseInt(countStr, 10) };
            }
        }

        return { isPwned: false, count: 0 };
    } catch (error) {
        console.error("Error checking pwned password:", error);
        throw error;
    }
};

// --- Gemini AI Service ---
export const getAIChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  if (!API_KEY) {
    return "The AI assistant is currently unavailable. Please ensure the API key is configured.";
  }
  
  const model = 'gemini-2.5-flash';
  
  const chat = ai.chats.create({
    model,
    config: {
        systemInstruction: "You are PrivacyGuard AI, a friendly and expert cybersecurity assistant. Your goal is to help users understand data breaches and improve their online privacy. Explain complex topics simply. Be encouraging and provide actionable advice. Do not mention that you are a language model. Keep responses concise and helpful.",
    },
    history: history.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        // FIX: The `parts` property must be an array of `Part` objects.
        parts: [{ text: m.text }]
    }))
  });

  try {
    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
};