// SHARED CONTRACT — frozen after Day 1 morning sync.
// If this needs to change on Day 2/3, both devs change it together.

export type EvidenceCategory =
  | "physical"
  | "digital"
  | "location"
  | "human"
  | "timeline";

export type RelationshipType =
  | "supports"
  | "contradicts"
  | "caused_by"
  | "related_to"
  | "located_at"
  | "belongs_to"
  | "occurred_before"
  | "occurred_after"
  | "references";

export interface Relationship {
  /** id of the clue or suspect this relationship points to */
  target: string;
  type: RelationshipType;
}

export type ActivityKind = "audio_call" | "document_compare" | "photo_examine" | "read";

export interface AudioCallActivity {
  kind: "audio_call";
  /** label for the play control, e.g. "Recorded call — 9 days before" */
  audioLabel: string;
  /** the actual audio file path — Dev A wires this to a real <audio> element.
   *  If no file exists yet, ui/ should render the transcript as a "waveform
   *  scrub" the player has to click through line-by-line rather than just
   *  printing it as paragraph text — the point is the player has to listen/
   *  scrub, not skim. */
  audioSrc?: string;
  /** transcript lines, revealed progressively as the player plays/scrubs,
   *  NOT dumped all at once under the clue title. */
  transcriptLines: string[];
  /** clue ids to auto-discover once every transcript line has been played/
   *  scrubbed through. Safe to list clues that also need OTHER prerequisites
   *  (e.g. an AND-gated clue) — discoverClue() itself checks readiness, so
   *  listing an id here that isn't fully unlockable yet is a harmless no-op
   *  until its other prerequisite also fires. */
  revealsClueIds?: string[];
}

export interface DocumentCompareActivity {
  kind: "document_compare";
  /** what the player is being asked to compare this document against —
   *  e.g. comparing an invoice's signature/date against another clue's.
   *  ui/ should render both side by side and require the player to
   *  actively flag the discrepancy rather than reading a conclusion. */
  compareAgainstClueId: string;
  /** the specific discrepancy the player should be able to find, kept out
   *  of the clue description itself so it isn't just handed over — surfaced
   *  by ui/ only after the player attempts the comparison. */
  discrepancyHint: string;
  /** clue ids to auto-discover once the player has actually flagged the
   *  discrepancy (not just opened the comparison view). Same no-op-if-not-
   *  ready semantics as the audio activity's field above. */
  revealsClueIds?: string[];
}

export interface PhotoExamineActivity {
  kind: "photo_examine";
  imageSrc?: string;
  /** hotspot regions worth a closer look, in % of image width/height, so
   *  ui/ can render click-to-zoom points instead of one flat description */
  hotspots: { x: number; y: number; label: string; detail: string }[];
  /** clue ids to auto-discover once every hotspot has been opened at least
   *  once. Same no-op-if-not-ready semantics as above. */
  revealsClueIds?: string[];
}

export type ClueActivity =
  | AudioCallActivity
  | DocumentCompareActivity
  | PhotoExamineActivity
  | { kind: "read" };

export interface Clue {
  id: string;
  category: EvidenceCategory;
  title: string;
  /** short text shown on the card face */
  summary: string;
  /** full text shown when the card is opened/inspected. For non-"read"
   *  activities, keep this to a short caption — the real content lives in
   *  `activity`, not here, so the player has to do the activity instead of
   *  just reading a paragraph. */
  description: string;
  /** how the player engages with this clue. Defaults to "read" (the current
   *  clue-card behavior) when omitted — set this explicitly on clues that
   *  should be a call to listen to, a document to compare, or a photo to
   *  examine, per the case design doc. */
  activity?: ClueActivity;
  /** display timestamp, e.g. "10:56 PM" — optional, not every clue is time-anchored */
  timestamp?: string;
  relatedSuspects: string[];
  relationships: Relationship[];
  importance: "low" | "medium" | "high" | "critical";
  /** true = visible to the player at game start */
  discoveredByDefault: boolean;
  /** ids of clues that must be discovered before this one unlocks (optional gating) */
  unlocksAfter?: string[];
  /** default x/y position on the board when first placed, board can move it after */
  boardPosition?: { x: number; y: number };
}
