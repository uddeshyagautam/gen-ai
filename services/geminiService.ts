
import { GoogleGenAI } from "@google/genai";

// API key is sourced from environment variables, as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFantasyName = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate a single, unique, one-word fantasy character name appropriate for a high fantasy setting.',
    });
    // Clean up the response to remove potential markdown, newlines, or extra spaces.
    return response.text.trim().replace(/[*`\n\r]/g, '').split(' ')[0];
  } catch (error) {
    console.error("Error generating fantasy name:", error);
    // Provide a fallback name in case of an API error.
    const fallbackNames = ["Aerion", "Lyra", "Kael", "Seraphina", "Roric"];
    return fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
  }
};
