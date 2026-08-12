import { useMemo } from "react";
import { useCaseStateStore } from "@/engine/caseState";
import { findActiveContradictions, playerHasConnectedContradiction } from "@/engine/contradictionEngine";

/**
 * The ONLY way ui/ code should read contradiction flags. Returns which discovered
 * clue pairs contradict each other, and whether the player has already connected
 * that pair on the board. Dev A: use this to drive the visual "conflicting evidence"
 * indicator — don't reimplement contradiction logic in a component.
 */
export function useContradictions() {
  const discoveredClueIds = useCaseStateStore((s) => s.discoveredClueIds);
  const connections = useCaseStateStore((s) => s.connections);

  const activeContradictions = useMemo(
    () => findActiveContradictions(discoveredClueIds),
    [discoveredClueIds]
  );

  const hasFoundKeyContradiction = useMemo(
    () => playerHasConnectedContradiction(discoveredClueIds, connections),
    [discoveredClueIds, connections]
  );

  return { activeContradictions, hasFoundKeyContradiction };
}
