import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set on the server environment.");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

const RETRY_DELAYS_MS = [1500, 3000, 6000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /"code"\s*:\s*(429|503)/.test(message) || /UNAVAILABLE|RESOURCE_EXHAUSTED/i.test(message);
}

export async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: Parameters<GoogleGenAI["models"]["generateContent"]>[0]
) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      if (attempt < RETRY_DELAYS_MS.length && isRetryableError(error)) {
        await sleep(RETRY_DELAYS_MS[attempt]);
        continue;
      }
      throw error;
    }
  }
}
