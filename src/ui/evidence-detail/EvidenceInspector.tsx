import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Clue, Suspect } from "@/types";
import { AudioCallActivity } from "@/ui/evidence-detail/AudioCallActivity";
import { DocumentCompareActivity } from "@/ui/evidence-detail/DocumentCompareActivity";
import { PhotoExamineActivity } from "@/ui/evidence-detail/PhotoExamineActivity";

const CATEGORY_ICON: Record<Clue["category"], string> = {
  physical: "/assets/icons/physical.png",
  digital: "/assets/icons/digital.png",
  location: "/assets/icons/location.png",
  human: "/assets/icons/human.png",
  timeline: "/assets/icons/timeline.png",
};

const IMPORTANCE_VAR: Record<Clue["importance"], string> = {
  critical: "--color-importance-critical",
  high: "--color-importance-high",
  medium: "--color-importance-medium",
  low: "--color-importance-low",
};

interface EvidenceInspectorProps {
  clue: Clue | null;
  suspects: Suspect[];
  allClues: Clue[];
  onClose: () => void;
  discoverClue: (clueId: string) => void;
}

// Day 2: full-text detail view for a clue, opened via EvidenceCard's
// onDoubleClick.
//
// v2 (per NOTE-for-Dev-A): a clue is either `read` (paragraph, same as
// before) or one of three activities the player has to actually DO —
// listen to a call, compare two documents, examine a photo — instead of
// reading a conclusion. This component's only job for those three is to
// pick the right one and hand it the clue; the actual interaction lives in
// its own file per activity kind.
//
// Also per the note: `relationships` is gone from here (spoils the corkboard
// deduction) and there's no more "Dig Deeper" button — new leads now surface
// as a quiet pulsing card on the board itself (see useBoardLeads /
// EvidenceBoard), not a CTA inside this modal.
export function EvidenceInspector({ clue, suspects, allClues, onClose, discoverClue }: EvidenceInspectorProps) {
  useEffect(() => {
    if (!clue) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clue, onClose]);

  const relatedNames = clue
    ? clue.relatedSuspects
        .map((id) => suspects.find((s) => s.id === id)?.name)
        .filter((n): n is string => Boolean(n))
    : [];

  const activityKind = clue?.activity?.kind ?? "read";

  return (
    <AnimatePresence>
      {clue && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="fx-paper relative max-h-[85%] w-full max-w-lg overflow-y-auto rounded-[var(--radius-panel)] p-5"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-sm text-[var(--color-ink-faded)] hover:text-[var(--color-ink)]"
            >
              ✕
            </button>

            <div className="mb-2 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-sm bg-black/5 px-1.5 py-0.5">
                <img src={CATEGORY_ICON[clue.category]} alt="" className="h-4 w-4 object-contain" />
                <span className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-ink-faded)]">
                  {clue.category}
                </span>
              </span>
              <span
                className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-white"
                style={{ backgroundColor: `var(${IMPORTANCE_VAR[clue.importance]})` }}
              >
                {clue.importance}
              </span>
              {clue.timestamp && (
                <span className="ml-auto font-[var(--font-typewriter)] text-[11px] text-[var(--color-accent-red)]">
                  {clue.timestamp}
                </span>
              )}
            </div>

            <h3 className="font-[var(--font-display)] text-xl font-semibold leading-snug text-[var(--color-ink)]">
              {clue.title}
            </h3>

            <p className="mt-2 font-[var(--font-typewriter)] text-[12px] italic leading-relaxed text-[var(--color-ink-faded)]">
              {clue.description}
            </p>

            <div className="mt-3">
              {activityKind === "audio_call" && clue.activity?.kind === "audio_call" && (
                <AudioCallActivity activity={clue.activity} discoverClue={discoverClue} />
              )}
              {activityKind === "document_compare" && clue.activity?.kind === "document_compare" && (
                <DocumentCompareActivity
                  clue={clue}
                  activity={clue.activity}
                  compareClue={allClues.find((c) => c.id === clue.activity!.compareAgainstClueId)}
                  discoverClue={discoverClue}
                />
              )}
              {activityKind === "photo_examine" && clue.activity?.kind === "photo_examine" && (
                <PhotoExamineActivity activity={clue.activity} discoverClue={discoverClue} />
              )}
            </div>

            {relatedNames.length > 0 && (
              <div className="mt-4 border-t border-black/10 pt-3">
                <p className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-ink-faded)]">
                  Related persons of interest
                </p>
                <p className="mt-1 font-[var(--font-typewriter)] text-[12px] text-[var(--color-ink)]">
                  {relatedNames.join(", ")}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
