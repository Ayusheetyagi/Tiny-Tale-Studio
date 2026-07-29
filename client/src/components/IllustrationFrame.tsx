import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildIllustrationUrl } from "../utils/illustration";

interface IllustrationFrameProps {
  illustrationPrompt: string;
  storySeed: number;
  childAge: number;
}

const MAX_AUTO_RETRIES = 2;
const LOAD_TIMEOUT_MS = 20000;
const RETRY_BACKOFF_MS = 2000;

export default function IllustrationFrame({ illustrationPrompt, storySeed, childAge }: IllustrationFrameProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const imageUrl = buildIllustrationUrl(illustrationPrompt, storySeed, attempt, childAge);

  useEffect(() => {
    setStatus("loading");
    setAttempt(0);
  }, [illustrationPrompt, storySeed]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (status !== "loading") return;

    timeoutRef.current = setTimeout(() => {
      handleFailure();
    }, LOAD_TIMEOUT_MS);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, imageUrl]);

  useEffect(() => {
    return () => clearTimeout(retryTimeoutRef.current);
  }, []);

  function handleFailure() {
    setAttempt((prev) => {
      if (prev < MAX_AUTO_RETRIES) {
        retryTimeoutRef.current = setTimeout(() => {
          setStatus("loading");
        }, RETRY_BACKOFF_MS);
        return prev + 1;
      }
      setStatus("error");
      return prev;
    });
  }

  function handleManualRetry() {
    clearTimeout(retryTimeoutRef.current);
    setAttempt(0);
    setStatus("loading");
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-book border-4 border-white shadow-book">
      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="skeleton-shimmer absolute inset-0 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3 text-ink-soft">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/70 border-t-terracotta" />
              <p className="text-sm font-medium">
                {attempt > 0 ? "Still painting… trying again" : "Painting the scene…"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-paper-soft px-6 text-center text-ink-soft">
          <span className="text-3xl">🎨</span>
          <p className="text-sm">The illustration is taking too long to load.</p>
          <button
            type="button"
            onClick={handleManualRetry}
            className="rounded-full border border-amber-soft bg-white px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-amber-soft/40"
          >
            Try again
          </button>
        </div>
      )}

      <motion.img
        key={imageUrl}
        src={imageUrl}
        alt={illustrationPrompt}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: status === "loaded" ? 1 : 0, scale: status === "loaded" ? 1 : 1.02 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onLoad={() => setStatus("loaded")}
        onError={handleFailure}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
