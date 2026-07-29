import type { AdditionalPerson } from "../types/story";
import { MAX_ADDITIONAL_PEOPLE, RELATIONSHIP_OPTIONS } from "../types/story";

interface AdditionalPeopleFieldProps {
  people: AdditionalPerson[];
  onChange: (people: AdditionalPerson[]) => void;
}

export default function AdditionalPeopleField({ people, onChange }: AdditionalPeopleFieldProps) {
  function addPerson() {
    if (people.length >= MAX_ADDITIONAL_PEOPLE) return;
    onChange([...people, { name: "", relationship: "sibling", trait: "" }]);
  }

  function updatePerson(index: number, updates: Partial<AdditionalPerson>) {
    onChange(people.map((person, i) => (i === index ? { ...person, ...updates } : person)));
  }

  function removePerson(index: number) {
    onChange(people.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink-soft">Add family & friends (optional)</label>
        {people.length < MAX_ADDITIONAL_PEOPLE && (
          <button
            type="button"
            onClick={addPerson}
            className="text-sm font-medium text-terracotta underline decoration-amber-soft decoration-2 underline-offset-4 transition-colors hover:text-terracotta-deep"
          >
            + Add person
          </button>
        )}
      </div>

      {people.length === 0 && (
        <p className="text-sm text-ink-faint">Bring siblings, grandparents, or friends into the story.</p>
      )}

      <div className="flex flex-col gap-3">
        {people.map((person, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 rounded-xl border border-amber-soft/60 bg-white/60 p-3 sm:grid-cols-[1.2fr_1fr_1.4fr_auto] sm:items-center"
          >
            <input
              type="text"
              value={person.name}
              onChange={(e) => updatePerson(index, { name: e.target.value })}
              placeholder="Name"
              className="input-field !py-2"
            />
            <select
              value={person.relationship}
              onChange={(e) => updatePerson(index, { relationship: e.target.value as AdditionalPerson["relationship"] })}
              className="input-field !py-2"
            >
              {RELATIONSHIP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={person.trait}
              onChange={(e) => updatePerson(index, { trait: e.target.value })}
              placeholder="e.g. loves dinosaurs"
              className="input-field !py-2"
            />
            <button
              type="button"
              onClick={() => removePerson(index)}
              aria-label={`Remove ${person.name || "person"}`}
              className="justify-self-start rounded-full border border-amber-soft bg-white px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-amber-soft/40 sm:justify-self-center"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
