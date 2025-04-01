// src/lib/openai.js
import OpenAI from "openai"; // Corrected import name

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Please define the OPENAI_API_KEY environment variable inside .env.local");
}

// Instantiate OpenAI client
export const openai = new OpenAI({
  apiKey: apiKey,
});
