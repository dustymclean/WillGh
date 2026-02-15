
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCurationIntelligence = async (prompt: string, imageData?: string) => {
  try {
    const parts: any[] = [{ text: prompt }];
    
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: "You are a high-end photography consultant and art curator for Will Grigsby. Your task is to analyze his work (Concert, Boudoir, Street, Commercial) and provide valuation estimates, curation tips, and business strategies. Be professional, direct, and sophisticated.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            suggestedTier: { type: Type.STRING },
            valuationEstimate: { type: Type.STRING },
            curationAdvice: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["analysis", "suggestedTier", "valuationEstimate", "curationAdvice"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
