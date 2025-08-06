
import { GoogleGenAI, Type } from "@google/genai";
import { type PromptIdea } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ideasSchema = {
  type: Type.OBJECT,
  properties: {
    ideas: {
      type: Type.ARRAY,
      description: "An array of 5 unique web application ideas.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'A short, catchy title for the web application idea in Russian.'
          },
          prompt: {
            type: Type.STRING,
            description: 'A clear, one-sentence instruction in Russian that can be given to an AI programming agent to build the app.'
          }
        },
        required: ["title", "prompt"]
      }
    }
  },
  required: ["ideas"]
};

export const generateAppIdeas = async (topic?: string): Promise<PromptIdea[]> => {
  const basePrompt = "Generate 5 distinct ideas for simple web applications. The ideas should be in Russian. Examples of good ideas: 'A Pomodoro timer with customizable work/break intervals', 'A real-time Markdown previewer', 'An interactive color palette generator'. Avoid overly complex ideas like social networks or e-commerce stores.";
  
  const topicInstruction = topic?.trim()
    ? ` The ideas should be related to the topic: "${topic}".`
    : '';
  
  const contents = `${basePrompt}${topicInstruction}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are an expert in web development and a creative brainstorming partner. Your task is to generate simple, yet complete, web application ideas. These ideas should be suitable for a beginner developer who is using an AI programming assistant to build the application from a single prompt. The ideas must be self-contained and not require complex backend logic, databases, or user authentication. Respond in Russian.",
        responseMimeType: "application/json",
        responseSchema: ideasSchema,
      }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed && Array.isArray(parsed.ideas) && parsed.ideas.length > 0) {
      return parsed.ideas.slice(0, 5); // Ensure we only return 5 ideas
    } else {
      throw new Error("API returned an unexpected data structure.");
    }

  } catch (error) {
    console.error("Error generating app ideas:", error);
    throw new Error("Failed to fetch ideas from Gemini API.");
  }
};
