import { motion } from "framer-motion";
import type { Clue } from "@/types";

const CATEGORY_VAR: Record<Clue["category"], string> = {
  physical: "--color-cat-physical",
  digital: "--color-cat-digital",
  location: "--color-cat-location",
  human: "--color-cat-human",
  timeline: "--color-cat-timeline",
};

const IMPORTANCE_VAR: Record<Clue["importance"], string> = {
  critical: "--color-importance-critical",
  high: "--color-importance-high",
  medium: "--color-importance-medium",
  low: "--color-importance-low",
};

interface EvidenceCardProps {
  clue: Clue;
  x: number;
  y: number;
  onDragEnd: (id: string, x: number, y: number) => void;
  onOpen: (id: string) => void;
  flagged?: boolean;
}

// Day 1: visual + drag only, position tracked locally by the board (see EvidenceBoard).
// Day 2: onOpen will wire into EvidenceInspector; `flagged` will drive contradiction glow.
export function EvidenceCard({ clue, x, y, onDragEnd, onOpen, flagged }: EvidenceCardProps) {
  const categoryColor = `var(${CATEGORY_VAR[clue.category]})`;
  const importanceColor = `var(${IMPORTANCE_VAR[clue.importance]})`;

  return (
    <motion.div
      // Remounting on committed position (via the board's key) keeps the drag
      // transform in sync with controlled x/y instead of fighting it.
      drag
      dragMomentum={false}
      dragElastic={0}
      whileDrag={{ scale: 1.04, zIndex: 30, cursor: "grabbing" }}
      onDragEnd={(_, info) => onDragEnd(clue.id, x + info.offset.x, y + info.offset.y)}
      onDoubleClick={() => onOpen(clue.id)}
      className={`fx-paper absolute w-44 select-none rounded-[var(--radius-card)] p-2.5 ${
        flagged ? "ring-2 ring-[var(--color-accent-red-bright)]" : ""
      }`}
      style={{ touchAction: "none", left: x, top: y }}
    >
      <span className="fx-pin" />

      <div className="mb-1 flex items-center justify-between">
        <span
          className="rounded-sm px-1 py-0.5 font-[var(--font-typewriter)] text-[9px] uppercase tracking-wide text-white/90"
          style={{ backgroundColor: categoryColor }}
        >
          {clue.category}
        </span>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: importanceColor }}
          title={`Importance: ${clue.importance}`}
        />
      </div>

      <p className="font-[var(--font-display)] text-[13px] leading-tight text-[var(--color-ink)]">
        {clue.title}
      </p>
      <p className="mt-1 font-[var(--font-typewriter)] text-[10px] leading-snug text-[var(--color-ink-faded)]">
        {clue.summary}
      </p>

      {clue.timestamp && (
        <p className="mt-1.5 font-[var(--font-typewriter)] text-[9px] text-[var(--color-accent-red)]">
          {clue.timestamp}
        </p>
      )}
    </motion.div>
  );
}
