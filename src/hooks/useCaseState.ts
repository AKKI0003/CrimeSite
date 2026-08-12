import { useCaseStateStore } from "@/engine/caseState";
import { clues } from "@/data/clues";
import { suspects } from "@/data/suspects";
import { computeProgress } from "@/engine/caseProgress";
import type { Clue, Suspect } from "@/types";

/**
 * The ONLY way ui/ code should read case data. Dev A: import from here, not from
 * @/data or @/engine directly. This means Dev B can change how state is computed
 * or stored without ever breaking a component that uses this hook, as long as the
 * return shape below stays the same. If you need something new, ask for a new field
 * here rather than reaching into @/engine yourself.
 */
export function useCaseState() {
  const store = useCaseStateStore();

  const discoveredClues: Clue[] = clues.filter((c) => store.discoveredClueIds.has(c.id));
  const allSuspects: Suspect[] = suspects;
  const progress = computeProgress(store.discoveredClueIds, store.connections);

  return {
    discoveredClues,
    allClues: clues,
    allSuspects,
    boardPositions: store.boardPositions,
    connections: store.connections,
    notes: store.notes,
    /** discoveredClueCount, totalClueCount, connectionCount, progressPercent, etc. —
     * drives the "CONNECTIONS: 12  CLUES: 17  PROGRESS 64%" style footer. */
    progress,

    discoverClue: store.discoverClue,
    isDiscovered: store.isDiscovered,
    moveCard: store.moveCard,
    addConnection: store.addConnection,
    removeConnection: store.removeConnection,
    setNote: store.setNote,
    reset: store.reset,
    /** call after meaningful state changes, or on an interval/beforeunload, to save to localStorage */
    persist: store.persist,
  };
}
