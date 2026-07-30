import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { StoryResponse } from "../types/story";
import IllustrationFrame from "./IllustrationFrame";
import DiscussionCard from "./DiscussionCard";
import PageControls from "./PageControls";
import PrintableStory from "./PrintableStory";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

interface StoryReaderProps {
  story: StoryResponse;
  childName: string;
  childAge: number;
  storySeed: number;
  onStartOver: () => void;
}

export default function StoryReader({ story, childName, childAge, storySeed, onStartOver }: StoryReaderProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { isSupported, isSpeaking, toggle, stop } = useSpeechSynthesis();

  const page = story.pages[pageIndex];
  const totalPages = story.pages.length;

  function goToPage(nextIndex: number, dir: number) {
    stop();
    setDirection(dir);
    setPageIndex(nextIndex);
  }

  return (
    <>
      <PrintableStory story={story} childName={childName} childAge={childAge} storySeed={storySeed} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-6xl print:hidden"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="rounded-full bg-amber-soft px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-deep">
            {childName}'s Storybook
          </span>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{story.title}</h1>
        </div>

        <div className="overflow-hidden rounded-book bg-white/60 p-4 shadow-book sm:p-6 lg:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={pageIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-2"
            >
              <div className="flex flex-col gap-4">
                <IllustrationFrame
                  illustrationPrompt={page.illustrationPrompt}
                  storySeed={storySeed}
                  childAge={childAge}
                />
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-widest text-ink-faint">
                      Page {page.pageNumber} of {totalPages}
                    </span>
                    {isSupported && (
                      <button
                        type="button"
                        onClick={() => toggle(page.text)}
                        className="flex items-center gap-2 rounded-full border border-amber-soft bg-white px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-amber-soft/40"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${
                            isSpeaking ? "bg-terracotta text-white" : "bg-amber-soft text-amber-deep"
                          }`}
                          aria-hidden
                        >
                          {isSpeaking ? "❚❚" : "▶"}
                        </span>
                        {isSpeaking ? "Pause reading" : "Read aloud"}
                      </button>
                    )}
                  </div>

                  <p className="whitespace-pre-line text-lg leading-relaxed text-ink sm:text-xl">
                    {page.text}
                  </p>
                </div>

                <DiscussionCard question={page.discussionQuestion} />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 border-t border-amber-soft/40 pt-6">
            <PageControls
              currentPage={pageIndex + 1}
              totalPages={totalPages}
              onPrevious={() => goToPage(Math.max(pageIndex - 1, 0), -1)}
              onNext={() => goToPage(Math.min(pageIndex + 1, totalPages - 1), 1)}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-amber-soft bg-white px-5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-amber-soft/40"
          >
            🖨️ Print storybook
          </button>
          <button
            type="button"
            onClick={onStartOver}
            className="text-sm font-medium text-ink-soft underline decoration-amber-soft decoration-2 underline-offset-4 transition-colors hover:text-terracotta"
          >
            Start a new storybook
          </button>
        </div>
      </motion.div>
    </>
  );
}
