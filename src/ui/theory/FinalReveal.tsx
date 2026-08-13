import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScoringResult } from "@/types";

interface FinalRevealProps {
  result: ScoringResult;
  finalExplanationSummary: string;
  onClose: () => void;
}

const ANALYSIS_LINES = [
  "ANALYZING THEORY...",
  "Comparing timeline...",
  "Cross-referencing evidence...",
  "Checking contradictions...",
  "Reconstructing events...",
];

const RANK_COLOR: Record<ScoringResult["rank"], string> = {
  NOVICE: "var(--color-text-muted)",
  INVESTIGATOR: "var(--color-cat-digital)",
  DETECTIVE: "var(--color-accent-amber)",
  "MASTER DETECTIVE": "var(--color-accent-red-bright)",
};

const CATEGORY_LABEL: Record<ScoringResult["categoryScores"][number]["category"], string> = {
  culprit: "CULPRIT",
  timeline: "TIMELINE",
  keyContradiction: "KEY CLUE",
  motive: "MOTIVE",
  evidenceSelection: "EVIDENCE",
  theoryCoherence: "COHERENCE",
};

export function FinalReveal({ result, finalExplanationSummary, onClose }: FinalRevealProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (lineIndex >= ANALYSIS_LINES.length) {
      const t = window.setTimeout(() => setShowResult(true), 400);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setLineIndex((i) => i + 1), 550);
    return () => window.clearTimeout(t);
  }, [lineIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="analysis"
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 font-[var(--font-typewriter)] text-sm text-[var(--color-accent-amber)]"
          >
            {ANALYSIS_LINES.slice(0, lineIndex + 1).map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: i === lineIndex ? 1 : 0.4, y: 0 }}
                className="tracking-wide"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-xl overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-strong)] bg-[var(--color-bg-raised)]"
          >
            <div className="flex flex-col items-center gap-1 border-b border-[var(--color-border)] px-6 py-6 text-center">
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="font-[var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)]"
              >
                {result.overallScore}% CASE RESOLUTION
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="font-[var(--font-typewriter)] text-xs uppercase tracking-[0.3em]"
                style={{ color: RANK_COLOR[result.rank] }}
              >
                {result.rank}
              </motion.p>
            </div>

            <div className="max-h-[40vh] space-y-3 overflow-y-auto px-6 py-4">
              {result.categoryScores.map((cat, i) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className={`mt-0.5 shrink-0 font-[var(--font-typewriter)] text-xs ${
                      cat.correct ? "text-[var(--color-cat-location)]" : "text-[var(--color-accent-red-bright)]"
                    }`}
                  >
                    {cat.correct ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide text-[var(--color-text-secondary)]">
                      {CATEGORY_LABEL[cat.category]} · {cat.score}%
                    </p>
                    <p className="mt-0.5 font-[var(--font-typewriter)] text-[11.5px] leading-snug text-[var(--color-text-muted)]">
                      {cat.explanation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="border-t border-[var(--color-border)] px-6 py-4"
            >
              <p className="mb-1 font-[var(--font-typewriter)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                What Actually Happened
              </p>
              <p className="font-[var(--font-typewriter)] text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                {finalExplanationSummary}
              </p>
            </motion.div>

            <div className="flex justify-end border-t border-[var(--color-border)] px-6 py-3">
              <button
                onClick={onClose}
                className="rounded-sm bg-[var(--color-accent-red)] px-4 py-1.5 font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide text-[var(--color-paper)]"
              >
                Back to the Board
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
