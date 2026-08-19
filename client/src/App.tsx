import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeScreen from "./components/WelcomeScreen";
import ProfileForm from "./components/ProfileForm";
import StoryReader from "./components/StoryReader";
import type { ChildProfile, StoryResponse } from "./types/story";
import { preloadAllIllustrations } from "./utils/illustration";

type AppStatus = "welcome" | "form" | "loading" | "illustrating" | "reading" | "error";

export default function App() {
  const [status, setStatus] = useState<AppStatus>("welcome");
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(5);
  const [storySeed, setStorySeed] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [illustrationProgress, setIllustrationProgress] = useState({ done: 0, total: 0 });
  const skippedWaitRef = useRef(false);
  const generationIdRef = useRef(0);

  async function handleGenerate(profile: ChildProfile) {
    const generationId = ++generationIdRef.current;
    setStatus("loading");
    setErrorMessage("");
    setChildName(profile.name);
    setChildAge(profile.age);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong generating the story.");
      }

      const data = (await response.json()) as StoryResponse;
      const seed = Math.floor(Math.random() * 1_000_000);

      setStory(data);
      setStorySeed(seed);
      setStatus("illustrating");
      setIllustrationProgress({ done: 0, total: data.pages.length });
      skippedWaitRef.current = false;

      await preloadAllIllustrations(data.pages, profile.age, seed, (done, total) => {
        if (generationIdRef.current !== generationId) return;
        setIllustrationProgress({ done, total });
        if (done === total && !skippedWaitRef.current) {
          setStatus("reading");
        }
      });
    } catch (error) {
      if (generationIdRef.current !== generationId) return;
      setErrorMessage(error instanceof Error ? error.message : "Unknown error.");
      setStatus("error");
    }
  }

  function handleSkipWait() {
    skippedWaitRef.current = true;
    setStatus("reading");
  }

  function handleStartOver() {
    generationIdRef.current++;
    setStory(null);
    setStatus("form");
  }

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {status === "welcome" && <WelcomeScreen key="welcome" onGetStarted={() => setStatus("form")} />}

        {status === "form" && (
          <motion.div key="form" exit={{ opacity: 0 }} className="px-4 py-12 sm:px-8 lg:px-16">
            <ProfileForm onSubmit={handleGenerate} isSubmitting={false} />
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-8"
          >
            <span className="h-14 w-14 animate-spin rounded-full border-4 border-amber-soft border-t-terracotta" />
            <h2 className="text-2xl font-semibold text-ink">
              Weaving {childName ? `${childName}'s` : "your child's"} story…
            </h2>
            <p className="text-ink-soft">
              Our storyteller is dreaming up five cozy pages just for them. This can take a moment.
            </p>
          </motion.div>
        )}

        {status === "illustrating" && (
          <motion.div
            key="illustrating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-8"
          >
            <span className="h-14 w-14 animate-spin rounded-full border-4 border-amber-soft border-t-terracotta" />
            <h2 className="text-2xl font-semibold text-ink">
              Illustrating {childName ? `${childName}'s` : "the"} storybook…
            </h2>
            <p className="text-ink-soft">
              We're painting all {illustrationProgress.total || 5} scenes now — {illustrationProgress.done}{" "}
              of {illustrationProgress.total || 5} ready — so every page turn feels instant once you start
              reading. This usually takes under a minute, occasionally a bit longer on the free art service.
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: illustrationProgress.total }, (_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i < illustrationProgress.done ? "bg-terracotta" : "bg-amber-soft"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleSkipWait}
              className="text-sm font-medium text-ink-soft underline decoration-amber-soft decoration-2 underline-offset-4 transition-colors hover:text-terracotta"
            >
              Start reading now — remaining pages will keep loading
            </button>
          </motion.div>
        )}

        {status === "reading" && story && (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-12 sm:px-8 lg:px-16"
          >
            <StoryReader
              story={story}
              childName={childName}
              childAge={childAge}
              storySeed={storySeed}
              onStartOver={handleStartOver}
            />
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-8"
          >
            <span className="text-4xl">😔</span>
            <h2 className="text-2xl font-semibold text-ink">We couldn't create the story</h2>
            <p className="text-ink-soft">{errorMessage}</p>
            <button
              type="button"
              onClick={handleStartOver}
              className="rounded-full bg-terracotta px-6 py-3 font-medium text-white shadow-card transition-colors hover:bg-terracotta-deep"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
