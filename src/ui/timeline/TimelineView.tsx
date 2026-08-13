import { useTimeline } from "@/hooks/useTimeline";

// Day 1: minimal counts view via the approved data hook (was previously importing
// @/data/timeline directly — fixed to respect the ui/ never-imports-data/ rule).
// Real scrubber + false/true variant toggle is a Day 2 build.
export function TimelineView() {
  const { events, falseTimeline, trueTimeline } = useTimeline();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <h2 className="font-[var(--font-typewriter)] text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Timeline
        </h2>
      </div>

      <div className="p-4 font-[var(--font-typewriter)] text-xs text-[var(--color-text-secondary)] space-y-2">
        <p>{events.length} total events loaded</p>
        <p className="text-[var(--color-accent-amber)]">{falseTimeline.length} in reported timeline</p>
        <p className="text-[var(--color-text-muted)]">{trueTimeline.length} in reconstructed timeline (hidden until solve)</p>
      </div>
    </div>
  );
}
