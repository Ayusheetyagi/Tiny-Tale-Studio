import { Type } from "@google/genai";
import type { StoryResponse } from "../types.js";
import { getClient, generateContentWithRetry } from "./geminiClient.js";
import { SAFETY_CATEGORIES } from "./textSafety.js";

export interface ModerationResult {
  flagged: boolean;
  reason: string;
}

const moderationSchema = {
  type: Type.OBJECT,
  properties: {
    flagged: { type: Type.BOOLEAN },
    reason: { type: Type.STRING },
  },
  required: ["flagged", "reason"],
};

const MODERATION_SYSTEM_INSTRUCTION = `You are a strict content-safety classifier reviewing text from a children's storybook intended for children under 8. Your job is to check whether the text violates ANY of these categories:
${SAFETY_CATEGORIES}

Respond with strict JSON only: {"flagged": boolean, "reason": string}. Set "flagged" to true if the text violates any category above, even mildly or ambiguously — when in doubt, flag it. "reason" should briefly name which category, or "none" if not flagged.`;

function storyToPlainText(story: StoryResponse): string {
  return [
    `Title: ${story.title}`,
    ...story.pages.flatMap((page) => [
      `Page ${page.pageNumber} text: ${page.text}`,
      `Page ${page.pageNumber} illustration: ${page.illustrationPrompt}`,
      `Page ${page.pageNumber} discussion question: ${page.discussionQuestion}`,
    ]),
  ].join("\n");
}

export async function moderateStory(story: StoryResponse): Promise<ModerationResult> {
  const ai = getClient();

  const response = await generateContentWithRetry(ai, {
    model: "gemini-flash-latest",
    contents: storyToPlainText(story),
    config: {
      systemInstruction: MODERATION_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: moderationSchema,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Moderation check returned an empty response.");
  }

  return JSON.parse(rawText) as ModerationResult;
}
