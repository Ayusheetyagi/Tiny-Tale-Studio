/**
 * Shared between the story-generation system instruction and the Layer-2
 * moderation classifier so the two lists can never drift apart.
 */
export const SAFETY_CATEGORIES = `- No sexual content or innuendo of any kind.
- No drug, alcohol, or substance references.
- No profanity or crude language.
- No graphic violence or gore.
- No content involving self-harm.
- No discriminatory or hateful language toward any group.
- No mature or frightening themes beyond mild, fairy-tale-level peril (e.g. "the wolf looked hungry" is fine; a graphic threat is not).`;

/**
 * Strips characters that could break out of the <label>...</label>
 * wrapping used to mark free text as inert data (see wrapAsData), collapses
 * newlines to reduce multi-line instruction-injection surface, and caps
 * length.
 */
export function sanitizeFreeText(text: string, maxLength: number): string {
  return text
    .replace(/[<>`]/g, "")
    .replace(/\r?\n+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function wrapAsData(label: string, text: string): string {
  return `<${label}>${text}</${label}>`;
}
