import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PhotoExamineActivity as PhotoExamineActivityType } from "@/types";

interface Props {
  activity: PhotoExamineActivityType;
  discoverClue: (clueId: string) => void;
}

// No real photo assets yet for these clues (activity.imageSrc unset) — the
// frame itself is a plain dark placeholder (.fx-crt scanlines stand in for
// "this is footage/a photo", not just a text block) so the hotspots have
// something to sit on. Swap in activity.imageSrc as a background-image
// later without touching the hotspot logic below.
export function PhotoExamineActivity({ activity, discoverClue }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [examined, setExamined] = useState<Set<number>>(new Set());
  const revealedFired = useRef(false);

  function openHotspot(i: number) {
    setOpenIndex(i);
    setExamined((prev) => {
      const next = new Set(prev).add(i);
      // Fires the moment the LAST unexamined hotspot gets opened — not on
      // any single click, per NOTE-for-Dev-A ("once every hotspot ... has
      // been opened at least once").
      if (next.size === activity.hotspots.length && !revealedFired.current) {
        revealedFired.current = true;
        (activity.revealsClueIds ?? []).forEach((id) => discoverClue(id));
      }
      return next;
    });
  }

  return (
    <div>
      <div
        className="fx-crt relative w-full overflow-hidden rounded-sm border border-black/30"
        style={{
          aspectRatio: "4 / 3",
          background: activity.imageSrc
            ? `url(${activity.imageSrc}) center/cover`
            : "radial-gradient(ellipse at center, #2a2a26 0%, #0e0e0c 100%)",
        }}
      >
        {!activity.imageSrc && (
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-[var(--font-typewriter)] text-[10px] uppercase tracking-[0.2em] text-white/25">
            No source frame on file
          </p>
        )}

        {activity.hotspots.map((h, i) => (
          <button
            key={i}
            onClick={() => openHotspot(i)}
            className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            aria-label={h.label}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full border-2 ${
                examined.has(i) ? "border-white/70 bg-white/20" : "animate-pulse border-[var(--color-accent-amber)] bg-[var(--color-accent-amber)]/40"
              }`}
            />
          </button>
        ))}
      </div>

      <p className="mt-1.5 font-[var(--font-typewriter)] text-[10px] text-[var(--color-ink-faded)]">
        {examined.size}/{activity.hotspots.length} points examined — click the pulsing markers on the frame
      </p>

      <AnimatePresence mode="wait">
        {openIndex !== null && (
          <motion.div
            key={openIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-sm border border-black/15 bg-black/5 px-3 py-2.5"
          >
            <p className="font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-ink-faded)]">
              {activity.hotspots[openIndex].label}
            </p>
            <p className="mt-1 font-[var(--font-typewriter)] text-[12.5px] leading-relaxed text-[var(--color-ink)]">
              {activity.hotspots[openIndex].detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
