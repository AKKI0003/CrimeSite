import { clues } from "@/data/clues";

/**
 * Pure function: given the current set of discovered clue ids, returns the ids of
 * any gated clues (`unlocksAfter`) whose prerequisites are now fully satisfied but
 * which aren't discovered yet. Call this after any discoverClue() to cascade unlocks.
 */
export function computeNewlyUnlockedClues(discoveredClueIds: Set<string>): string[] {
  const newlyUnlocked: string[] = [];

  for (const clue of clues) {
    if (discoveredClueIds.has(clue.id)) continue;
    if (!clue.unlocksAfter || clue.unlocksAfter.length === 0) continue;

    const allPrereqsMet = clue.unlocksAfter.every((prereqId) => discoveredClueIds.has(prereqId));
    if (allPrereqsMet) {
      newlyUnlocked.push(clue.id);
    }
  }

  return newlyUnlocked;
}

/**
 * Repeatedly applies computeNewlyUnlockedClues until nothing new unlocks, to handle
 * chains. Returns the full set of ids that should end up discovered.
 */
export function cascadeUnlocks(discoveredClueIds: Set<string>): Set<string> {
  const result = new Set(discoveredClueIds);
  let changed = true;

  while (changed) {
    const newlyUnlocked = computeNewlyUnlockedClues(result);
    changed = newlyUnlocked.length > 0;
    for (const id of newlyUnlocked) result.add(id);
  }

  return result;
}

/** For a locked clue, returns the titles of the clues still needed to unlock it —
 * useful for a "locked — discover X and Y first" tooltip in the UI. */
export function getMissingPrerequisites(clueId: string, discoveredClueIds: Set<string>): string[] {
  const clue = clues.find((c) => c.id === clueId);
  if (!clue || !clue.unlocksAfter) return [];

  return clue.unlocksAfter
    .filter((prereqId) => !discoveredClueIds.has(prereqId))
    .map((prereqId) => clues.find((c) => c.id === prereqId)?.title ?? prereqId);
}

/**
 * Given a clue the player is currently inspecting, returns any locked clues that
 * are now fully unlockable AND count this clue as one of their prerequisites —
 * the "you found something else while looking at this" moment. Drives a
 * "Dig Deeper" prompt in EvidenceInspector rather than unlocking gated clues
 * silently/automatically, so discovery still feels like an active choice.
 */
export function getUnlockLeadsFor(clueId: string, discoveredClueIds: Set<string>) {
  const unlockableIds = computeNewlyUnlockedClues(discoveredClueIds);
  return unlockableIds
    .map((id) => clues.find((c) => c.id === id))
    .filter((c): c is (typeof clues)[number] => !!c && !!c.unlocksAfter?.includes(clueId));
}
