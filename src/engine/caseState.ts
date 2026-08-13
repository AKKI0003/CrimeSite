import { create } from "zustand";
import { clues } from "@/data/clues";
import type { Relationship } from "@/types";

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
}

const defaultDiscovered = new Set(
  clues.filter((c) => c.discoveredByDefault).map((c) => c.id)
);

const defaultPositions = Object.fromEntries(
  clues
    .filter((c) => c.boardPosition)
    .map((c) => [c.id, c.boardPosition as { x: number; y: number }])
);

export const useCaseStateStore = create<CaseStateShape>((set, get) => ({
  discoveredClueIds: new Set(defaultDiscovered),
  boardPositions: { ...defaultPositions },
  connections: [],
  notes: {},

  discoverClue: (clueId) =>
    set((state) => {
      // Deliberately NOT cascading here. Discovering one clue used to fixed-point
      // through the entire unlocksAfter graph in a single click (cascadeUnlocks
      // loops until nothing new opens), which meant "Dig Deeper" on one card could
      // pop half the case file open at once. Investigation should cost one action
      // per clue: add exactly the clue that was found, nothing else.
      //
      // Also now self-gating: discoverClue() checks the clue's own unlocksAfter
      // prerequisites and no-ops if they aren't all met yet. This makes it safe
      // for activity/interrogation "revealsClueIds" payoffs to call discoverClue
      // speculatively on an AND-gated clue (e.g. one that needs two different
      // leads) without needing to duplicate the readiness check at every call
      // site — whichever trigger fires last is the one that actually reveals it.
      if (state.discoveredClueIds.has(clueId)) return state;
      const clue = clues.find((c) => c.id === clueId);
      if (clue?.unlocksAfter && clue.unlocksAfter.length > 0) {
        const ready = clue.unlocksAfter.every((prereqId) => state.discoveredClueIds.has(prereqId));
        if (!ready) return state;
      }
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

  reset: () =>
    set({
      discoveredClueIds: new Set(defaultDiscovered),
      boardPositions: { ...defaultPositions },
      connections: [],
      notes: {},
    }),
}));
