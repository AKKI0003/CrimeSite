// SHARED CONTRACT — frozen after Day 1 morning sync.

export interface PlayerTheory {
  /** suspect id the player believes is criminally responsible */
  culpritId: string | null;
  /** free-form or selected motive id/text */
  motiveId: string | null;
  /** ordered clue ids the player selects as their proof */
  supportingClueIds: string[];
  /** clue id the player identifies as the key contradiction */
  keyContradictionClueId: string | null;
  /** ids of timeline events the player has arranged, in player's chosen order */
  reconstructedTimelineEventIds: string[];
  /** free text explanation the player writes for "what happened at 11:42 PM" */
  finalExplanation: string;
}

export interface CategoryScore {
  category:
    | "culprit"
    | "timeline"
    | "keyContradiction"
    | "motive"
    | "evidenceSelection"
    | "theoryCoherence";
  correct: boolean;
  /** 0-100 for this category */
  score: number;
  /** human-readable explanation shown to the player in the reveal sequence */
  explanation: string;
}

export interface ScoringResult {
  overallScore: number; // 0-100, weighted average
  rank: "NOVICE" | "INVESTIGATOR" | "DETECTIVE" | "MASTER DETECTIVE";
  categoryScores: CategoryScore[];
}
