import { useMemo, useRef, useState, type WheelEvent } from "react";
import { useCaseState } from "@/hooks/useCaseState";
import { useContradictions } from "@/hooks/useContradictions";
import { EvidenceCard } from "@/ui/board/EvidenceCard";
import { BoardControls } from "@/ui/board/BoardControls";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.75;

// Day 1: pan/zoom canvas + draggable cards, positions kept in local component
// state (not yet persisted). ConnectionLine (SVG threads between cards) and
// EvidenceInspector (detail modal on open) land Day 2.
export function EvidenceBoard() {
  const { discoveredClues, boardPositions, moveCard } = useCaseState();
  const { activeContradictions } = useContradictions();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState("");
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

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

  function positionFor(id: string, fallbackIndex: number) {
    const saved = boardPositions[id];
    if (saved) return saved;
    // Fallback grid so cards never stack at (0,0) before the store has a position.
    const col = fallbackIndex % 4;
    const row = Math.floor(fallbackIndex / 4);
    return { x: 60 + col * 200, y: 60 + row * 180 };
  }

  function handleWheel(e: WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom((z) => clamp(z - e.deltaY * 0.001, MIN_ZOOM, MAX_ZOOM));
  }

  function handleBackgroundPointerDown(e: React.PointerEvent) {
    if (e.target !== e.currentTarget) return; // only pan when clicking empty board
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }

  function handleBackgroundPointerMove(e: React.PointerEvent) {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({ x: panStart.current.panX + dx, y: panStart.current.panY + dy });
  }

  function stopPanning() {
    isPanning.current = false;
  }

  return (
    <div className="fx-corkboard relative h-full w-full overflow-hidden">
      <BoardControls
        zoom={zoom}
        onZoomIn={() => setZoom((z) => clamp(z + 0.1, MIN_ZOOM, MAX_ZOOM))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.1, MIN_ZOOM, MAX_ZOOM))}
        onReset={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        search={search}
        onSearchChange={setSearch}
      />

      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onPointerDown={handleBackgroundPointerDown}
        onPointerMove={handleBackgroundPointerMove}
        onPointerUp={stopPanning}
        onPointerLeave={stopPanning}
      >
        <div
          className="relative h-full w-full origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {visibleClues.map((clue, i) => {
            const pos = positionFor(clue.id, i);
            return (
              <EvidenceCard
                key={`${clue.id}-${pos.x}-${pos.y}`}
                clue={clue}
                x={pos.x}
                y={pos.y}
                flagged={flaggedClueIds.has(clue.id)}
                onDragEnd={(id, x, y) => moveCard(id, { x, y })}
                onOpen={() => {
                  // Wired up Day 2: opens EvidenceInspector with this clue's full text.
                }}
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
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
