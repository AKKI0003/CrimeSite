import { useCaseStateStore } from "@/engine/caseState";
import { clues } from "@/data/clues";
import { suspects } from "@/data/suspects";
import type { Clue, Suspect } from "@/types";

/**
 * The ONLY way ui/ code should read case data. Dev A: import from here, not from
 * @/data or @/engine directly. This means Dev B can change how state is computed
 * or stored without ever breaking a component that uses this hook, as long as the
 * return shape below stays the same. If you need something new, ask for a new field
 * here rather than reaching into @/engine yourself.
 *
 * PERFORMANCE: subscribes to each store slice individually instead of the whole
 * store object, so e.g. typing a note doesn't re-render the board's discoveredClues
 * derivation, and dragging a card doesn't re-render the suspect panel. Combined with
 * EvidenceBoard's motion-value-based pan/drag, this keeps state-driven re-renders
 * scoped to only the components that actually read the changed slice.
 */
export function useCaseState() {
  const discoveredClueIds = useCaseStateStore((s) => s.discoveredClueIds);
  const boardPositions = useCaseStateStore((s) => s.boardPositions);
  const connections = useCaseStateStore((s) => s.connections);
  const notes = useCaseStateStore((s) => s.notes);

  const discoverClue = useCaseStateStore((s) => s.discoverClue);
  const isDiscovered = useCaseStateStore((s) => s.isDiscovered);
  const moveCard = useCaseStateStore((s) => s.moveCard);
  const addConnection = useCaseStateStore((s) => s.addConnection);
  const removeConnection = useCaseStateStore((s) => s.removeConnection);
  const setNote = useCaseStateStore((s) => s.setNote);
  const reset = useCaseStateStore((s) => s.reset);

  const discoveredClues: Clue[] = clues.filter((c) => discoveredClueIds.has(c.id));
  const allSuspects: Suspect[] = suspects;

  return {
    discoveredClues,
    allClues: clues,
    allSuspects,
    boardPositions,
    connections,
    notes,

    discoverClue,
    isDiscovered,
    moveCard,
    addConnection,
    removeConnection,
    setNote,
    reset,
  };
}
