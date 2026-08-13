import { useState } from "react";
import { useCaseState } from "@/hooks/useCaseState";
import type { Suspect } from "@/types";

// Day 1: list view only. SuspectDetailModal (statement comparison UI) is a Day 2 build.
export function SuspectPanel() {
  const { allSuspects } = useCaseState();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <h2 className="font-[var(--font-typewriter)] text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Persons of Interest
        </h2>
      </div>

      <ul className="flex-1 overflow-y-auto p-3 space-y-2">
        {allSuspects.map((s) => (
          <SuspectRow
            key={s.id}
            suspect={s}
            selected={selectedId === s.id}
            onSelect={() => setSelectedId((cur) => (cur === s.id ? null : s.id))}
          />
        ))}
      </ul>
    </div>
  );
}

function SuspectRow({
  suspect,
  selected,
  onSelect,
}: {
  suspect: Suspect;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        onClick={onSelect}
        className={`w-full rounded-[var(--radius-panel)] border px-3 py-2.5 text-left transition-colors ${
          selected
            ? "border-[var(--color-accent-red)] bg-[var(--color-bg-raised)]"
            : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-border-strong)]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)] font-[var(--font-display)] text-sm text-[var(--color-text-secondary)]">
            {suspect.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-[var(--color-text-primary)]">{suspect.name}</p>
            <p className="truncate font-[var(--font-typewriter)] text-[11px] text-[var(--color-text-muted)]">
              {suspect.occupation} · {suspect.age}
            </p>
          </div>
        </div>

        {selected && (
          <div className="mt-2 space-y-1 border-t border-[var(--color-border)] pt-2 font-[var(--font-typewriter)] text-[11px] text-[var(--color-text-secondary)]">
            <p>
              <span className="text-[var(--color-text-muted)]">Relation:</span>{" "}
              {suspect.relationshipToVictim}
            </p>
            <p>
              <span className="text-[var(--color-text-muted)]">Location:</span> {suspect.knownLocation}
            </p>
            <p>
              <span className="text-[var(--color-text-muted)]">Motive:</span> {suspect.motive}
            </p>
          </div>
        )}
      </button>
    </li>
  );
}
