import { useCallback, useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import type { MotionValue } from "framer-motion";
import { useCaseState } from "@/hooks/useCaseState";
import { useContradictions } from "@/hooks/useContradictions";
import { EvidenceCard } from "@/ui/board/EvidenceCard";
import { BoardControls } from "@/ui/board/BoardControls";
import { ConnectionLine } from "@/ui/board/ConnectionLine";
import { EvidenceInspector } from "@/ui/evidence-detail/EvidenceInspector";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.75;

// Day 1/perf pass: pan/zoom canvas + draggable cards.
// Day 2: relationship lines (auto, from data) + click-to-connect / click-to-
// disconnect (player-made, persisted via useCaseState) + the evidence
// inspector modal.
//
// Perf note: panning used to setState on every pointermove, which re-rendered
// (and repainted) every card + the grain/CRT overlays 60x/sec — that was the
// main source of lag, not the drag itself. Pan now lives in a ref and is
// applied directly to the DOM transform, so panning causes zero React
// re-renders. Zoom stays in state because BoardControls needs to *display* it,
// but is applied the same way (via the transform effect below) rather than
// re-rendering the card list.
export function EvidenceBoard() {
  const { discoveredClues, allSuspects, boardPositions, connections, moveCard, addConnection, removeConnection } =
    useCaseState();
  const { activeContradictions } = useContradictions();

  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");
  const [openClueId, setOpenClueId] = useState<string | null>(null);
  const [pendingConnectId, setPendingConnectId] = useState<string | null>(null);
  // Off by default: these are the case file's own answer-key relationships,
  // not something the player has discovered. See BoardControls for why.
  const [showAutoLines, setShowAutoLines] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const panRef = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const applyTransform = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    el.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px) scale(${zoom})`;
  }, [zoom]);

  useEffect(applyTransform, [applyTransform]);

  // Registry of each visible card's live position motion values, keyed by
  // clue id. Cards register themselves on mount (see EvidenceCard's
  // onMotionReady). Connection lines read straight from this map and
  // subscribe to the motion values directly, so they follow a card in real
  // time while it's being dragged — no state, no re-renders.
  const motionMapRef = useRef<Map<string, { x: MotionValue<number>; y: MotionValue<number> }>>(new Map());
  const [, forceRerender] = useState(0);
  const handleMotionReady = useCallback((id: string, mx: MotionValue<number>, my: MotionValue<number>) => {
    const isNew = !motionMapRef.current.has(id);
    motionMapRef.current.set(id, { x: mx, y: my });
    // Only the very first time a card registers do we need a re-render, so
    // the line layer (rendered below, in the same pass) has something to
    // read. Once every card currently on screen has registered, further
    // position changes flow through the motion values themselves.
    if (isNew) forceRerender((n) => n + 1);
  }, []);

  const flaggedClueIds = useMemo(() => {
    const ids = new Set<string>();
    activeContradictions.forEach((c) => {
      ids.add(c.clueIdA);
      ids.add(c.clueIdB);
    });
    return ids;
  }, [activeContradictions]);

  const visibleClues = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return discoveredClues;
    return discoveredClues.filter(
      (c) => c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)
    );
  }, [discoveredClues, search]);

  // Single source of truth for "where is this card right now" — used to
  // place the EvidenceCard components. Connection lines use the motion
  // registry above instead (so they can track drags live); this map is only
  // the fallback/initial position fed into each card.
  const posMap = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    visibleClues.forEach((clue, i) => {
      const saved = boardPositions[clue.id];
      if (saved) {
        map[clue.id] = saved;
      } else {
        const col = i % 4;
        const row = Math.floor(i / 4);
        map[clue.id] = { x: 60 + col * 200, y: 60 + row * 180 };
      }
    });
    return map;
  }, [visibleClues, boardPositions]);

  const visibleIds = useMemo(() => new Set(visibleClues.map((c) => c.id)), [visibleClues]);

  // Auto lines: data-defined relationships between two currently-visible clues.
  // Deduped so an A->B / B->A pair drawn from both sides only renders once.
  const autoLines = useMemo(() => {
    const seen = new Set<string>();
    const lines: { from: string; to: string; type: string }[] = [];
    visibleClues.forEach((clue) => {
      clue.relationships.forEach((rel) => {
        if (!visibleIds.has(rel.target)) return;
        const key = [clue.id, rel.target].sort().join("|") + rel.type;
        if (seen.has(key)) return;
        seen.add(key);
        lines.push({ from: clue.id, to: rel.target, type: rel.type });
      });
    });
    return lines;
  }, [visibleClues, visibleIds]);

  function handleWheel(e: WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom((z) => clamp(z - e.deltaY * 0.001, MIN_ZOOM, MAX_ZOOM));
  }

  function handleBackgroundPointerDown(e: React.PointerEvent) {
    if (e.target !== e.currentTarget) return; // only pan when clicking empty board
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, panX: panRef.current.x, panY: panRef.current.y };
    setPendingConnectId(null); // clicking empty board cancels an in-progress connection
  }

  function handleBackgroundPointerMove(e: React.PointerEvent) {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    panRef.current = { x: panStart.current.panX + dx, y: panStart.current.panY + dy };
    applyTransform(); // direct DOM write, no re-render
  }

  function stopPanning() {
    isPanning.current = false;
  }

  function resetView() {
    panRef.current = { x: 0, y: 0 };
    setZoom(1);
    applyTransform();
  }

  // Stable callbacks so EvidenceCard's memo comparison actually skips re-renders.
  const handleCardDragEnd = useCallback(
    (id: string, x: number, y: number) => moveCard(id, { x, y }),
    [moveCard]
  );
  const handleCardOpen = useCallback((id: string) => setOpenClueId(id), []);

  // Tap a card to start a connection, tap a second (different) card to
  // link/unlink them: if a player-made connection already exists between
  // that pair, this tap removes it; otherwise it creates one. Tapping the
  // same card again, or the empty board, cancels without changing anything.
  const handleCardSelect = useCallback(
    (id: string) => {
      setPendingConnectId((cur) => {
        if (!cur) return id;
        if (cur === id) return null;
        const existing = connections.find(
          (c) => (c.source === cur && c.target === id) || (c.source === id && c.target === cur)
        );
        if (existing) {
          removeConnection(existing.id);
        } else {
          addConnection(cur, id, "related_to");
        }
        return null;
      });
    },
    [connections, addConnection, removeConnection]
  );

  return (
    <div className="fx-corkboard relative h-full w-full overflow-hidden">
      <BoardControls
        zoom={zoom}
        onZoomIn={() => setZoom((z) => clamp(z + 0.1, MIN_ZOOM, MAX_ZOOM))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.1, MIN_ZOOM, MAX_ZOOM))}
        onReset={resetView}
        search={search}
        onSearchChange={setSearch}
        showAutoLines={showAutoLines}
        onToggleAutoLines={() => setShowAutoLines((v) => !v)}
      />

      {pendingConnectId && (
        <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2 rounded-[var(--radius-panel)] border border-[var(--color-accent-amber)] bg-[var(--color-bg-raised)]/90 px-3 py-1 font-[var(--font-typewriter)] text-[11px] text-[var(--color-accent-amber)] sm:top-3">
          Select a second card to connect/disconnect — or tap the board to cancel
        </div>
      )}

      <div
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        onWheel={handleWheel}
        onPointerDown={handleBackgroundPointerDown}
        onPointerMove={handleBackgroundPointerMove}
        onPointerUp={stopPanning}
        onPointerLeave={stopPanning}
      >
        <div ref={contentRef} className="relative h-full w-full origin-top-left will-change-transform">
          <svg className="pointer-events-none absolute left-0 top-0 h-[4000px] w-[4000px] overflow-visible">
            {showAutoLines &&
              autoLines.map((l, i) => {
                const from = motionMapRef.current.get(l.from);
                const to = motionMapRef.current.get(l.to);
                if (!from || !to) return null;
                return <ConnectionLine key={`auto-${i}`} from={from} to={to} type={l.type as never} playerMade={false} />;
              })}
            {connections
              .filter((c) => visibleIds.has(c.source) && visibleIds.has(c.target))
              .map((c) => {
                const from = motionMapRef.current.get(c.source);
                const to = motionMapRef.current.get(c.target);
                if (!from || !to) return null;
                return <ConnectionLine key={c.id} from={from} to={to} type={c.type} playerMade />;
              })}
          </svg>

          {visibleClues.map((clue) => {
            const pos = posMap[clue.id];
            return (
              <EvidenceCard
                key={clue.id}
                clue={clue}
                x={pos.x}
                y={pos.y}
                flagged={flaggedClueIds.has(clue.id)}
                selected={pendingConnectId === clue.id}
                onDragEnd={handleCardDragEnd}
                onOpen={handleCardOpen}
                onSelect={handleCardSelect}
                onMotionReady={handleMotionReady}
              />
            );
          })}
        </div>
      </div>

      {visibleClues.length === 0 && (
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-[var(--font-typewriter)] text-sm text-[var(--color-text-muted)]">
          No matching evidence on the board.
        </p>
      )}

      <EvidenceInspector
        clue={discoveredClues.find((c) => c.id === openClueId) ?? null}
        suspects={allSuspects}
        onClose={() => setOpenClueId(null)}
      />
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
