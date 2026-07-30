/**
 * Fast, local "Layer 0" check for obviously inappropriate free-text input,
 * mirrored from server/src/services/inputFilter.ts so the form can reject
 * blatant cases instantly, before ever hitting the network. The server
 * enforces the same check independently — this one is purely for fast UX
 * feedback and must not be relied on as the actual security boundary,
 * since it's trivial to bypass client-side validation.
 *
 * Deliberately not exhaustive — see the server-side file for why, including
 * why common-innocent-meaning words (rooster/cat/donkey slang, "shoots
 * hoops," kitchen knives, BBQ smoking, etc.) are intentionally left out.
 * Keep this list in sync with server/src/services/inputFilter.ts.
 */
const BLOCKED_TERMS = [
  "sex", "porn", "pornography", "pornographic", "nude", "nudity", "sexual", "orgasm",
  "masturbat", "erotic", "fetish", "prostitut", "rape", "molest",
  "cocaine", "heroin", "meth", "marijuana", "weed", "vodka", "whiskey", "tequila",
  "beer", "wine", "drunk", "cigarette", "tobacco", "nicotine", "vape", "vaping",
  "crack cocaine", "lsd", "overdose",
  "fuck", "shit", "bitch", "asshole", "bastard", "damn", "crap", "piss", "dick",
  "whore", "slut", "cunt",
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
