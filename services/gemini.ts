
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an elite, industry-specific AI assistant built exclusively for the roofing and insurance restoration industry. 
Your purpose is to function as a complete, end-to-end intelligence platform for restoration contractors and the homeowners they serve. 
You unify IRC (International Residential Code) expertise, insurance policy interpretation (RCV, ACV, depreciation), storm damage assessment, and homeowner communication.
Respond with expert-level authority, using professional but accessible language. Always prioritize code compliance, proper installation standards, and accurate policy navigation.`;

export class GeminiService {
  private static instance: GeminiService;
  
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static getInstance() {
    if (!this.instance) this.instance = new GeminiService();
    return this.instance;
  }

  async chat(message: string, useThinking: boolean = false) {
    const ai = this.getAI();
    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config,
    });

    return response.text;
  }

  async fastResponse(message: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: message,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    return response.text;
  }

  async analyzeMedia(prompt: string, base64Data: string, mimeType: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `${SYSTEM_INSTRUCTION}\n\nUser Question: ${prompt}` }
        ]
      }
    });
    return response.text;
  }

  async searchGrounding(query: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION
      },
    });
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

    return { text: response.text, sources };
  }

  async mapsGrounding(query: string, lat?: number, lng?: number) {
    const ai = this.getAI();
    const config: any = {
      tools: [{ googleMaps: {} }],
      systemInstruction: SYSTEM_INSTRUCTION
    };

    if (lat && lng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config,
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({ title: c.maps.title, uri: c.maps.uri }));

    return { text: response.text, sources };
  }

  async transcribeAudio(base64Data: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: 'audio/wav' } },
          { text: "Transcribe this audio accurately. Focus on roofing/restoration industry terminology." }
        ]
      }
    });
    return response.text;
  }

  async generateRoofImage(prompt: string, aspectRatio: string = "16:9", size: string = "1K") {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `High quality architectural rendering of a roofing system: ${prompt}` }] },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: size as any
        }
      },
    });

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return imageUrl;
  }

  async editRoofImage(base64Image: string, prompt: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } },
          { text: `Apply these changes specifically to the roofing or building exterior: ${prompt}` }
        ]
      }
    });

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return imageUrl;
  }

  async generateRestorationVideo(prompt: string, isPortrait: boolean = false) {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Professional cinematic restoration progress video: ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: isPortrait ? '9:16' : '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  async speakText(text: string) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say in a professional, authoritative, but helpful tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }
}
