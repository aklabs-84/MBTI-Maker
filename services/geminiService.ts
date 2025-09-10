import { GoogleGenAI, Type } from "@google/genai";
import { Question, MbtiAxis, MbtiDimension, InterpretationDetail } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        text: { type: Type.STRING },
        icon: { type: Type.STRING, description: 'A single, relevant emoji for the question. For example: "🤔"' },
        dimension: { type: Type.STRING, enum: ['EI', 'SN', 'TF', 'JP'] },
        weight: { type: Type.INTEGER },
        choices: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, enum: ['L', 'R'] },
                    label: { type: Type.STRING },
                    polarity: { type: Type.STRING, enum: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'] }
                },
                required: ['id', 'label', 'polarity']
            }
        }
    },
    required: ['id', 'text', 'icon', 'dimension', 'weight', 'choices']
};

export async function generateTopicSuggestions(keyword: string, style?: string): Promise<string[]> {
    let styleInstruction = "";
    if (style) {
        styleInstruction = ` The topics should have a '${style}' style.`;
    }

    const prompt = `You are a creative copywriter. Based on the keyword "${keyword}", generate 3 creative, fun, and intriguing MBTI test topics.${styleInstruction} The topics should be in Korean. The response MUST be a valid JSON array of strings. Do not include any other text or markdown formatting. For example: ["주제 1", "주제 2", "주제 3"]`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                }
            },
        }
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        if (Array.isArray(jsonResponse) && jsonResponse.every(item => typeof item === 'string')) {
            return jsonResponse;
        }
        throw new Error("Invalid response format from Gemini API for suggestions");
    } catch (e) {
        console.error("Failed to parse Gemini suggestions response:", response.text, e);
        throw new Error("Failed to parse topic suggestions from AI.");
    }
}

export async function generateQuestions(topic: string): Promise<Question[]> {
    const prompt = `You are an expert MBTI test creator. Based on the topic "${topic}", generate a set of 12 balanced MBTI questionnaire questions. For each question, also provide a single relevant emoji in the 'icon' field. Ensure there are exactly 3 questions for each of the four dimensions: E/I, S/N, T/F, J/P. The questions should be contextual to the topic. The response MUST be a valid JSON object matching the provided schema. Do not include any other text or markdown formatting. The questions and choices must be in Korean. Make sure each question has a unique ID like "q1", "q2", etc. and a weight of 1.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: questionSchema
                    }
                },
                required: ['questions']
            }
        }
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        if (jsonResponse.questions && Array.isArray(jsonResponse.questions)) {
            return jsonResponse.questions;
        }
        throw new Error("Invalid response format from Gemini API");
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text, e);
        throw new Error("Failed to parse questions from AI.");
    }
}

export async function generateTieBreakerQuestion(topic: string, axis: [MbtiDimension, MbtiDimension]): Promise<Question> {
    const [d1, d2] = axis;
    const prompt = `You are an expert MBTI test creator. Generate exactly ONE insightful tie-breaker question to determine the preference between ${d1} and ${d2} for the topic "${topic}". Also, provide a single relevant emoji for the question in the 'icon' field. The response MUST be a valid JSON object matching the provided schema for a single question. The question and choices must be in Korean. Assign it a unique ID like "q_tie_1" and a weight of 2. The dimension should be "${d1}${d2}".`;

     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: questionSchema
        }
    });

     try {
        const jsonResponse = JSON.parse(response.text);
        // Add a check to ensure it's a valid question object
        if (jsonResponse.id && jsonResponse.text && jsonResponse.choices) {
            return jsonResponse;
        }
        throw new Error("Invalid tie-breaker question format from Gemini API");
    } catch (e) {
        console.error("Failed to parse tie-breaker response:", response.text, e);
        throw new Error("Failed to parse tie-breaker question from AI.");
    }
}


const resultInterpretationSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A creative, character-like title for the MBTI type in Korean. e.g., "열정적인 중재자"' },
        emoji: { type: Type.STRING, description: 'A single emoji that represents the title. e.g., "🎨"' },
        summary: { type: Type.STRING, description: 'A concise, 2-3 line personality analysis based on the topic. In Korean.' },
        match: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, description: 'The best matching MBTI type. e.g., "ENFJ"' },
                description: { type: Type.STRING, description: 'A brief explanation of why this type is a good match. In Korean.' }
            },
            required: ['type', 'description']
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 2-3 key strengths. In Korean.'
        },
        weaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 2-3 key weaknesses. In Korean.'
        },
        characteristics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of 3-4 keywords or short phrases representing the characteristics. In Korean.'
        }
    },
    required: ['title', 'emoji', 'summary', 'match', 'strengths', 'weaknesses', 'characteristics']
};


export async function generateResultInterpretation(topic: string, mbtiType: string): Promise<InterpretationDetail> {
    const prompt = `You are a helpful personality analyst. Provide a detailed personality analysis for someone with the MBTI type ${mbtiType}, specifically in the context of "${topic}". The entire response must be in Korean and formatted as a valid JSON object matching the provided schema. Do not include any other text or markdown formatting.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: resultInterpretationSchema,
        }
    });

    try {
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as InterpretationDetail;
    } catch (e) {
        console.error("Failed to parse result interpretation response:", response.text, e);
        throw new Error("Failed to parse result interpretation from AI.");
    }
}