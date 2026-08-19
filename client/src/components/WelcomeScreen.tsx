import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const CHARACTER_IDS = ["ember", "boots", "sage", "clover", "pebble", "willow", "marlow", "hazel"];

// Repeat the 8 static portraits enough times to densely tile the screen,
// same idea as a tsum-tsum style collage — pre-generated once (see
// client/public/characters/), never regenerated per visitor.
const TILE_COUNT = 40;
const TILES = Array.from({ length: TILE_COUNT }, (_, i) => CHARACTER_IDS[i % CHARACTER_IDS.length]);

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-8">
        {TILES.map((id, i) => (
          <img
            key={i}
            src={`/characters/${id}.jpg`}
            alt=""
            aria-hidden
            className="aspect-square w-full object-cover"
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-paper/55" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="relative mx-4 max-w-lg rounded-book border-4 border-white bg-white/90 p-8 text-center shadow-book sm:p-12"
      >
        <span className="mb-4 inline-block rounded-full bg-sage-soft px-4 py-1 text-xs font-semibold uppercase tracking-widest text-sage-deep">
          Storybook Studio
        </span>
        <h1 className="mb-4 text-4xl font-bold text-ink sm:text-5xl">
          Every child deserves to be the hero of their own story
        </h1>
        <p className="mb-8 text-lg text-ink-soft">
          A magical, illustrated storybook — starring your child, their pets, their friends, and
          a cast of original characters — written and painted just for them in minutes.
        </p>
        <motion.button
          type="button"
          onClick={onGetStarted}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-2xl bg-terracotta px-8 py-4 text-lg font-semibold text-white shadow-card transition-colors hover:bg-terracotta-deep sm:w-auto"
        >
          Generate Storybook
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
