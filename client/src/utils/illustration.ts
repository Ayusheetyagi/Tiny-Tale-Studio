function ageDescriptor(age: number): string {
  if (age <= 2) return `an actual ${age}-year-old baby/toddler with a round baby face, chubby cheeks, and toddler body proportions — not an older child`;
  if (age <= 4) return `an actual ${age}-year-old preschooler with small child proportions and a round face — not an older child`;
  if (age <= 7) return `an actual ${age}-year-old young child`;
  return `an actual ${age}-year-old child with older-kid proportions — not a toddler`;
}

/**
 * `storySeed` should be the SAME value for every page of a given story
 * (not derived from pageNumber) — Pollinations has no true character-lock
 * feature, but keeping the diffusion seed constant across a story's 5
 * independent calls measurably reduces art-style/color drift between
 * pages. It's a partial mitigation, not a guarantee.
 */
export function buildIllustrationUrl(illustrationPrompt: string, storySeed: number, attempt = 0, age?: number): string {
  const ageClause = typeof age === "number" ? `, the child depicted is ${ageDescriptor(age)}` : "";
  const styledPrompt = `beautiful soft watercolor children's storybook illustration of ${illustrationPrompt}${ageClause}, cozy warm colors, whimsical fairytale style, high quality`;
  const encodedPrompt = encodeURIComponent(styledPrompt);
  const retrySuffix = attempt > 0 ? `&retry=${attempt}` : "";
  return `https://image.pollinations.ai/p/${encodedPrompt}?width=256&height=256&nologo=true&seed=${storySeed}${retrySuffix}`;
}

const PRELOAD_TIMEOUT_MS = 30000;

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(finish, PRELOAD_TIMEOUT_MS);

    function finish() {
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      resolve();
    }

    img.onload = finish;
    img.onerror = finish;
    img.src = url;
  });
}

interface IllustratablePage {
  illustrationPrompt: string;
  pageNumber: number;
}

/**
 * Pollinations' anonymous tier allows only one in-flight generation per IP
 * (concurrent requests get an immediate 429), so every preload here runs
 * strictly one at a time rather than in parallel.
 *
 * Generates every page's illustration before the reader is shown, so that
 * flipping through pages afterwards — even quickly, back to back — never
 * triggers on-demand generation. Callers that want to let an impatient user
 * jump into the reader early can keep this promise running in the
 * background and switch views independently; it's safe to ignore its
 * completion once the caller has moved on.
 */
export async function preloadAllIllustrations(
  pages: IllustratablePage[],
  age: number,
  storySeed: number,
  onProgress: (done: number, total: number) => void
): Promise<void> {
  const total = pages.length;
  let done = 0;
  for (const page of pages) {
    await preloadImage(buildIllustrationUrl(page.illustrationPrompt, storySeed, 0, age));
    done += 1;
    onProgress(done, total);
  }
}
