
import { GoogleGenAI, Type } from "@google/genai";
import type { CatalogData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateCatalogData = async (
  imageBase64: string,
  mimeType: string,
  description: string
): Promise<CatalogData> => {
  const model = 'gemini-2.5-flash';

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `Analyze the following item description and image to catalog it.\n\nDescription: ${description}`,
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [imagePart, textPart] },
    config: {
      systemInstruction: `You are an expert cataloger for collectibles. Based on the user's description and image, create a concise title, a detailed description, and a list of relevant tags (like hashtags) for a NoSQL database. The tags should be short, relevant keywords. Return the result as a valid JSON object.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A concise and descriptive title for the collectible item."
          },
          detailedDescription: {
            type: Type.STRING,
            description: "A detailed but professional description of the item, including key features mentioned by the user or visible in the image."
          },
          tags: {
            type: Type.ARRAY,
            description: "An array of short, relevant keywords or hashtags for categorization.",
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["title", "detailedDescription", "tags"]
      },
    }
  });
  
  const jsonText = response.text.trim();
  const parsedData: CatalogData = JSON.parse(jsonText);
  return parsedData;
};
