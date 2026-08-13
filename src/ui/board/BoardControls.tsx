interface BoardControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  showAutoLines: boolean;
  onToggleAutoLines: () => void;
}

// Day 1: zoom + search. Category filter chips are a Day 2/3 addition once
// there are enough discovered clues across categories to make filtering useful.
export function BoardControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  search,
  onSearchChange,
  showAutoLines,
  onToggleAutoLines,
}: BoardControlsProps) {
  return (
    <div className="absolute left-2 top-2 z-20 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-2 rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-bg-raised)]/90 px-2 py-1.5 backdrop-blur-sm sm:left-3 sm:top-3">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search evidence…"
        className="w-28 min-w-0 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 font-[var(--font-typewriter)] text-[11px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-red)] focus:outline-none sm:w-40"
      />

      <div className="mx-1 hidden h-4 w-px bg-[var(--color-border-strong)] sm:block" />

      <button
        onClick={onZoomOut}
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--color-border)] font-[var(--font-typewriter)] text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] sm:h-6 sm:w-6"
        aria-label="Zoom out"
      >
        −
      </button>
      <span className="w-9 text-center font-[var(--font-typewriter)] text-[11px] text-[var(--color-text-muted)] sm:w-10">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--color-border)] font-[var(--font-typewriter)] text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] sm:h-6 sm:w-6"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={onReset}
        className="rounded-sm border border-[var(--color-border)] px-2 py-1.5 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] sm:py-1"
      >
        Reset
      </button>

      <div className="mx-1 hidden h-4 w-px bg-[var(--color-border-strong)] sm:block" />

      {/* Off by default (see EvidenceBoard): these lines come straight from
          the case file's answer-key relationships, not from anything the
          player has discovered by connecting evidence themselves. Leaving
          them on by default would show the solution before the player's
          even looked at two cards. This is here mainly for Dev B / QA to
          sanity-check that the relationship data is wired correctly. */}
      <button
        onClick={onToggleAutoLines}
        className={`rounded-sm border px-2 py-1.5 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide sm:py-1 ${
          showAutoLines
            ? "border-[var(--color-accent-amber)] text-[var(--color-accent-amber)]"
            : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
        }`}
        title="Data-defined relationships — spoils the deduction, off by default"
      >
        {showAutoLines ? "Hide case links" : "Show case links"}
      </button>
    </div>
  );
}
