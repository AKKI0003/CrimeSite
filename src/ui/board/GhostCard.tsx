import { useState } from "react";
import { motion } from "framer-motion";

interface GhostCardProps {
  x: number;
  y: number;
  state: "ready" | "near";
  missing: string[];
}

// Per the latest note from Akki (see NOTE-for-Dev-B.md #1): a hold-to-reveal
// gesture was still "getting the evidence for free" — it wasn't a real
// investigative act, just a different-shaped click. This card no longer
// reveals anything itself. It's purely a "something's here" presence
// indicator: the player still has to go actually work a piece of evidence
// they already hold (finish listening to a call, flag a document
// discrepancy, examine every hotspot on a photo) for the real clue to
// surface. See the note for what still needs to land on the engine side
// before "ready" cards ever turn into real ones — right now this card
// glowing "ready" means the data considers it unlockable, but nothing
// wires that to an actual player action yet.
export function GhostCard({ x, y, state, missing }: GhostCardProps) {
  const [hovered, setHovered] = useState(false);
  const ready = state === "ready";

  return (
    <motion.div
      className="absolute w-40 select-none rounded-[var(--radius-card)] border border-dashed p-2.5 sm:w-44"
      style={{
        left: x,
        top: y,
        borderColor: ready ? "var(--color-accent-amber)" : "rgba(255,255,255,0.18)",
        backgroundColor: ready ? "rgba(201,138,58,0.06)" : "rgba(255,255,255,0.02)",
        cursor: "default",
      }}
      animate={{ opacity: ready ? [0.4, 0.65, 0.4] : 0.35 }}
      transition={ready ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex h-16 items-center justify-center">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: ready ? "var(--color-accent-amber)" : "rgba(255,255,255,0.22)" }}
        />
      </div>

      {hovered && (
        <p className="absolute -top-2 left-1/2 w-max max-w-[190px] -translate-x-1/2 -translate-y-full rounded-sm bg-black/85 px-2 py-1 text-center font-[var(--font-typewriter)] text-[9.5px] text-white/80">
          {ready
            ? "Something's here — keep working what you've already got."
            : missing.length > 0
            ? `Needs: ${missing.join(", ")}`
            : "Not reachable yet."}
        </p>
      )}
    </motion.div>
  );
}
