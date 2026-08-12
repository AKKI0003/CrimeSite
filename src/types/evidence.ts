// SHARED CONTRACT — frozen after Day 1 morning sync.
// If this needs to change on Day 2/3, both devs change it together.

export type EvidenceCategory =
  | "physical"
  | "digital"
  | "location"
  | "human"
  | "timeline";

export type RelationshipType =
  | "supports"
  | "contradicts"
  | "caused_by"
  | "related_to"
  | "located_at"
  | "belongs_to"
  | "occurred_before"
  | "occurred_after"
  | "references";

export interface Relationship {
  /** id of the clue or suspect this relationship points to */
  target: string;
  type: RelationshipType;
}

export interface Clue {
  id: string;
  category: EvidenceCategory;
  title: string;
  /** short text shown on the card face */
  summary: string;
  /** full text shown when the card is opened/inspected */
  description: string;
  /** display timestamp, e.g. "10:56 PM" — optional, not every clue is time-anchored */
  timestamp?: string;
  relatedSuspects: string[];
  relationships: Relationship[];
  importance: "low" | "medium" | "high" | "critical";
  /** true = visible to the player at game start */
  discoveredByDefault: boolean;
  /** ids of clues that must be discovered before this one unlocks (optional gating) */
  unlocksAfter?: string[];
  /** default x/y position on the board when first placed, board can move it after */
  boardPosition?: { x: number; y: number };
}
