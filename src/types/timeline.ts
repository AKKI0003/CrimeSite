// SHARED CONTRACT — frozen after Day 1 morning sync.

export interface TimelineEvent {
  id: string;
  /** display time, e.g. "11:42 PM" */
  time: string;
  /** sortable 24h minutes-since-midnight value, for scrubber/sort logic */
  sortKey: number;
  title: string;
  description: string;
  relatedClueIds: string[];
  relatedSuspectIds: string[];
  /** "false" = part of the fabricated/assumed timeline; "true" = the real reconstructed timeline */
  timelineVariant: "false" | "true";
}
