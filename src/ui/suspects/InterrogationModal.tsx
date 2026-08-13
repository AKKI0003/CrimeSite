import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Suspect } from "@/types";
import { SuspectAvatar } from "./SuspectAvatar";
import { TypewriterText } from "@/ui/shared/TypewriterText";
import { useCaseState } from "@/hooks/useCaseState";

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
};

/**
 * Full-screen "interrogation" — replaces the old inline-expand suspect row.
 * Player picks a topic, the suspect's response types out live. Topics gated
 * behind `unlocksAfterClueId` only appear once that clue has been discovered,
 * so the interrogation gets richer as the player's actual investigation
 * progresses instead of dumping every line up front.
 */
export function InterrogationModal({ suspect, onClose }: InterrogationModalProps) {
  const { isDiscovered } = useCaseState();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [askedTopicIds, setAskedTopicIds] = useState<string[]>([]);

  const topics = suspect.interrogationTopics ?? [];

  const availableTopics = useMemo(
    () => topics.filter((t) => !t.unlocksAfterClueId || isDiscovered(t.unlocksAfterClueId)),
    [topics, isDiscovered]
  );

  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? null;

  function askAbout(topicId: string) {
    setActiveTopicId(topicId);
    setTyping(true);
    setAskedTopicIds((cur) => (cur.includes(topicId) ? cur : [...cur, topicId]));
  }

  // Fallback for suspects with no authored topics yet — use their single statement.
  const fallbackStatement = suspect.statements[0]?.text;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
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
            <SuspectAvatar id={suspect.id} size={80} agitated={activeTopic?.tone === "hostile" || activeTopic?.tone === "nervous"} />
          </div>
          <div className="min-w-0">
            <h2 className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
              {suspect.name}
            </h2>
            <p className="font-[var(--font-typewriter)] text-[11px] text-[var(--color-ink-faded)]">
              {suspect.occupation} · {suspect.relationshipToVictim}
            </p>
          </div>
        </div>

        <div className="min-h-[110px] flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <AnimatePresence mode="wait">
            {activeTopic ? (
              <motion.div
                key={activeTopic.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
              >
                <p
                  className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide"
                  style={{ color: TONE_COLOR[activeTopic.tone ?? "calm"] }}
                >
                  {activeTopic.tone ?? "calm"}
                </p>
                <p className="font-[var(--font-typewriter)] text-[13.5px] leading-relaxed text-[var(--color-ink)]">
                  “
                  <TypewriterText
                    text={activeTopic.response}
                    sound
                    onDone={() => setTyping(false)}
                  />
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
                  : "Choose a topic below to begin the interrogation."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-black/10 px-4 py-3 sm:px-6">
          <p className="mb-2 font-[var(--font-typewriter)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-faded)]">
            Ask about
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTopics.length === 0 && (
              <p className="font-[var(--font-typewriter)] text-[11px] text-[var(--color-ink-faded)]">
                No leads yet — discover evidence on the board to unlock questions.
              </p>
            )}
            {availableTopics.map((t) => (
              <button
                key={t.id}
                disabled={typing}
                onClick={() => askAbout(t.id)}
                className={`rounded-sm border px-3 py-1.5 font-[var(--font-typewriter)] text-[11px] transition-colors disabled:opacity-40 ${
                  activeTopicId === t.id
                    ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red)]/10 text-[var(--color-ink)]"
                    : askedTopicIds.includes(t.id)
                    ? "border-black/10 text-[var(--color-ink-faded)]"
                    : "border-black/20 text-[var(--color-ink)] hover:border-[var(--color-accent-red)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {topics.length > 0 && (
            <p className="mt-2 font-[var(--font-typewriter)] text-[10px] text-[var(--color-ink-faded)]">
              {askedTopicIds.length}/{topics.length} topics covered
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
