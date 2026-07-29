import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { AdditionalPerson, ChildProfile, StoryCharacter } from "../types/story";
import { MILESTONE_PRESETS, THEME_PRESETS } from "../types/story";
import AdditionalPeopleField from "./AdditionalPeopleField";

interface ProfileFormProps {
  onSubmit: (profile: ChildProfile) => void;
  isSubmitting: boolean;
}

const NO_MILESTONE = MILESTONE_PRESETS[0];
const CUSTOM_MILESTONE = MILESTONE_PRESETS[MILESTONE_PRESETS.length - 1];
const CLASS_NOTES_MAX_LENGTH = 150;

const initialProfile: Omit<ChildProfile, "milestone"> = {
  name: "",
  age: 5,
  hobbies: "",
  petName: "",
  theme: THEME_PRESETS[0],
  additionalPeople: [],
  classNotes: "",
  characterId: "",
};

export default function ProfileForm({ onSubmit, isSubmitting }: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [milestoneSelection, setMilestoneSelection] = useState<string>(NO_MILESTONE);
  const [customMilestone, setCustomMilestone] = useState("");
  const [characters, setCharacters] = useState<StoryCharacter[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/characters")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed to load characters"))))
      .then((data: { characters: StoryCharacter[] }) => {
        if (!cancelled) setCharacters(data.characters);
      })
      .catch(() => {
        // Character picker is optional — just hide it if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange<K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!profile.name.trim()) return;

    const milestone =
      milestoneSelection === NO_MILESTONE
        ? ""
        : milestoneSelection === CUSTOM_MILESTONE
          ? customMilestone.trim()
          : milestoneSelection;

    onSubmit({ ...profile, milestone });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="paper-card rounded-book p-8 sm:p-10">
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-sage-soft px-4 py-1 text-xs font-semibold uppercase tracking-widest text-sage-deep">
            Storybook Studio
          </span>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            Craft a story just for your child
          </h1>
          <p className="mt-3 text-ink-soft">
            A few details, and we'll weave a cozy 5-page illustrated adventure starring them.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Child's name" htmlFor="name">
              <input
                id="name"
                type="text"
                required
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Maya"
                className="input-field"
              />
            </Field>

            <Field label="Age" htmlFor="age">
              <input
                id="age"
                type="number"
                min={1}
                max={12}
                required
                value={profile.age}
                onChange={(e) => handleChange("age", Number(e.target.value))}
                className="input-field"
              />
            </Field>
          </div>

          <Field label="Hobbies & interests" htmlFor="hobbies">
            <input
              id="hobbies"
              type="text"
              value={profile.hobbies}
              onChange={(e) => handleChange("hobbies", e.target.value)}
              placeholder="e.g. dinosaurs, painting, soccer"
              className="input-field"
            />
          </Field>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Pet or companion (optional)" htmlFor="petName">
              <input
                id="petName"
                type="text"
                value={profile.petName}
                onChange={(e) => handleChange("petName", e.target.value)}
                placeholder="e.g. Biscuit the dog"
                className="input-field"
              />
            </Field>

            <Field label="Story theme" htmlFor="theme">
              <select
                id="theme"
                value={profile.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className="input-field"
              >
                {THEME_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Real-life milestone (optional)" htmlFor="milestone">
            <select
              id="milestone"
              value={milestoneSelection}
              onChange={(e) => setMilestoneSelection(e.target.value)}
              className="input-field"
            >
              {MILESTONE_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </Field>

          {milestoneSelection === CUSTOM_MILESTONE && (
            <Field label="Tell us about it" htmlFor="customMilestone">
              <input
                id="customMilestone"
                type="text"
                value={customMilestone}
                onChange={(e) => setCustomMilestone(e.target.value)}
                placeholder="e.g. starting kindergarten next week"
                className="input-field"
              />
            </Field>
          )}

          {characters.length > 0 && (
            <Field label="Storybook friend to join the adventure (optional)" htmlFor="characterId">
              <select
                id="characterId"
                value={profile.characterId}
                onChange={(e) => handleChange("characterId", e.target.value)}
                className="input-field"
              >
                <option value="">None</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name} the {character.archetype}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="What did your child learn in class recently? (optional)" htmlFor="classNotes">
            <input
              id="classNotes"
              type="text"
              value={profile.classNotes}
              onChange={(e) => handleChange("classNotes", e.target.value.slice(0, CLASS_NOTES_MAX_LENGTH))}
              maxLength={CLASS_NOTES_MAX_LENGTH}
              placeholder="e.g. the water cycle, sharing, the letter B"
              className="input-field"
            />
          </Field>

          <AdditionalPeopleField
            people={profile.additionalPeople}
            onChange={(additionalPeople: AdditionalPerson[]) => handleChange("additionalPeople", additionalPeople)}
          />

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full rounded-2xl bg-terracotta px-6 py-4 text-lg font-semibold text-white shadow-card transition-colors hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Weaving your story…" : "Generate Storybook"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      {children}
    </div>
  );
}
