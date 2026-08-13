import { useTransform, motion, type MotionValue } from "framer-motion";
import type { RelationshipType } from "@/types";

// Card size constants (must match EvidenceCard's w-40/sm:w-44) so lines can
// anchor to a card's center rather than its top-left corner.
const CARD_W = 176; // sm:w-44 = 11rem = 176px; close enough at w-40 too for anchoring
const CARD_H = 92; // approx rendered height, good enough for a visual thread

const TYPE_COLOR: Partial<Record<RelationshipType, string>> = {
  contradicts: "var(--color-accent-red-bright)",
  supports: "var(--color-cat-location)",
  caused_by: "var(--color-accent-amber)",
  occurred_before: "var(--color-cat-digital)",
  occurred_after: "var(--color-cat-digital)",
};
const DEFAULT_COLOR = "var(--color-accent-thread)";

function buildPath(fx: number, fy: number, tx: number, ty: number) {
  const x1 = fx + CARD_W / 2;
  const y1 = fy + CARD_H / 2;
  const x2 = tx + CARD_W / 2;
  const y2 = ty + CARD_H / 2;
  // Slight sag in the middle so it reads as a pinned thread, not a ruler line.
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + Math.min(24, Math.hypot(x2 - x1, y2 - y1) * 0.06);
  return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
}

interface ConnectionLineProps {
  from: { x: MotionValue<number>; y: MotionValue<number> };
  to: { x: MotionValue<number>; y: MotionValue<number> };
  type: RelationshipType;
  /** data-defined relationship shown automatically vs. one the player drew */
  playerMade: boolean;
}

// Path is derived straight from the two cards' own position motion values via
// useTransform, so it redraws every frame a card is dragged — including
// mid-drag, not just after drop — without ever triggering a React re-render
// (no setState anywhere in this component or its parent on drag).
export function ConnectionLine({ from, to, type, playerMade }: ConnectionLineProps) {
  const d = useTransform([from.x, from.y, to.x, to.y], ([fx, fy, tx, ty]) =>
    buildPath(fx as number, fy as number, tx as number, ty as number)
  );

  const color = TYPE_COLOR[type] ?? DEFAULT_COLOR;
  const width = playerMade ? 3 : 2;

  return (
    <>
      {/* Dark halo underneath so the thread reads clearly against the busy
          corkboard texture, regardless of what's directly behind it. */}
      <motion.path d={d} fill="none" stroke="rgba(0,0,0,0.65)" strokeWidth={width + 2.5} strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={type === "contradicts" ? "7 5" : playerMade ? undefined : "3 5"}
        opacity={playerMade ? 1 : 0.85}
        strokeLinecap="round"
      />
    </>
  );
}
