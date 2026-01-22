
import { GoogleGenAI } from "@google/genai";

// Initialize with a named parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askLegalAssistant(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `
          أنت مساعد قانوني ذكي لمؤسسة قانونية مرموقة. 
          مهمتك هي تقديم استشارات قانونية مبدئية ومبسطة بناءً على القوانين العامة.
          يجب أن تكون إجاباتك مهنية، دقيقة، وباللغة العربية الفصحى.
          دائماً اذكر في نهاية الإجابة: "هذه استشارة مبدئية، يرجى مراجعة محامٍ متخصص للحصول على رأي نهائي".
        `,
        temperature: 0.7,
      },
    });
    // Use the .text property directly, do not call it as a method
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة لاحقاً.";
  }
}
