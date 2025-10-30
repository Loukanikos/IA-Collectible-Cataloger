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
    text: `Analise a descrição e a imagem do item a seguir para catalogá-lo.\n\nDescrição: ${description}`,
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [imagePart, textPart] },
    config: {
      systemInstruction: `Você é um catalogador especialista em colecionáveis. Com base na descrição e na imagem do usuário, crie um título conciso, uma descrição detalhada, uma estimativa de valor monetário (ex: 'R$ 50,00') e uma lista de tags relevantes (como hashtags) para um banco de dados NoSQL. As tags devem ser palavras-chave curtas e relevantes. Retorne o resultado como um objeto JSON válido.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Um título conciso e descritivo para o item colecionável."
          },
          detailedDescription: {
            type: Type.STRING,
            description: "Uma descrição detalhada, mas profissional, do item, incluindo características principais mencionadas pelo usuário ou visíveis na imagem."
          },
          value: {
            type: Type.STRING,
            description: "Uma estimativa do valor monetário do item, formatado como uma string (ex: 'R$ 100,00')."
          },
          tags: {
            type: Type.ARRAY,
            description: "Uma lista de palavras-chave curtas e relevantes ou hashtags para categorização.",
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["title", "detailedDescription", "value", "tags"]
      },
    }
  });
  
  const jsonText = response.text.trim();
  const parsedData: CatalogData = JSON.parse(jsonText);
  return parsedData;
};