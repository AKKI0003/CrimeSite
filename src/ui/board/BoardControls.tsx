interface BoardControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  search: string;
  onSearchChange: (v: string) => void;
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
}: BoardControlsProps) {
  return (
    <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-bg-raised)]/90 px-2 py-1.5 backdrop-blur-sm">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search evidence…"
        className="w-40 rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 font-[var(--font-typewriter)] text-[11px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-red)] focus:outline-none"
      />

      <div className="mx-1 h-4 w-px bg-[var(--color-border-strong)]" />

      <button
        onClick={onZoomOut}
        className="h-6 w-6 rounded-sm border border-[var(--color-border)] font-[var(--font-typewriter)] text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
        aria-label="Zoom out"
      >
        −
      </button>
      <span className="w-10 text-center font-[var(--font-typewriter)] text-[11px] text-[var(--color-text-muted)]">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="h-6 w-6 rounded-sm border border-[var(--color-border)] font-[var(--font-typewriter)] text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={onReset}
        className="ml-1 rounded-sm border border-[var(--color-border)] px-2 py-1 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
      >
        Reset
      </button>
    </div>
  );
}
