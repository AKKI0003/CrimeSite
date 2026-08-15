import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AudioCallActivity as AudioCallActivityType } from "@/types";
import { playTypeTick } from "@/engine/audio";

interface Props {
  activity: AudioCallActivityType;
  discoverClue: (clueId: string) => void;
}

// No real audio files yet (activity.audioSrc is optional/unset for every
// clue currently using this). Until real assets exist, "listening" is
// simulated: lines reveal one at a time on a timer while "playing", same as
// scrubbing through a recording, rather than being printed as one paragraph.
// If activity.audioSrc is ever set, swap the interval below for real
// <audio> timeupdate events keyed to line timestamps — the reveal mechanic
// (revealedCount) doesn't need to change, just what drives it.
export function AudioCallActivity({ activity, discoverClue }: Props) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);
  const revealedFired = useRef(false);

  const total = activity.transcriptLines.length;
  const done = revealedCount >= total;

  // Fires once, the moment the full call has actually been listened
  // through — not on mount, not on scrub-preview. discoverClue() no-ops on
  // its own if this clue's other prerequisites (AND-gates) aren't met yet,
  // per NOTE-for-Dev-A, so no readiness check needed here.
  useEffect(() => {
    if (!done || revealedFired.current) return;
    revealedFired.current = true;
    (activity.revealsClueIds ?? []).forEach((id) => discoverClue(id));
  }, [done, activity.revealsClueIds, discoverClue]);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setRevealedCount((n) => {
        const next = Math.min(total, n + 1);
        try {
          playTypeTick();
        } catch {
          /* audio unavailable, ignore */
        }
        if (next >= total) setPlaying(false);
        return next;
      });
    }, 1100);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [playing, total]);

  function togglePlay() {
    if (done) return;
    setPlaying((p) => !p);
  }

  function scrubTo(index: number) {
    // Only allow jumping forward to a line already revealed, or advancing
    // exactly one past the current point — no skipping ahead to spoil lines
    // that haven't "played" yet.
    if (index < revealedCount) return;
    if (index === revealedCount) {
      setRevealedCount(index + 1);
      try {
        playTypeTick();
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 rounded-sm border border-black/15 bg-black/5 px-3 py-2.5">
        <button
          onClick={togglePlay}
          disabled={done}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-red)] text-[var(--color-paper)] disabled:opacity-40"
        >
          {playing ? "❚❚" : "▶"}
        </button>

        {/* Fake waveform — one bar per transcript line, doubles as a scrub target */}
        <div className="flex h-8 flex-1 items-end gap-[3px]">
          {activity.transcriptLines.map((_, i) => (
            <button
              key={i}
              onClick={() => scrubTo(i)}
              className="flex-1 rounded-[1px] transition-colors"
              style={{
                height: `${28 + waveformHeight(i)}%`,
                backgroundColor: i < revealedCount ? "var(--color-accent-red)" : "rgba(0,0,0,0.18)",
                cursor: i <= revealedCount ? "pointer" : "default",
              }}
              aria-label={`Line ${i + 1}`}
            />
          ))}
        </div>

        <span className="shrink-0 font-[var(--font-typewriter)] text-[10px] text-[var(--color-ink-faded)]">
          {revealedCount}/{total}
        </span>
      </div>

      <p className="mt-1.5 font-[var(--font-typewriter)] text-[10px] italic text-[var(--color-ink-faded)]">
        {activity.audioLabel}
      </p>

      <div className="mt-3 space-y-2">
        {activity.transcriptLines.slice(0, revealedCount).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[var(--font-typewriter)] text-[13px] leading-relaxed text-[var(--color-ink)]"
          >
            {line}
          </motion.p>
        ))}
        {revealedCount === 0 && (
          <p className="font-[var(--font-typewriter)] text-[12px] italic text-[var(--color-ink-faded)]">
            Press play to start the recording.
          </p>
        )}
      </div>
    </div>
  );
}

// Deterministic pseudo-random bar heights so the waveform looks organic
// without changing on every re-render.
function waveformHeight(seed: number): number {
  const x = Math.sin(seed * 999.7) * 10000;
  return Math.floor((x - Math.floor(x)) * 60);
}
