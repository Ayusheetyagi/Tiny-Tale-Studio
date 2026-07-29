import { motion } from "framer-motion";

interface DiscussionCardProps {
  question: string;
}

export default function DiscussionCard({ question }: DiscussionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl border border-sage-soft bg-sage-soft/40 p-5"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">💬</span>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sage-deep">
          Parent-Child Discussion
        </h3>
      </div>
      <p className="text-ink-soft">{question}</p>
    </motion.div>
  );
}
