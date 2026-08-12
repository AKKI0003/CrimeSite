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

export function loadProgress(): PersistedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedProgress;
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
