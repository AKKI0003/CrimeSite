import { useMemo } from "react";
import type { PlayerTheory } from "@/types";
import { validateTheory, withDefaults } from "@/engine/validation";
import { scoreTheory, getFinalExplanationSummary } from "@/engine/theoryScorer";

/**
 * Wraps validation + scoring for the TheoryBuilder screen. Dev A: use this instead
 * of importing engine/validation or engine/theoryScorer directly.
 *
 * Usage:
 *   const { validation, submit } = useTheoryValidation(draftTheory);
 *   <button disabled={!validation.isComplete} onClick={() => setResult(submit())}>
 */
export function useTheoryValidation(draft: Partial<PlayerTheory>) {
  const validation = useMemo(() => validateTheory(draft), [draft]);

  function submit() {
    const complete = withDefaults(draft);
    return scoreTheory(complete);
  }

  /** score a possibly-incomplete draft without requiring full completion —
   * useful for a live "your theory so far" preview meter, if you want one. */
  function previewScore() {
    const complete = withDefaults(draft);
    return scoreTheory(complete);
  }

  return { validation, submit, previewScore, finalExplanationSummary: getFinalExplanationSummary() };
}
