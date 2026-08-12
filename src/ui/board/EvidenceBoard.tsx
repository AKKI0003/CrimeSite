import { useCaseState } from "@/hooks/useCaseState";
import { useContradictions } from "@/hooks/useContradictions";

// STUB — Dev A: build the real pan/zoom canvas + draggable EvidenceCard layout here.
// This placeholder just proves the data pipeline works end to end.
export function EvidenceBoard() {
  const { discoveredClues } = useCaseState();
  const { activeContradictions } = useContradictions();

  return (
    <div className="p-6 text-neutral-200">
      <h2 className="text-xl mb-4">Evidence Board (stub)</h2>
      <p className="mb-2 text-sm text-neutral-400">
        {discoveredClues.length} clues discovered · {activeContradictions.length} active contradiction(s)
      </p>
      <ul className="space-y-1">
        {discoveredClues.map((clue) => (
          <li key={clue.id} className="text-sm">
            {clue.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
