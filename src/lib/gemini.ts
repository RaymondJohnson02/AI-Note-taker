import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");
