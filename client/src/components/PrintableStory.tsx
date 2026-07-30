import type { StoryResponse } from "../types/story";
import { buildIllustrationUrl } from "../utils/illustration";

interface PrintableStoryProps {
  story: StoryResponse;
  childName: string;
  childAge: number;
  storySeed: number;
}

/**
 * Rendered off-screen at all times (`hidden print:block`) and only shown
 * when the browser's print dialog is invoked, via the "Print storybook"
 * button in StoryReader. Lays out every page on its own printed sheet,
 * independent of whichever page the interactive reader currently has
 * open, since printing is meant to produce the whole book at once.
 *
 * Illustrations reuse the exact same buildIllustrationUrl() call (same
 * prompt/seed/age) as the on-screen reader, so by print time every image
 * is already generated and sitting in the browser's cache — no waiting.
 */
export default function PrintableStory({ story, childName, childAge, storySeed }: PrintableStoryProps) {
  return (
    <div className="hidden print:block">
      {story.pages.map((page, index) => (
        <div key={page.pageNumber} className={`break-after-page ${index === 0 ? "" : "pt-8"}`}>
          {index === 0 && (
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                {childName}'s Storybook
              </p>
              <h1 className="text-3xl font-bold text-black">{story.title}</h1>
            </div>
          )}

          <img
            src={buildIllustrationUrl(page.illustrationPrompt, storySeed, 0, childAge)}
            alt={page.illustrationPrompt}
            className="mx-auto mb-6 w-full max-w-sm rounded-lg border border-gray-300"
          />

          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
            Page {page.pageNumber} of {story.pages.length}
          </p>

          <p className="mb-6 whitespace-pre-line text-lg leading-relaxed text-black">{page.text}</p>

          <div className="rounded-lg border border-gray-300 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Parent-Child Discussion
            </p>
            <p className="text-black">{page.discussionQuestion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
