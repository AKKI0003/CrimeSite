import { useCaseStateStore } from "@/engine/caseState";
import { getUnlockLeadsFor } from "@/engine/clueUnlockEngine";

/**
 * For a clue currently being inspected, returns any gated clues that are now
 * unlockable and treat this clue as one of their prerequisites. Dev A: use this
 * to render a "Dig Deeper" prompt in EvidenceInspector — call discoverClue(id)
 * from useCaseState() when the player clicks it.
 */
export function useUnlockLeads(clueId: string | null) {
  const discoveredClueIds = useCaseStateStore((s) => s.discoveredClueIds);
  if (!clueId) return [];
  return getUnlockLeadsFor(clueId, discoveredClueIds);
}
