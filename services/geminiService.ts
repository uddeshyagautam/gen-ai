import { GoogleGenAI, Modality } from "@google/genai";
import { CharacterClass } from "../types";

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

export const generateCharacterPortrait = async (name: string, characterClass: CharacterClass): Promise<string> => {
  const prompt = `A fantasy character portrait of ${name}, the ${characterClass}. Vibrant high-fantasy video game art style, detailed face, shoulders up, no text, clean background.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data; // Return base64 image string
      }
    }
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating character portrait:", error);
    throw new Error("Failed to generate character portrait.");
  }
};

export const generateCharacterBackstory = async (name: string, characterClass: CharacterClass): Promise<string> => {
  const prompt = `Generate a unique, one-to-two sentence fantasy origin story for a character named ${name}, who is a ${characterClass}. Make it mysterious and evocative.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating character backstory:", error);
    throw new Error("Failed to generate character backstory.");
  }
};
