import { timelineEvents } from "@/data/timeline";

// STUB — Dev A: build the real scrubber + false/true variant toggle here.
export function TimelineView() {
  return (
    <div className="p-6 text-neutral-200">
      <h2 className="text-xl mb-4">Timeline (stub)</h2>
      <p className="text-sm text-neutral-400">{timelineEvents.length} total events loaded</p>
    </div>
  );
}
