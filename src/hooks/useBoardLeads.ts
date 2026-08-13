import { useMemo } from "react";
import { useCaseStateStore } from "@/engine/caseState";
import { clues } from "@/data/clues";
import { computeNewlyUnlockedClues, getMissingPrerequisites } from "@/engine/clueUnlockEngine";

export interface BoardLead {
  clueId: string;
  /** "ready" = every prerequisite met, one tap away. "near" = some (not all)
   *  prerequisites met — present-but-unfound, not yet clickable. */
  state: "ready" | "near";
  /** only populated for "near" leads, for a locked tooltip */
  missing: string[];
}

// Replaces the old per-clue "Dig Deeper" prompt (which only ever surfaced
// leads for the one clue you had open) with a board-wide picture: every
// gated clue not yet discovered, split into "ready to reveal" and "close but
// not yet." Per NOTE-for-Dev-A point 4 — the board should read as "more is
// here, go find it" rather than sparse/empty, and it should be a quiet
// visual (a dim card on the corkboard), not a CTA inside a modal.
export function useBoardLeads(): BoardLead[] {
  const discoveredClueIds = useCaseStateStore((s) => s.discoveredClueIds);

  return useMemo(() => {
    const readyIds = new Set(computeNewlyUnlockedClues(discoveredClueIds));
    const leads: BoardLead[] = [];

    for (const clue of clues) {
      if (discoveredClueIds.has(clue.id)) continue;
      if (!clue.unlocksAfter || clue.unlocksAfter.length === 0) continue;

      if (readyIds.has(clue.id)) {
        leads.push({ clueId: clue.id, state: "ready", missing: [] });
      } else {
        const missing = getMissingPrerequisites(clue.id, discoveredClueIds);
        // Only show as "sensed" once at least one prerequisite is already
        // in — otherwise every locked clue in the whole case would show up
        // on the board on day one, which is the opposite of quiet.
        if (missing.length < clue.unlocksAfter.length) {
          leads.push({ clueId: clue.id, state: "near", missing });
        }
      }
    }

    return leads;
  }, [discoveredClueIds]);
}
