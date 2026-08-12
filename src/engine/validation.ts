import type { PlayerTheory } from "@/types";

export type TheoryField =
  | "culpritId"
  | "motiveId"
  | "supportingClueIds"
  | "keyContradictionClueId"
  | "reconstructedTimelineEventIds"
  | "finalExplanation";

export interface TheoryValidationResult {
  isComplete: boolean;
  missingFields: TheoryField[];
  /** human-readable messages, one per missing field, for inline form hints */
  messages: string[];
}

const FIELD_MESSAGES: Record<TheoryField, string> = {
  culpritId: "Select who you believe is responsible.",
  motiveId: "Explain what you believe the motive was.",
  supportingClueIds: "Select at least one piece of evidence that supports your theory.",
  keyContradictionClueId: "Identify the key contradiction in the evidence.",
  reconstructedTimelineEventIds: "Arrange at least a few timeline events into your sequence.",
  finalExplanation: "Write your explanation of what happened at 11:42 PM.",
};

/**
 * Pure, testable completeness check. Does NOT judge correctness — that's
 * theoryScorer's job. This only answers "is there enough here to submit?"
 * so the UI can disable/enable a submit button and show inline hints.
 */
export function validateTheory(theory: Partial<PlayerTheory>): TheoryValidationResult {
  const missingFields: TheoryField[] = [];

  if (!theory.culpritId) missingFields.push("culpritId");
  if (!theory.motiveId || theory.motiveId.trim().length === 0) missingFields.push("motiveId");
  if (!theory.supportingClueIds || theory.supportingClueIds.length === 0)
    missingFields.push("supportingClueIds");
  if (!theory.keyContradictionClueId) missingFields.push("keyContradictionClueId");
  if (
    !theory.reconstructedTimelineEventIds ||
    theory.reconstructedTimelineEventIds.length === 0
  )
    missingFields.push("reconstructedTimelineEventIds");
  if (!theory.finalExplanation || theory.finalExplanation.trim().length < 20)
    missingFields.push("finalExplanation");

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    messages: missingFields.map((f) => FIELD_MESSAGES[f]),
  };
}

/** Fills in safe defaults for any missing fields, so scoreTheory() never crashes
 * on a partially-filled draft (e.g. a "preview my score so far" feature). */
export function withDefaults(theory: Partial<PlayerTheory>): PlayerTheory {
  return {
    culpritId: theory.culpritId ?? null,
    motiveId: theory.motiveId ?? null,
    supportingClueIds: theory.supportingClueIds ?? [],
    keyContradictionClueId: theory.keyContradictionClueId ?? null,
    reconstructedTimelineEventIds: theory.reconstructedTimelineEventIds ?? [],
    finalExplanation: theory.finalExplanation ?? "",
  };
}
