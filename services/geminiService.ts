import { GoogleGenAI, Type } from "@google/genai";
import { BriefFormData, GeneratedBrief } from "../types";

// Safely access process.env to prevent runtime crashes in browser environments
// where 'process' might not be defined.
const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const generateCreativeBrief = async (data: BriefFormData): Promise<GeneratedBrief> => {
  const modelId = "gemini-3-flash-preview";

  const systemInstruction = `
    You are the Creative Director for Universitas Sebelas Maret (UNS).
    Your goal is to translate inputs from the PR team into a professional Visual Hierarchy Guide.
    
    BRANDING GUIDELINES:
    - Colors: UNS Blue (#000080) and UNS Yellow (#FED800).
    - Tone: Academic, Professional, Informative, yet engaging.
    
    MAPPING LOGIC:
    1. HEADLINE (Visual Terbesar): Based on 'TANYA' (Core Message). Short, punchy.
    2. SUB-HEADLINE (Konteks): Based on 'TUJU' (Target Audience). 
    3. BODY COPY (Detail): Based on 'ISI' (Supporting Details). Summarize key info (Date, Time, Requirements).
    4. CTA (Tombol): Based on 'TUNJUK' (Action).
    
    Language: Indonesian (Formal/Standard).
  `;

  const prompt = `
    Input Tim Humas UNS:
    - TUJU (Target): "${data.target}"
    - TANYA (Pesan Utama): "${data.message}"
    - ISI (Detail Info): "${data.details}"
    - TUNJUK (Aksi): "${data.action}"
    - GAYA (Vibe): "${data.style}"

    Generate a JSON response with:
    1. 'layoutGuide': Instructions for the designer using UNS Identity.
    2. 'contentDraft': A caption for Instagram/Social Media.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            layoutGuide: {
              type: Type.OBJECT,
              properties: {
                headline: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "Text for the main headline." },
                    instruction: { type: Type.STRING, description: "Font weight/size instruction." }
                  }
                },
                subHeadline: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "Text for context/subhead." },
                    instruction: { type: Type.STRING, description: "Placement instruction." }
                  }
                },
                bodyText: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "Bulleted or summarized details." },
                    instruction: { type: Type.STRING, description: "Layout instruction for details." }
                  }
                },
                cta: {
                  type: Type.OBJECT,
                  properties: {
                    content: { type: Type.STRING, description: "Button label." },
                    instruction: { type: Type.STRING, description: "Button style." }
                  }
                },
                visualStyle: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING, description: "Overall mood description." },
                    colorPalette: { type: Type.STRING, description: "Color usage guide." },
                    fontSuggestion: { type: Type.STRING, description: "Font usage guide." }
                  }
                }
              },
              required: ["headline", "subHeadline", "bodyText", "cta", "visualStyle"]
            },
            contentDraft: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["headline", "caption", "hashtags"]
            }
          }
        }
      }
    });

    let responseText = response.text;
    if (!responseText) {
        throw new Error("Empty response from AI model");
    }

    // Strip Markdown code blocks (```json ... ```) if present
    responseText = responseText.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    return JSON.parse(responseText) as GeneratedBrief;

  } catch (error) {
    console.error("Error generating brief:", error);
    throw error;
  }
};