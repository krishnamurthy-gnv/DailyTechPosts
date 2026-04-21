/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generateTechPosts = async (newsDescription: string) => {
  const prompt = `
    Based on the following tech news: "${newsDescription}"
    Create social media posts for LinkedIn, X (Twitter), and a General Social Post.
    
    For each platform:
    1. Write a compelling post text.
    2. Suggest 3-5 relevant hashtags.
    
    Additionally, define a "Consistent Visual Concept" that can be used to generate images for these posts. 
    The visual concept should be high-tech, abstract, and NOT contain any people.
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualConcept: { type: Type.STRING, description: "A detailed description of the consistent visual theme (no people)." },
          posts: {
            type: Type.OBJECT,
            properties: {
              LinkedIn: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              X: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              Social: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateImageForPlatform = async (platform: string, visualConcept: string, newsTopic: string) => {
  const prompt = `
    Create a high-quality, professional image for a ${platform} post about ${newsTopic}.
    Visual Theme: ${visualConcept}
    Constraint: ABSOLUTELY NO PEOPLE OR HUMAN FIGURES. Focus on technology, futuristic hardware, abstract data flows, or clean software interfaces.
    Tone: Professional, sleek, modern tech.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: platform === 'X' ? '16:9' : (platform === 'LinkedIn' ? '4:3' : '1:1'),
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image data returned from model");
};
