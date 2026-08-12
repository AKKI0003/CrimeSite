import { create } from "zustand";
import { clues } from "@/data/clues";
import type { Relationship } from "@/types";
import { saveProgress, loadProgress, clearProgress, type PersistedProgress } from "./persistence";

export interface PlayerConnection {
  id: string;
  source: string;
  target: string;
  type: Relationship["type"];
  /** was this connection player-made, vs. a data-defined relationship shown automatically */
  playerMade: boolean;
}

interface CaseStateShape {
  discoveredClueIds: Set<string>;
  boardPositions: Record<string, { x: number; y: number }>;
  connections: PlayerConnection[];
  notes: Record<string, string>; // clueId -> player's free-text note

  discoverClue: (clueId: string) => void;
  isDiscovered: (clueId: string) => boolean;
  moveCard: (clueId: string, position: { x: number; y: number }) => void;
  addConnection: (source: string, target: string, type: Relationship["type"]) => void;
  removeConnection: (connectionId: string) => void;
  setNote: (clueId: string, text: string) => void;
  reset: () => void;
  /** explicit save-to-localStorage — call from a UI "save" action or on an interval/unload */
  persist: () => void;
}

const defaultDiscovered = new Set(
  clues.filter((c) => c.discoveredByDefault).map((c) => c.id)
);

const defaultPositions = Object.fromEntries(
  clues
    .filter((c) => c.boardPosition)
    .map((c) => [c.id, c.boardPosition as { x: number; y: number }])
);

// Hydrate from a previous session if a valid save exists. Falls back to defaults
// silently if there's nothing saved or the save is corrupted (see persistence.ts).
const saved = loadProgress();

const initialDiscovered = saved
  ? new Set([...defaultDiscovered, ...saved.discoveredClueIds])
  : new Set(defaultDiscovered);

const initialPositions = saved
  ? { ...defaultPositions, ...saved.boardPositions }
  : { ...defaultPositions };

const initialConnections: PlayerConnection[] = saved
  ? saved.connections.map((c) => ({
      id: c.id,
      source: c.source,
      target: c.target,
      type: c.type as Relationship["type"],
      playerMade: c.playerMade,
    }))
  : [];

const initialNotes = saved ? { ...saved.notes } : {};

export const useCaseStateStore = create<CaseStateShape>((set, get) => ({
  discoveredClueIds: initialDiscovered,
  boardPositions: initialPositions,
  connections: initialConnections,
  notes: initialNotes,

  discoverClue: (clueId) =>
    set((state) => {
      const next = new Set(state.discoveredClueIds);
      next.add(clueId);
      return { discoveredClueIds: next };
    }),

  isDiscovered: (clueId) => get().discoveredClueIds.has(clueId),

  moveCard: (clueId, position) =>
    set((state) => ({
      boardPositions: { ...state.boardPositions, [clueId]: position },
    })),

  addConnection: (source, target, type) =>
    set((state) => ({
      connections: [
        ...state.connections,
        { id: `${source}__${target}__${type}__${Date.now()}`, source, target, type, playerMade: true },
      ],
    })),

  removeConnection: (connectionId) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== connectionId),
    })),

  setNote: (clueId, text) =>
    set((state) => ({ notes: { ...state.notes, [clueId]: text } })),

  reset: () => {
    clearProgress();
    set({
      discoveredClueIds: new Set(defaultDiscovered),
      boardPositions: { ...defaultPositions },
      connections: [],
      notes: {},
    });
  },

  persist: () => {
    const state = get();
    const data: PersistedProgress = {
      discoveredClueIds: [...state.discoveredClueIds],
      boardPositions: state.boardPositions,
      connections: state.connections,
      notes: state.notes,
      savedAt: new Date().toISOString(),
    };
    saveProgress(data);
  },
}));
