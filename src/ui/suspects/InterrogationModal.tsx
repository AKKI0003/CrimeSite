import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Suspect } from "@/types";
import { SuspectAvatar } from "./SuspectAvatar";
import { TypewriterText } from "@/ui/shared/TypewriterText";
import { useCaseState } from "@/hooks/useCaseState";
import { playStamp } from "@/engine/audio";
import { matchQuestion, resolveAskOutcome } from "@/engine/interrogationEngine";

interface InterrogationModalProps {
  suspect: Suspect;
  onClose: () => void;
}

const TONE_COLOR: Record<string, string> = {
  calm: "var(--color-text-secondary)",
  defensive: "var(--color-accent-amber, #b8863b)",
  evasive: "var(--color-accent-amber, #b8863b)",
  nervous: "var(--color-accent-red)",
  hostile: "var(--color-accent-red-bright)",
  cornered: "var(--color-accent-red-bright)",
};

const PRESSURE_TO_BREAK = 10;

/**
 * Full-screen "interrogation." Two ways to get something real out of a
 * suspect, not just clicking through a script:
 *   1. Ask about anything, in your own words — no topic list to click
 *      through (see engine/interrogationEngine). Typing something that
 *      doesn't land yet, or asking about a topic you can't back up, does
 *      NOT move the pressure meter — only presenting real evidence does.
 *   2. Present evidence — pull a piece of discovered evidence out of your
 *      case file and confront them with it directly. Specific evidence gets
 *      a specific reaction; anything else gets a generic brush-off.
 * Once pressure fills, they crack — a longer, more honest breakthrough line
 * replaces the script entirely.
 */
