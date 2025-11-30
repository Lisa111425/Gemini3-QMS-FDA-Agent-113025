import { GoogleGenAI } from "@google/genai";

export const generateGeminiResponse = async (
  apiKey: string,
  modelName: string,
  systemInstruction: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // According to guidelines, use ai.models.generateContent directly
    // Also handling the model name mapping if necessary, though UI passes standard ones mostly
    // For 'gemini-2.5-flash-lite', ensure it matches API expectation or fallback to flash
    const finalModelName = modelName.includes('lite') ? 'gemini-2.5-flash-lite-latest' : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: finalModelName,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: maxTokens,
        temperature: temperature,
        // thinkingConfig not strictly requested but available for 2.5
      },
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to call Gemini API");
  }
};