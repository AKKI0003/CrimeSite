import { useState } from "react";
import { EvidenceBoard } from "@/ui/board/EvidenceBoard";
import { SuspectPanel } from "@/ui/suspects/SuspectPanel";
import { TimelineView } from "@/ui/timeline/TimelineView";
import { TheoryBuilder } from "@/ui/theory/TheoryBuilder";
import { useCaseState } from "@/hooks/useCaseState";
import { useContradictions } from "@/hooks/useContradictions";

type MobileTab = "suspects" | "board" | "timeline";

export function AppShell() {
  const { discoveredClues, allClues } = useCaseState();
  const { activeContradictions } = useContradictions();
  const [mobileTab, setMobileTab] = useState<MobileTab>("board");
  const [theoryOpen, setTheoryOpen] = useState(false);

  return (
    <div className="fx-crt flex h-[100dvh] w-full flex-col overflow-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="fx-grain" />

      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-raised)] px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img
            src="/assets/art/logo.jpg"
            alt=""
            className="h-7 w-7 rounded-sm object-cover sm:h-8 sm:w-8"
            draggable={false}
          />
          <span className="whitespace-nowrap font-[var(--font-display)] text-base tracking-wide text-[var(--color-text-primary)] sm:text-lg">
            CASE&nbsp;<span className="text-[var(--color-accent-red-bright)]">//</span>&nbsp;FILE
          </span>
          <span className="hidden truncate font-[var(--font-typewriter)] text-xs text-[var(--color-text-muted)] sm:inline">
            No. 017 — "The 11:42 Window"
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 font-[var(--font-typewriter)] text-[10px] text-[var(--color-text-secondary)] sm:gap-4 sm:text-xs">
            <span>
              {discoveredClues.length}/{allClues.length}
              <span className="hidden sm:inline"> EVIDENCE</span>
            </span>
            <span
              className={
                activeContradictions.length > 0
                  ? "text-[var(--color-accent-red-bright)]"
                  : "text-[var(--color-text-muted)]"
              }
            >
              {activeContradictions.length}
              <span className="hidden sm:inline"> CONTRADICTION{activeContradictions.length === 1 ? "" : "S"}</span>
              <span className="sm:hidden">⚠</span>
            </span>
          </div>

          <button
            onClick={() => setTheoryOpen(true)}
            className="rounded-sm bg-[var(--color-accent-red)] px-2.5 py-1.5 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-paper)] sm:px-3 sm:text-[11px]"
          >
            <span className="sm:hidden">Theory</span>
            <span className="hidden sm:inline">Submit Theory</span>
          </button>
        </div>
      </header>

      {/* Desktop / tablet: all three panels side by side. */}
      <main className="hidden flex-1 overflow-hidden lg:grid lg:grid-cols-[260px_1fr_280px] xl:grid-cols-[280px_1fr_300px]">
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

      {/* Mobile / small tablet: one panel at a time, switched by tab bar. */}
      <main className="flex flex-1 flex-col overflow-hidden lg:hidden">
        <div className="flex-1 overflow-hidden">
          {mobileTab === "suspects" && (
            <div className="h-full overflow-y-auto bg-[var(--color-bg-panel)]">
              <SuspectPanel />
            </div>
          )}
          {mobileTab === "board" && (
            <div className="relative h-full overflow-hidden">
              <EvidenceBoard />
            </div>
          )}
          {mobileTab === "timeline" && (
            <div className="h-full overflow-y-auto bg-[var(--color-bg-panel)]">
              <TimelineView />
            </div>
          )}
        </div>

        <nav className="flex border-t border-[var(--color-border)] bg-[var(--color-bg-raised)]">
          <MobileTabButton label="Suspects" active={mobileTab === "suspects"} onClick={() => setMobileTab("suspects")} />
          <MobileTabButton label="Board" active={mobileTab === "board"} onClick={() => setMobileTab("board")} />
          <MobileTabButton label="Timeline" active={mobileTab === "timeline"} onClick={() => setMobileTab("timeline")} />
        </nav>
      </main>

      {theoryOpen && <TheoryBuilder onClose={() => setTheoryOpen(false)} />}
    </div>
  );
}

function MobileTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide transition-colors ${
        active
          ? "border-t-2 border-[var(--color-accent-red-bright)] text-[var(--color-text-primary)]"
          : "border-t-2 border-transparent text-[var(--color-text-muted)]"
      }`}
    >
      {label}
    </button>
  );
}
