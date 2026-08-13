import { EvidenceBoard } from "@/ui/board/EvidenceBoard";
import { SuspectPanel } from "@/ui/suspects/SuspectPanel";
import { TimelineView } from "@/ui/timeline/TimelineView";
import { useCaseState } from "@/hooks/useCaseState";
import { useContradictions } from "@/hooks/useContradictions";

export function AppShell() {
  const { discoveredClues, allClues } = useCaseState();
  const { activeContradictions } = useContradictions();

  return (
    <div className="fx-crt min-h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col">
      <div className="fx-grain" />

      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-raised)] px-6 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-[var(--font-display)] text-lg tracking-wide text-[var(--color-text-primary)]">
            CASE&nbsp;<span className="text-[var(--color-accent-red-bright)]">//</span>&nbsp;FILE
          </span>
          <span className="font-[var(--font-typewriter)] text-xs text-[var(--color-text-muted)]">
            No. 017 — "The 11:42 Window"
          </span>
        </div>

        <div className="flex items-center gap-4 font-[var(--font-typewriter)] text-xs text-[var(--color-text-secondary)]">
          <span>
            {discoveredClues.length}/{allClues.length} EVIDENCE
          </span>
          <span
            className={
              activeContradictions.length > 0
                ? "text-[var(--color-accent-red-bright)]"
                : "text-[var(--color-text-muted)]"
            }
          >
            {activeContradictions.length} CONTRADICTION{activeContradictions.length === 1 ? "" : "S"}
          </span>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-[280px_1fr_300px] overflow-hidden">
        <aside className="overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <SuspectPanel />
        </aside>

        <section className="relative overflow-hidden">
          <EvidenceBoard />
        </section>

        <aside className="overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-bg-panel)]">
          <TimelineView />
        </aside>
      </main>
    </div>
  );
}
