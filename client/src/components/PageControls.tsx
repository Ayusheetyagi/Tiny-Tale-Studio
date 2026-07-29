interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function PageControls({ currentPage, totalPages, onPrevious, onNext }: PageControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-full border border-amber-soft bg-white px-5 py-2.5 font-medium text-ink-soft transition-colors hover:bg-amber-soft/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden>←</span> Previous
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <span
            key={page}
            className={`h-2 w-2 rounded-full transition-colors ${
              page === currentPage ? "bg-terracotta" : "bg-amber-soft"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 font-medium text-white shadow-card transition-colors hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <span aria-hidden>→</span>
      </button>
    </div>
  );
}
