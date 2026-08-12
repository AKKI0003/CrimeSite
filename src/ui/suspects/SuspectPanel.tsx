import { useCaseState } from "@/hooks/useCaseState";

// STUB — Dev A: build the real suspect card grid + detail modal trigger here.
export function SuspectPanel() {
  const { allSuspects } = useCaseState();
  return (
    <div className="p-6 text-neutral-200">
      <h2 className="text-xl mb-4">Suspects (stub)</h2>
      <ul className="space-y-1">
        {allSuspects.map((s) => (
          <li key={s.id} className="text-sm">
            {s.name} — {s.occupation}
          </li>
        ))}
      </ul>
    </div>
  );
}
