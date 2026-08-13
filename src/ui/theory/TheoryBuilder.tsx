import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCaseState } from "@/hooks/useCaseState";
import { useTheoryValidation } from "@/hooks/useTheoryValidation";
import { FinalReveal } from "./FinalReveal";
import type { PlayerTheory, ScoringResult } from "@/types";

interface TheoryBuilderProps {
  onClose: () => void;
}

const STEPS = ["culprit", "motive", "evidence", "contradiction", "explanation"] as const;
type Step = (typeof STEPS)[number];

const STEP_LABEL: Record<Step, string> = {
  culprit: "Who is responsible?",
  motive: "What was the motive?",
  evidence: "What evidence proves it?",
  contradiction: "What was the key contradiction?",
  explanation: "What happened at 11:42 PM?",
};

export function TheoryBuilder({ onClose }: TheoryBuilderProps) {
  const { discoveredClues, allSuspects } = useCaseState();

  const [step, setStep] = useState<Step>("culprit");
  const [culpritId, setCulpritId] = useState<string | null>(null);
  const [motiveId, setMotiveId] = useState<string>("");
  const [supportingClueIds, setSupportingClueIds] = useState<string[]>([]);
  const [keyContradictionClueId, setKeyContradictionClueId] = useState<string | null>(null);
  const [finalExplanation, setFinalExplanation] = useState("");

  const [result, setResult] = useState<ScoringResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const draft: Partial<PlayerTheory> = {
    culpritId,
    motiveId,
    supportingClueIds,
    keyContradictionClueId,
    reconstructedTimelineEventIds: [], // simplified — timeline ordering not part of this UI pass
    finalExplanation,
  };

  const { validation, submit, finalExplanationSummary } = useTheoryValidation(draft);

  function toggleClue(id: string) {
    setSupportingClueIds((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]));
  }

  function handleSubmit() {
    setAnalyzing(true);
    // Brief artificial delay so the "ANALYZING THEORY..." sequence in FinalReveal
    // has room to play — this is the cinematic beat the design doc calls for.
    window.setTimeout(() => {
      setResult(submit());
      setAnalyzing(false);
    }, 2200);
  }

  const stepIndex = STEPS.indexOf(step);

  if (result) {
    return <FinalReveal result={result} finalExplanationSummary={finalExplanationSummary} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="fx-paper flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[var(--radius-panel)]"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 sm:px-6">
          <div>
            <p className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-faded)]">
              Your Theory · Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
              {STEP_LABEL[step]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm px-2 py-1 font-[var(--font-typewriter)] text-xs text-[var(--color-ink-faded)] hover:text-[var(--color-ink)]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              {step === "culprit" && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {allSuspects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCulpritId(s.id)}
                      className={`rounded-sm border px-3 py-2 text-left transition-colors ${
                        culpritId === s.id
                          ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)]/10"
                          : "border-black/10 hover:border-black/25"
                      }`}
                    >
                      <p className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-ink)]">
                        {s.name}
                      </p>
                      <p className="font-[var(--font-typewriter)] text-[11px] text-[var(--color-ink-faded)]">
                        {s.occupation}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === "motive" && (
                <textarea
                  value={motiveId}
                  onChange={(e) => setMotiveId(e.target.value)}
                  placeholder="What was the motive? Be specific — what did they have to gain, or lose?"
                  rows={5}
                  className="w-full resize-none rounded-sm border border-black/10 bg-white/40 px-3 py-2 font-[var(--font-typewriter)] text-[12.5px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faded)] focus:border-[var(--color-accent-red)] focus:outline-none"
                />
              )}

              {step === "evidence" && (
                <div className="space-y-2">
                  <p className="mb-2 font-[var(--font-typewriter)] text-[11px] text-[var(--color-ink-faded)]">
                    Select every piece of evidence that supports your theory.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {discoveredClues.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => toggleClue(c.id)}
                        className={`rounded-sm border px-3 py-2 text-left transition-colors ${
                          supportingClueIds.includes(c.id)
                            ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)]/10"
                            : "border-black/10 hover:border-black/25"
                        }`}
                      >
                        <p className="font-[var(--font-display)] text-[13px] font-semibold text-[var(--color-ink)]">
                          {c.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "contradiction" && (
                <div className="space-y-2">
                  <p className="mb-2 font-[var(--font-typewriter)] text-[11px] text-[var(--color-ink-faded)]">
                    Which single piece of evidence exposes the key contradiction in the case?
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {discoveredClues.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setKeyContradictionClueId(c.id)}
                        className={`rounded-sm border px-3 py-2 text-left transition-colors ${
                          keyContradictionClueId === c.id
                            ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)]/10"
                            : "border-black/10 hover:border-black/25"
                        }`}
                      >
                        <p className="font-[var(--font-display)] text-[13px] font-semibold text-[var(--color-ink)]">
                          {c.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "explanation" && (
                <textarea
                  value={finalExplanation}
                  onChange={(e) => setFinalExplanation(e.target.value)}
                  placeholder="Walk through what actually happened, in your own words — motive, method, and how the false timeline was built."
                  rows={8}
                  className="w-full resize-none rounded-sm border border-black/10 bg-white/40 px-3 py-2 font-[var(--font-typewriter)] text-[12.5px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faded)] focus:border-[var(--color-accent-red)] focus:outline-none"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {!validation.isComplete && step === "explanation" && (
            <ul className="mt-3 space-y-0.5">
              {validation.messages.map((m) => (
                <li key={m} className="font-[var(--font-typewriter)] text-[10.5px] text-[var(--color-accent-red)]">
                  · {m}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-black/10 px-4 py-3 sm:px-6">
          <button
            onClick={() => setStep(STEPS[Math.max(0, stepIndex - 1)])}
            disabled={stepIndex === 0}
            className="rounded-sm border border-black/10 px-3 py-1.5 font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide text-[var(--color-ink-faded)] disabled:opacity-30"
          >
            Back
          </button>

          {stepIndex < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(STEPS[stepIndex + 1])}
              className="rounded-sm bg-[var(--color-accent-red)] px-4 py-1.5 font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide text-[var(--color-paper)]"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validation.isComplete || analyzing}
              className="rounded-sm bg-[var(--color-accent-red)] px-4 py-1.5 font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide text-[var(--color-paper)] disabled:opacity-40"
            >
              {analyzing ? "Analyzing…" : "Submit Theory"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
