import type { Relationship } from "@/types";

// This file is a flat, denormalized reference view of every relationship in the case,
// for use in graph-wide queries, tests, and the design-doc cross-check script
// (see engine/contradictionEngine.ts for how "contradicts" edges get surfaced to the UI).
//
// The source of truth for relationships is still each Clue's own `relationships` array
// in data/clues.ts — this file is derived/duplicated for convenience and should be
// regenerated (or kept in sync) any time clues.ts relationships change.

export interface GraphEdge extends Relationship {
  source: string;
}

export const allEdges: GraphEdge[] = [
  { source: "clue_01", target: "clue_08", type: "related_to" },
  { source: "clue_02", target: "clue_03", type: "related_to" },
  { source: "clue_03", target: "clue_04", type: "contradicts" },
  { source: "clue_04", target: "clue_03", type: "contradicts" },
  { source: "clue_04", target: "clue_14", type: "supports" },
  { source: "clue_05", target: "clue_18", type: "related_to" },
  { source: "clue_06", target: "clue_07", type: "related_to" },
  { source: "clue_07", target: "clue_06", type: "supports" },
  { source: "clue_08", target: "clue_01", type: "related_to" },
  { source: "clue_08", target: "clue_09", type: "occurred_before" },
  { source: "clue_08", target: "clue_03", type: "occurred_before" },
  { source: "clue_09", target: "clue_08", type: "occurred_after" },
  { source: "clue_09", target: "clue_10", type: "related_to" },
  { source: "clue_10", target: "clue_11", type: "related_to" },
  { source: "clue_10", target: "clue_09", type: "related_to" },
  { source: "clue_11", target: "clue_10", type: "related_to" },
  { source: "clue_12", target: "clue_10", type: "related_to" },
  { source: "clue_13", target: "clue_10", type: "supports" },
  { source: "clue_14", target: "clue_04", type: "supports" },
  { source: "clue_17", target: "clue_04", type: "related_to" },
  { source: "clue_18", target: "clue_05", type: "related_to" },
];

/** The single edge the whole case hinges on — surfaced early/prominently by the engine. */
export const KEY_CONTRADICTION: GraphEdge = {
  source: "clue_03",
  target: "clue_04",
  type: "contradicts",
};
