import { useState } from "react";
import { toggleAmbient } from "@/engine/audio";

/** Small header toggle for the procedural ambient room-tone loop. Off by
 * default — browsers block autoplay anyway, so the first click both starts
 * the AudioContext and turns the loop on in the same user gesture. */
export function AmbientAudio() {
  const [on, setOn] = useState(false);

  return (
    <button
      onClick={() => setOn(toggleAmbient())}
      aria-pressed={on}
      title={on ? "Mute ambient sound" : "Play ambient sound"}
      className={`shrink-0 rounded-sm border px-2 py-1.5 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide transition-colors sm:px-2.5 ${
        on
          ? "border-[var(--color-accent-red-bright)] text-[var(--color-accent-red-bright)]"
          : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
      }`}
    >
      {on ? "🔊" : "🔈"}
      <span className="hidden sm:inline"> Ambience</span>
    </button>
  );
}
