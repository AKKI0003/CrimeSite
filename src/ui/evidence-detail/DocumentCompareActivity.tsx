import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Clue, DocumentCompareActivity as DocumentCompareActivityType } from "@/types";

interface Props {
  clue: Clue;
  activity: DocumentCompareActivityType;
  /** looked up by EvidenceInspector from the full clue list, since this
   *  component only knows the target id */
  compareClue: Clue | undefined;
  discoverClue: (clueId: string) => void;
}

// Side-by-side documents; the discrepancy is deliberately NOT in either
// clue's description — it only surfaces once the player actively flags it,
// so "solving" this is a real (if small) act rather than a paragraph read.
export function DocumentCompareActivity({ clue, activity, compareClue, discoverClue }: Props) {
  const [flagged, setFlagged] = useState(false);

  function handleFlag() {
    setFlagged(true);
    // Per NOTE-for-Dev-A: this fires on the flag action specifically, not
    // on merely opening the comparison — clue_11 has no revealsClueIds at
    // all (its payoff is understanding for the player's own theory), so
    // this is a no-op there and that's intentional.
    (activity.revealsClueIds ?? []).forEach((id) => discoverClue(id));
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DocPane title={clue.title} body={clue.summary} highlighted={flagged} />
        <DocPane
          title={compareClue?.title ?? "Unknown document"}
          body={compareClue?.summary ?? "This document couldn't be located."}
          highlighted={flagged}
        />
      </div>

      {!flagged ? (
        <button
          onClick={handleFlag}
          className="mt-3 w-full rounded-sm border border-[var(--color-accent-amber)] bg-[var(--color-accent-amber)]/10 px-3 py-2 font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide text-[var(--color-accent-amber)] transition-colors hover:bg-[var(--color-accent-amber)]/20"
        >
          Flag a discrepancy
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-sm border border-[var(--color-accent-amber)] bg-[var(--color-accent-amber)]/10 px-3 py-2.5"
          >
            <p className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-accent-amber)]">
              Discrepancy found
            </p>
            <p className="mt-1 font-[var(--font-typewriter)] text-[12.5px] leading-relaxed text-[var(--color-ink)]">
              {activity.discrepancyHint}
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function DocPane({ title, body, highlighted }: { title: string; body: string; highlighted: boolean }) {
  return (
    <div
      className={`rounded-sm border p-3 transition-colors ${
        highlighted ? "border-[var(--color-accent-amber)]" : "border-black/15"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
    >
      <p className="font-[var(--font-display)] text-[13px] font-semibold leading-tight text-[var(--color-ink)]">
        {title}
      </p>
      <p className="mt-1.5 font-[var(--font-typewriter)] text-[11.5px] leading-relaxed text-[var(--color-ink-faded)]">
        {body}
      </p>
    </div>
  );
}
