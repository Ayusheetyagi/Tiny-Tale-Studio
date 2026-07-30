import { Router } from "express";
import rateLimit from "express-rate-limit";
import type { AdditionalPerson, GenerateStoryRequestBody } from "../types.js";
import { generateStory, isRetryableError } from "../services/gemini.js";
import { findBlockedTerm } from "../services/inputFilter.js";

export const generateStoryRouter = Router();

const MAX_ADDITIONAL_PEOPLE = 5;

const generateStoryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many stories requested from this connection. Please try again in a bit." },
});

const MAX_FREE_TEXT_TOTAL_LENGTH = 1500;

function totalFreeTextLength(profile: GenerateStoryRequestBody["profile"]): number {
  const people = (profile.additionalPeople ?? []) as AdditionalPerson[];
  const peopleLength = people.reduce((sum, person) => sum + person.name.length + (person.trait?.length ?? 0), 0);
  return (
    (profile.hobbies?.length ?? 0) +
    (profile.petName?.length ?? 0) +
    (profile.milestone?.length ?? 0) +
    (profile.classNotes?.length ?? 0) +
    peopleLength
  );
}

function findBlockedInputTerm(profile: GenerateStoryRequestBody["profile"]): string | null {
  const people = (profile.additionalPeople ?? []) as AdditionalPerson[];
  const fields = [
    profile.name,
    profile.hobbies,
    profile.petName,
    profile.milestone,
    profile.classNotes,
    ...people.flatMap((person) => [person.name, person.trait]),
  ];

  for (const field of fields) {
    const match = field ? findBlockedTerm(field) : null;
    if (match) return match;
  }
  return null;
}

generateStoryRouter.post("/generate-story", generateStoryLimiter, async (req, res) => {
  const body = req.body as Partial<GenerateStoryRequestBody>;
  const profile = body.profile;

  if (!profile || !profile.name || !profile.age || !profile.theme) {
    res.status(400).json({
      error: "Request must include profile.name, profile.age, and profile.theme.",
    });
    return;
  }

  if (totalFreeTextLength(profile) > MAX_FREE_TEXT_TOTAL_LENGTH) {
    res.status(400).json({ error: "That's a lot of detail — please shorten some of the free-text fields." });
    return;
  }

  if (findBlockedInputTerm(profile)) {
    res.status(400).json({
      error: "One of the fields contains something that isn't appropriate for a children's storybook. Please edit it and try again.",
    });
    return;
  }

  try {
    const story = await generateStory({
      name: profile.name,
      age: profile.age,
      hobbies: profile.hobbies ?? "",
      petName: profile.petName,
      theme: profile.theme,
      milestone: profile.milestone,
      additionalPeople: (profile.additionalPeople ?? []).slice(0, MAX_ADDITIONAL_PEOPLE),
      classNotes: profile.classNotes,
      characterId: profile.characterId,
    });
    res.json(story);
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "Unknown error generating story.";
    const isMissingKey = rawMessage.includes("GEMINI_API_KEY");
    const isModerationBlocked = rawMessage.startsWith("MODERATION_BLOCKED:");

    if (isModerationBlocked) {
      res.status(422).json({ error: rawMessage.replace("MODERATION_BLOCKED:", "").trim() });
      return;
    }

    const message = isMissingKey
      ? rawMessage
      : isRetryableError(error)
        ? "Our storyteller is very busy right now. We tried a few times but couldn't get through — please try again in a moment."
        : rawMessage;
    const status = isMissingKey ? 503 : 502;
    res.status(status).json({ error: message });
  }
});
