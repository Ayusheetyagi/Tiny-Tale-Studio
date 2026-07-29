export type Relationship = "sibling" | "parent" | "grandparent" | "friend" | "teacher" | "other";

export interface AdditionalPerson {
  name: string;
  relationship: Relationship;
  trait?: string;
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
  petName?: string;
  theme: string;
  milestone?: string;
  additionalPeople?: AdditionalPerson[];
  classNotes?: string;
  characterId?: string;
}

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

export interface GenerateStoryRequestBody {
  profile: ChildProfile;
}
