import { memo, useEffect, useRef } from "react";
import { motion, useMotionValue, type MotionValue } from "framer-motion";
import type { Clue } from "@/types";

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

interface EvidenceCardProps {
  clue: Clue;
  x: number;
  y: number;
  onDragEnd: (id: string, x: number, y: number) => void;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
  /** Lets the board read this card's live x/y motion values (for connection
   *  lines that follow the card while it's being dragged) without lifting
   *  position state up and re-rendering every card on every drag frame. */
  onMotionReady: (id: string, mx: MotionValue<number>, my: MotionValue<number>) => void;
  flagged?: boolean;
  selected?: boolean;
}

// Day 1: visual + drag. Day 2: onOpen -> EvidenceInspector, `flagged` drives the
// contradiction glow, onSelect drives the click-to-connect flow (see EvidenceBoard).
// Memoized: the board re-renders on every pan/zoom/search tick, and without this
// every one of the ~18 cards would re-render (and repaint the paper texture) on
// every one of those ticks. Cards only need to re-render when their own props change.
function EvidenceCardImpl({
  clue,
  x,
  y,
  onDragEnd,
  onOpen,
  onSelect,
  onMotionReady,
  flagged,
  selected,
}: EvidenceCardProps) {
  const importanceColor = `var(${IMPORTANCE_VAR[clue.importance]})`;

  // Motion values, not remount-on-move: dragging writes straight to these
  // (GPU transform, no React re-render), and we only sync them from props
  // when the *store* moves the card (e.g. a future "snap to grid" action).
  const mx = useMotionValue(x);
  const my = useMotionValue(y);
  useEffect(() => {
    mx.set(x);
    my.set(y);
  }, [x, y, mx, my]);

  // Hand these same motion values to the board once, so its connection-line
  // layer can subscribe directly to them (see ConnectionLine) and redraw as
  // the card moves — including live, mid-drag — with zero extra re-renders
  // of this component or its siblings.
  useEffect(() => {
    onMotionReady(clue.id, mx, my);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clue.id]);

  // A drag and a tap are two different gestures recognized off the same
  // pointer session. Without this guard, releasing the pointer after
  // dragging a card to a new spot also fired onTap, which meant every drag
  // was *also* being read as "select this card to connect it". didDrag
  // latches true as soon as framer recognizes the gesture as a drag, and
  // onTap checks/clears it before deciding whether to treat the release as
  // a real tap.
  const didDrag = useRef(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      whileHover={{ scale: 1.03, zIndex: 20, boxShadow: "0 10px 22px rgba(0,0,0,0.5)" }}
      whileDrag={{ scale: 1.05, zIndex: 30, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      onDragStart={() => {
        didDrag.current = true;
      }}
      onDragEnd={() => onDragEnd(clue.id, mx.get(), my.get())}
      onDoubleClick={() => onOpen(clue.id)}
      onTap={() => {
        if (didDrag.current) {
          didDrag.current = false;
          return;
        }
        onSelect(clue.id);
      }}
      className={`fx-paper absolute w-40 select-none rounded-[var(--radius-card)] p-2.5 sm:w-44 ${
        flagged ? "ring-2 ring-[var(--color-accent-red-bright)]" : ""
      } ${selected ? "ring-2 ring-[var(--color-accent-amber)]" : ""}`}
      style={{ touchAction: "none", x: mx, y: my }}
    >
      <span className="fx-pin" />

      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1 rounded-sm bg-black/5 px-1 py-0.5">
          <img
            src={CATEGORY_ICON[clue.category]}
            alt=""
            className="h-3.5 w-3.5 object-contain"
            draggable={false}
            loading="lazy"
          />
          <span className="font-[var(--font-typewriter)] text-[8px] uppercase tracking-wide text-[var(--color-ink-faded)]">
            {clue.category}
          </span>
        </span>
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: importanceColor }}
          title={`Importance: ${clue.importance}`}
        />
      </div>

      <p className="font-[var(--font-display)] text-[14px] font-semibold leading-tight text-[var(--color-ink)]">
        {clue.title}
      </p>
      <p className="mt-1 font-[var(--font-typewriter)] text-[10.5px] font-medium leading-snug text-[var(--color-ink-faded)]">
        {clue.summary}
      </p>

      {clue.timestamp && (
        <p className="mt-1.5 font-[var(--font-typewriter)] text-[9.5px] font-semibold tracking-wide text-[var(--color-accent-red)]">
          {clue.timestamp}
        </p>
      )}
    </motion.div>
  );
}

export const EvidenceCard = memo(EvidenceCardImpl, (prev, next) => {
  return (
    prev.clue === next.clue &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.flagged === next.flagged &&
    prev.selected === next.selected &&
    prev.onDragEnd === next.onDragEnd &&
    prev.onOpen === next.onOpen &&
    prev.onSelect === next.onSelect &&
    prev.onMotionReady === next.onMotionReady
  );
});
