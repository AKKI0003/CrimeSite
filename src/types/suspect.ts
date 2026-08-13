// SHARED CONTRACT — frozen after Day 1 morning sync.

export interface SuspectStatement {
  id: string;
  /** the quoted statement text, as given to investigators */
  text: string;
  /** internal note for Dev B / design reference — NOT shown to player in the UI */
  trueMeaning?: string;
}

export interface InterrogationTopic {
  id: string;
  /** short label shown on the "ask about" button, e.g. "The 11:42 text" */
  label: string;
  /** the response text, typed out live in the interrogation UI */
  response: string;
  /** suspect's demeanor while answering this topic — purely presentational,
   *  read by ui/ to drive avatar/tone but never gates any game logic */
  tone?: "calm" | "defensive" | "evasive" | "nervous" | "hostile";
  /** clue ids this response references, if the UI wants to cross-link them */
  relatedClueIds?: string[];
  /** only offer this topic once a given clue has been discovered — optional gating,
   *  same pattern as Clue.unlocksAfter. Omit for always-available topics. */
  unlocksAfterClueId?: string;
}

export interface EvidenceReaction {
  /** the clue id being presented to the suspect */
  clueId: string;
  /** their reaction when confronted with specifically this piece of evidence */
  reaction: string;
  tone?: "calm" | "defensive" | "evasive" | "nervous" | "hostile" | "cornered";
  /** how much this confrontation should move the pressure meter (default 2) */
  pressureValue?: number;
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  photoUrl?: string;
  relationshipToVictim: string;
  knownLocation: string;
  motive: string;
  statements: SuspectStatement[];
  /** clue ids that relate directly to this suspect */
  relatedEvidence: string[];
  /** true only for the internal answer key — never read by UI to render anything visible */
  isActuallyResponsible: boolean;
  /** additive, optional — powers the interrogation modal's "ask about" system.
   *  Suspects without this fall back to their single `statements` entry. */
  interrogationTopics?: InterrogationTopic[];
  /** additive, optional — reactions to being confronted with specific evidence
   *  during interrogation. Falls back to `defaultEvidenceReaction` if the
   *  presented clue isn't in this list. */
  evidenceReactions?: EvidenceReaction[];
  /** shown when the player presents evidence that has no specific reaction authored */
  defaultEvidenceReaction?: string;
  /** unlocked once the interrogation's pressure meter fills — the "crack in
   *  the story" moment. Optional; suspects without one just cap out calmly. */
  breakthroughResponse?: string;
}
