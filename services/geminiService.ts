import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, ImageResolution } from "../types";

// Helper to get client with current key
// Note: We create a new instance every time to ensure we pick up the latest selected key if changed.
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateYouTubeScript = async (topic: string, tone: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Write a professional YouTube video script about "${topic}". 
  The tone should be ${tone}. 
  Include a Hook, Intro, Main Content Points, and a Call to Action (Subscribe/Like).
  Format the output in Markdown.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 2048 }, // Use thinking for better script structure
    }
  });

  return response.text || "Failed to generate script.";
};

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio,
  resolution: ImageResolution
): Promise<string> => {
  const ai = getAIClient();
  
  // Using the pro image preview model for high quality
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: resolution
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data found in response");
};

export const editImage = async (
  base64Image: string,
  prompt: string,
  mimeType: string = 'image/png'
): Promise<string> => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image data found in response");
};

export const generateVideo = async (
  prompt: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  const ai = getAIClient();

  // Use Veo model for video generation
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: aspectRatio
    }
  });

  // Poll until done
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Video generation failed or no URI returned.");
  }

  // Fetch the actual video bytes using the URI and the API key
  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!response.ok) {
     throw new Error("Failed to download generated video.");
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const generateVideoFromImage = async (
  prompt: string,
  imageBlob: Blob,
  mimeType: string,
  aspectRatio: '16:9' | '9:16' = '16:9'
): Promise<string> => {
  const ai = getAIClient();
  
  // Convert blob to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to convert image"));
      }
    };
    reader.readAsDataURL(imageBlob);
  });

  // Use Veo fast model which supports image inputs reliably
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || "Animate this image", // Prompt is technically optional in some contexts but good to have
    image: {
      imageBytes: base64Data,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p', // Image-to-video often works best at 720p on current preview models
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Video generation failed.");
  }

  const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  if (!response.ok) {
     throw new Error("Failed to download generated video.");
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
