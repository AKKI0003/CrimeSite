import { timelineEvents } from "@/data/timeline";
import type { TimelineEvent } from "@/types";

/**
 * Additive hook (per architecture rule 5: add, don't modify existing shared hooks).
 * Timeline events are static case content, same pattern as useCaseState reading
 * clues/suspects directly from @/data — this just gives ui/ a named entry point
 * instead of importing @/data/timeline directly from a component.
 */
export function useTimeline() {
  const events: TimelineEvent[] = timelineEvents;
  const falseTimeline = events.filter((e) => e.timelineVariant === "false");
  const trueTimeline = events.filter((e) => e.timelineVariant === "true");

  return { events, falseTimeline, trueTimeline };
}
