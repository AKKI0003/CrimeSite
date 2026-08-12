import { clues } from "@/data/clues";
import { suspects } from "@/data/suspects";
import type { PlayerConnection } from "./caseState";

export interface ProgressStats {
  discoveredClueCount: number;
  totalClueCount: number;
  connectionCount: number;
  /** count of "contradicts" relationships the player has actually connected on the board */
  criticalCluesDiscoveredCount: number;
  totalCriticalClueCount: number;
  /** 0-100, weighted: 60% clue discovery, 40% critical-clue discovery */
  progressPercent: number;
}

/**
 * Pure, testable — matches the "CONNECTIONS: 12  CLUES: 17  PROGRESS 64%" footer
 * from the design doc's main-screen mockup. UI reads this via useCaseState(), never
 * calls this directly.
 */
export function computeProgress(
  discoveredClueIds: Set<string>,
  connections: PlayerConnection[]
): ProgressStats {
  const totalClueCount = clues.length;
  const discoveredClueCount = discoveredClueIds.size;

  const criticalClues = clues.filter((c) => c.importance === "critical");
  const totalCriticalClueCount = criticalClues.length;
  const criticalCluesDiscoveredCount = criticalClues.filter((c) =>
    discoveredClueIds.has(c.id)
  ).length;

  const discoveryRatio = totalClueCount === 0 ? 0 : discoveredClueCount / totalClueCount;
  const criticalRatio =
    totalCriticalClueCount === 0 ? 0 : criticalCluesDiscoveredCount / totalCriticalClueCount;

  const progressPercent = Math.round((discoveryRatio * 0.6 + criticalRatio * 0.4) * 100);

  return {
    discoveredClueCount,
    totalClueCount,
    connectionCount: connections.length,
    criticalCluesDiscoveredCount,
    totalCriticalClueCount,
    progressPercent,
  };
}

/** Total suspects, exposed for any UI that wants a denominator (e.g. "6 persons of interest"). */
export function getSuspectCount(): number {
  return suspects.length;
}
