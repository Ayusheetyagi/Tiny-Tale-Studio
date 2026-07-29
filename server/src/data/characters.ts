import type { StoryCharacter } from "../types.js";

/**
 * Original, non-licensed characters only — never real franchise/cartoon
 * characters. Each visualStyle is a fixed description reused verbatim
 * across every illustrationPrompt the character appears in, so the
 * illustration model renders them consistently page to page.
 */
export const CHARACTER_LIBRARY: StoryCharacter[] = [
  {
    id: "ember",
    name: "Ember",
    archetype: "brave dragon",
    visualStyle:
      "a small, round, friendly dragon with soft coral-pink scales, tiny rounded wings, and big curious eyes",
    personality: "Brave but gentle, always the first to explore something new, and quick to comfort a scared friend.",
  },
  {
    id: "boots",
    name: "Boots",
    archetype: "silly monkey",
    visualStyle: "a small brown monkey wearing oversized yellow rain boots and a striped scarf",
    personality: "Playful and a little clumsy, loves to make jokes and turn any problem into a game.",
  },
  {
    id: "sage",
    name: "Sage",
    archetype: "wise owl",
    visualStyle: "a round, fluffy snowy owl with big amber glasses-like eye markings, perched with a tiny scarf",
    personality: "Calm, thoughtful, and full of gentle advice, speaks slowly and kindly.",
  },
  {
    id: "clover",
    name: "Clover",
    archetype: "curious fox",
    visualStyle: "a small orange fox with a fluffy white-tipped tail and a tiny green backpack",
    personality: "Endlessly curious, asks lots of questions, and loves discovering new places.",
  },
  {
    id: "pebble",
    name: "Pebble",
    archetype: "gentle turtle",
    visualStyle: "a small turtle with a soft blue-green shell painted with tiny star patterns",
    personality: "Patient and steady, a loyal friend who never gives up, even when things are slow-going.",
  },
  {
    id: "willow",
    name: "Willow",
    archetype: "cheerful bunny",
    visualStyle: "a round white bunny with one floppy ear and a patchwork quilted vest",
    personality: "Warm and encouraging, always the first to cheer on a friend who's feeling nervous.",
  },
  {
    id: "marlow",
    name: "Marlow",
    archetype: "friendly whale",
    visualStyle: "a small round blue whale with a gentle smile and a sprinkle of star-shaped spots along its back",
    personality: "Gentle giant, loves to hum quiet songs, and makes everyone feel safe.",
  },
  {
    id: "hazel",
    name: "Hazel",
    archetype: "adventurous hedgehog",
    visualStyle: "a tiny hedgehog with soft lavender spikes and an acorn-cap hat",
    personality: "Bold and a little mischievous, always ready for the next small adventure.",
  },
];

export function findCharacter(id: string | undefined): StoryCharacter | undefined {
  if (!id) return undefined;
  return CHARACTER_LIBRARY.find((c) => c.id === id);
}
