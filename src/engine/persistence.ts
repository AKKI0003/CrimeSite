// Single module owning all localStorage access, so storage strategy can change later
// (e.g. swap to IndexedDB) without touching any other file.

const STORAGE_KEY = "case-file-017-progress";

export interface PersistedProgress {
  discoveredClueIds: string[];
  boardPositions: Record<string, { x: number; y: number }>;
  connections: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
    playerMade: boolean;
  }>;
  notes: Record<string, string>;
  savedAt: string;
}

export function saveProgress(data: PersistedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save progress:", err);
  }
}

function isValidPersistedProgress(value: unknown): value is PersistedProgress {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.discoveredClueIds) &&
    typeof v.boardPositions === "object" &&
    v.boardPositions !== null &&
    Array.isArray(v.connections) &&
    typeof v.notes === "object" &&
    v.notes !== null &&
    typeof v.savedAt === "string"
  );
}

/**
 * Returns null on missing, corrupted, or shape-mismatched data instead of throwing —
 * a bad localStorage entry (partial write, old schema version, manual tampering)
 * should degrade to "start fresh," never crash the app on load.
 */
export function loadProgress(): PersistedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidPersistedProgress(parsed)) {
      console.warn("Saved progress has an unexpected shape, ignoring and starting fresh.");
      return null;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to load progress:", err);
    return null;
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear progress:", err);
  }
}
