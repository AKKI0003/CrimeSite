import { useState } from "react";
import { useCaseState } from "@/hooks/useCaseState";
import { InterrogationModal } from "./InterrogationModal";
import { SuspectAvatar } from "./SuspectAvatar";
import type { Suspect } from "@/types";

// Portrait art is Gemini-generated, Dev-A-owned asset content. Keyed by suspect
// id rather than added to Suspect.photoUrl so this stays entirely inside ui/ —
// Dev B's data/suspects.ts isn't touched. Fill in the rest as more portraits
// are generated; suspects with no entry fall back to initials.
const SUSPECT_PORTRAIT: Partial<Record<string, string>> = {
  suspect_rahul: "/assets/portraits/suspect_rahul.jpg",
};

// Clicking a suspect now opens the full interrogation modal instead of an
// inline text expand — "ask about" topics, typed-out dialogue, a face.
export function SuspectPanel() {
  const { allSuspects } = useCaseState();
  const [interrogatingId, setInterrogatingId] = useState<string | null>(null);
  const interrogating = allSuspects.find((s) => s.id === interrogatingId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <h2 className="font-[var(--font-typewriter)] text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Persons of Interest
        </h2>
      </div>

      <ul className="flex-1 overflow-y-auto p-3 space-y-2">
        {allSuspects.map((s) => (
          <SuspectRow key={s.id} suspect={s} onSelect={() => setInterrogatingId(s.id)} />
        ))}
      </ul>

      {interrogating && (
        <InterrogationModal suspect={interrogating} onClose={() => setInterrogatingId(null)} />
      )}
    </div>
  );
}

function SuspectRow({ suspect, onSelect }: { suspect: Suspect; onSelect: () => void }) {
  return (
    <li>
      <button
        onClick={onSelect}
        className="w-full rounded-[var(--radius-panel)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-3 text-left transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-raised)] sm:py-2.5"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-panel)]">
            {SUSPECT_PORTRAIT[suspect.id] ? (
              <img
                src={SUSPECT_PORTRAIT[suspect.id]}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
                loading="lazy"
              />
            ) : (
              <SuspectAvatar id={suspect.id} size={36} className="h-full w-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-[var(--color-text-primary)]">{suspect.name}</p>
            <p className="truncate font-[var(--font-typewriter)] text-[11px] text-[var(--color-text-muted)]">
              {suspect.occupation} · {suspect.age}
            </p>
          </div>
          <span className="shrink-0 font-[var(--font-typewriter)] text-[10px] uppercase tracking-wide text-[var(--color-accent-red)]">
            Interrogate →
          </span>
        </div>
      </button>
    </li>
  );
}
