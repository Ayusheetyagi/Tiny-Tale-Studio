/**
 * Fast, local "Layer 0" check for obviously inappropriate free-text input —
 * runs before a request ever reaches Gemini, so blatant cases (e.g. someone
 * literally typing "sex" into a topic field) are rejected instantly and for
 * free, rather than relying on the AI to quietly write around it.
 *
 * This is deliberately NOT exhaustive and does not attempt to enumerate
 * slurs or every euphemism — word lists are brittle and hateful/discriminatory
 * language is highly varied, so that category is left to the AI-based
 * system instruction (Layer 1) and post-generation moderation (Layer 2) in
 * gemini.ts / moderation.ts, which are much better suited to nuanced or
 * evasive cases. This layer only needs to catch the unambiguous, blatant
 * stuff cheaply and immediately.
 *
 * Keep this list in sync with client/src/utils/inputFilter.ts.
 *
 * Deliberately excluded despite being common profanity/slang: "cock" (rooster),
 * "pussy" (cat — "pussycat" is a very plausible pet name here), "ass" (donkey),
 * bare "shoot"/"shooting" (basketball — "shoots hoops" is a very plausible
 * hobby), bare "knife"/"cutting"/"smoking" (cooking, arts & crafts, BBQ — all
 * plausible in a children's-app context). These have common innocent meanings
 * that are too likely to show up in legitimate input here, so blocking them
 * would cause real false positives. Their explicit senses are still caught
 * indirectly by more specific/unambiguous terms below.
 */
const BLOCKED_TERMS = [
  // sexual content
  "sex", "porn", "pornography", "pornographic", "nude", "nudity", "sexual", "orgasm",
  "masturbat", "erotic", "fetish", "prostitut", "rape", "molest",
  // drugs / alcohol / tobacco
  "cocaine", "heroin", "meth", "marijuana", "weed", "vodka", "whiskey", "tequila",
  "beer", "wine", "drunk", "cigarette", "tobacco", "nicotine", "vape", "vaping",
  "crack cocaine", "lsd", "overdose",
  // profanity
  "fuck", "shit", "bitch", "asshole", "bastard", "damn", "crap", "piss", "dick",
  "whore", "slut", "cunt",
  // violence / weapons / self-harm
  "murder", "stab", "gun", "rifle", "pistol", "bomb", "explosive", "grenade",
  "gore", "torture", "massacre", "terrorist", "suicide", "self-harm", "self harm",
  "kill myself", "cut myself", "cutting myself",
];

const LEETSPEAK_MAP: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };

function normalize(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((char) => LEETSPEAK_MAP[char] ?? char)
    .join("");
}

export function findBlockedTerm(text: string): string | null {
  if (!text) return null;
  const normalized = normalize(text);
  for (const term of BLOCKED_TERMS) {
    const pattern = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    if (pattern.test(normalized)) return term;
  }
  return null;
}
