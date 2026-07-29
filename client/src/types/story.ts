export type Relationship = "sibling" | "parent" | "grandparent" | "friend" | "teacher" | "other";

export interface AdditionalPerson {
  name: string;
  relationship: Relationship;
  trait: string;
}

export interface StoryCharacter {
  id: string;
  name: string;
  archetype: string;
  visualStyle: string;
  personality: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  hobbies: string;
  petName: string;
  theme: string;
  milestone: string;
  additionalPeople: AdditionalPerson[];
  classNotes: string;
  characterId: string;
}

export const MAX_ADDITIONAL_PEOPLE = 5;

export const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: "sibling", label: "Sibling" },
  { value: "parent", label: "Parent" },
  { value: "grandparent", label: "Grandparent" },
  { value: "friend", label: "Friend" },
  { value: "teacher", label: "Teacher" },
  { value: "other", label: "Other" },
];

export interface StoryPage {
  pageNumber: number;
  text: string;
  illustrationPrompt: string;
  discussionQuestion: string;
}

export interface StoryResponse {
  title: string;
  pages: StoryPage[];
}

export const THEME_PRESETS = [
  "Outer Space Adventure",
  "Under the Sea",
  "Enchanted Forest",
  "Dinosaur Land",
  "Magical Bakery",
  "Animal Safari Friends",
  "Pirate Treasure Hunt",
  "Fairy Garden",
] as const;

export type ThemePreset = (typeof THEME_PRESETS)[number];

export const MILESTONE_PRESETS = [
  "None — just a fun story",
  "Starting school or daycare",
  "Learning to ride a bike",
  "A first trip to the dentist",
  "Becoming a big sibling",
  "Moving to a new home",
  "Learning to swim",
  "A first sleepover",
  "Something else…",
] as const;

export type MilestonePreset = (typeof MILESTONE_PRESETS)[number];
