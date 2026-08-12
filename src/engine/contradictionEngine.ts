import { clues } from "@/data/clues";
import type { PlayerConnection } from "./caseState";

export interface ContradictionFlag {
  clueIdA: string;
  clueIdB: string;
}

/**
 * Returns every `contradicts` relationship where BOTH clues have been discovered
 * by the player. Pure function — no React, no store access — so it's directly
 * unit-testable and reusable from both the UI hook and any future CLI/test script.
 */
export function findActiveContradictions(discoveredClueIds: Set<string>): ContradictionFlag[] {
  const flags: ContradictionFlag[] = [];
  const seen = new Set<string>();

  for (const clue of clues) {
    if (!discoveredClueIds.has(clue.id)) continue;
    for (const rel of clue.relationships) {
      if (rel.type !== "contradicts") continue;
      if (!discoveredClueIds.has(rel.target)) continue;

      const key = [clue.id, rel.target].sort().join("::");
      if (seen.has(key)) continue;
      seen.add(key);
      flags.push({ clueIdA: clue.id, clueIdB: rel.target });
    }
  }

  return flags;
}

/**
 * Optional helper: has the player explicitly drawn a connection between two clues
 * that are known to contradict each other? Useful for a "you found it" moment
 * distinct from just having both cards discovered.
 */
export function playerHasConnectedContradiction(
  discoveredClueIds: Set<string>,
  connections: PlayerConnection[]
): boolean {
  const active = findActiveContradictions(discoveredClueIds);
  return active.some((flag) =>
    connections.some(
      (c) =>
        (c.source === flag.clueIdA && c.target === flag.clueIdB) ||
        (c.source === flag.clueIdB && c.target === flag.clueIdA)
    )
  );
}