export function InterrogationModal({ suspect, onClose }: InterrogationModalProps) {
  const { isDiscovered, discoveredClues, discoverClue } = useCaseState();
  const [mode, setMode] = useState<"ask" | "present">("ask");
  const [activeLine, setActiveLine] = useState<{ id: string; text: string; tone?: string } | null>(null);
  const [typing, setTyping] = useState(false);
  const [question, setQuestion] = useState("");
  const [askedCount, setAskedCount] = useState(0);
  const [presentedClueIds, setPresentedClueIds] = useState<string[]>([]);
  const [pressure, setPressure] = useState(0);
  const [broken, setBroken] = useState(false);
  const [justStamped, setJustStamped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const evidenceReactions = suspect.evidenceReactions ?? [];
  const pressurePct = Math.min(100, Math.round((pressure / PRESSURE_TO_BREAK) * 100));

  function bumpPressure(amount: number) {
    if (amount <= 0) return;
    setPressure((cur) => {
      const next = cur + amount;
      if (next >= PRESSURE_TO_BREAK && !broken && suspect.breakthroughResponse) {
        setBroken(true);
        setJustStamped(true);
        try {
          playStamp();
        } catch {
          /* audio unavailable, ignore */
        }
        window.setTimeout(() => setJustStamped(false), 400);
        setTyping(true);
        setActiveLine({ id: "breakthrough", text: suspect.breakthroughResponse!, tone: "cornered" });
      }
      return next;
    });
  }

  function submitQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (broken || typing) return;
    const q = question.trim();
    if (!q) return;

    // Free text only — matchQuestion does the keyword scoring, this
    // component just renders whatever it decides. Asking a question never
    // moves the pressure meter, whether it lands or not: only presenting
    // evidence does (see NOTE-for-Dev-A point 2).
    const outcome = matchQuestion(q, suspect, isDiscovered);
    const resolved = resolveAskOutcome(outcome, suspect);
    setActiveLine({ id: `ask_${askedCount}`, text: resolved.text, tone: resolved.tone });
    setTyping(true);
    setAskedCount((n) => n + 1);
    setQuestion("");
    // Only "answered" outcomes carry revealsClueIds (stonewalled/confused
    // never do) — self-gating in discoverClue means we don't need to check
    // that here either.
    (resolved.revealsClueIds ?? []).forEach((id) => discoverClue(id));
  }

  function presentEvidence(clueId: string) {
    if (broken) return;
    const reaction = evidenceReactions.find((r) => r.clueId === clueId);
    const text = reaction?.reaction ?? suspect.defaultEvidenceReaction ?? "...";
    setActiveLine({ id: `present_${clueId}`, text, tone: reaction?.tone });
    setTyping(true);
    if (!presentedClueIds.includes(clueId)) {
      setPresentedClueIds((cur) => [...cur, clueId]);
      bumpPressure(reaction?.pressureValue ?? (reaction ? 3 : 1));
    }
  }

  const fallbackStatement = suspect.statements[0]?.text;
  const agitated =
    activeLine?.tone === "hostile" || activeLine?.tone === "nervous" || activeLine?.tone === "cornered";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: justStamped ? [0, -6, 6, -4, 4, 0] : 0,
        }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={justStamped ? { duration: 0.4 } : undefined}
        className="fx-paper flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-[var(--radius-panel)]"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 sm:px-6">
          <p className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-faded)]">
            Interrogation Room
          </p>
          <button
            onClick={onClose}
            className="rounded-sm px-2 py-1 font-[var(--font-typewriter)] text-xs text-[var(--color-ink-faded)] hover:text-[var(--color-ink)]"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3 sm:px-6">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-black/20 sm:h-20 sm:w-20">
            <SuspectAvatar id={suspect.id} size={80} agitated={agitated} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
              {suspect.name}
            </h2>
            <p className="font-[var(--font-typewriter)] text-[11px] text-[var(--color-ink-faded)]">
              {suspect.occupation} · {suspect.relationshipToVictim}
            </p>
          </div>

          {/* Pressure meter — the game-y bit. Fills only from presenting
              evidence, cracks them at max. */}
          <div className="w-20 shrink-0 sm:w-28">
            <p className="mb-1 text-right font-[var(--font-typewriter)] text-[9px] uppercase tracking-wide text-[var(--color-ink-faded)]">
              {broken ? "Cracked" : "Composure"}
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: broken ? "var(--color-accent-red-bright)" : "var(--color-accent-red)",
                }}
                animate={{ width: `${pressurePct}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        </div>

        <div className="min-h-[110px] flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <AnimatePresence mode="wait">
            {activeLine ? (
              <motion.div
                key={activeLine.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <p
                  className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide"
                  style={{ color: TONE_COLOR[activeLine.tone ?? "calm"] }}
                >
                  {activeLine.id === "breakthrough" ? "breaking down" : activeLine.tone ?? "calm"}
                </p>
                <p
                  className={`font-[var(--font-typewriter)] leading-relaxed text-[var(--color-ink)] ${
                    activeLine.id === "breakthrough" ? "text-[14.5px] font-semibold" : "text-[13.5px]"
                  }`}
                >
                  “
                  <TypewriterText text={activeLine.text} sound onDone={() => setTyping(false)} />
                  ”
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-[var(--font-typewriter)] text-[13px] italic text-[var(--color-ink-faded)]"
              >
                {fallbackStatement
                  ? `"${fallbackStatement}"`
                  : "Ask a question, or present evidence, to begin."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {broken ? (
          <div className="border-t border-black/10 px-4 py-3 sm:px-6">
            <p className="font-[var(--font-typewriter)] text-[10.5px] text-[var(--color-ink-faded)]">
              They've said everything they're going to. Close this out and take what you have back
              to your theory.
            </p>
          </div>
        ) : (
          <div className="border-t border-black/10 px-4 py-3 sm:px-6">
            <div className="mb-2 flex gap-2">
              <ModeTab active={mode === "ask"} onClick={() => setMode("ask")} label="Ask" />
              <ModeTab
                active={mode === "present"}
                onClick={() => setMode("present")}
                label={`Present Evidence (${discoveredClues.length})`}
              />
            </div>

            {mode === "ask" && (
              <form onSubmit={submitQuestion} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={typing}
                  placeholder="Type your question and hit enter…"
                  className="min-w-0 flex-1 rounded-sm border border-black/20 bg-white/40 px-3 py-2 font-[var(--font-typewriter)] text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faded)] focus:border-[var(--color-accent-red)] focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={typing || !question.trim()}
                  className="rounded-sm bg-[var(--color-accent-red)] px-4 py-2 font-[var(--font-typewriter)] text-[11px] uppercase tracking-wide text-[var(--color-paper)] transition-opacity disabled:opacity-40"
                >
                  Ask
                </button>
              </form>
            )}

            {mode === "present" && (
              <div className="flex flex-wrap gap-2">
                {discoveredClues.length === 0 && (
                  <p className="font-[var(--font-typewriter)] text-[11px] text-[var(--color-ink-faded)]">
                    You haven't discovered any evidence yet — find some on the board first.
                  </p>
                )}
                {discoveredClues.map((c) => {
                  const hasReaction = evidenceReactions.some((r) => r.clueId === c.id);
                  return (
                    <button
                      key={c.id}
                      disabled={typing}
                      onClick={() => presentEvidence(c.id)}
                      className={`rounded-sm border px-3 py-1.5 text-left font-[var(--font-typewriter)] text-[11px] transition-colors disabled:opacity-40 ${
                        presentedClueIds.includes(c.id)
                          ? "border-black/10 text-[var(--color-ink-faded)]"
                          : hasReaction
                          ? "border-[var(--color-accent-red)]/50 text-[var(--color-ink)] hover:border-[var(--color-accent-red)]"
                          : "border-black/20 text-[var(--color-ink)] hover:border-black/40"
                      }`}
                      title={c.title}
                    >
                      {c.title}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="mt-2 font-[var(--font-typewriter)] text-[10px] text-[var(--color-ink-faded)]">
              {askedCount} question{askedCount === 1 ? "" : "s"} asked · {presentedClueIds.length} pieces of
              evidence presented
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ModeTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm px-2.5 py-1 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide transition-colors ${
        active
          ? "bg-[var(--color-accent-red)] text-[var(--color-paper)]"
          : "border border-black/15 text-[var(--color-ink-faded)] hover:border-black/30"
      }`}
    >
      {label}
    </button>
  );
}
