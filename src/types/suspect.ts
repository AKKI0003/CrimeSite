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
  /** internal/dev-reference label only — NOT shown as a button anymore.
   *  Kept for logs, debugging, and the design doc cross-reference. */
  label: string;
  /** words/short phrases the player's typed question is matched against
   *  (case-insensitive, matched as whole words). Include the obvious terms
   *  a real person would type — the noun the evidence is about, not just
   *  the exact clue title. e.g. for the Wi-Fi log topic: ["wifi", "wi-fi",
   *  "router", "network", "home", "alone", "10:51"] */
  keywords: string[];
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
  /** clue ids to auto-discover the moment this topic is successfully asked
   *  (an "answered" outcome, per interrogationEngine). Same no-op-if-not-
   *  ready semantics as Clue activities — safe to list an AND-gated clue id
   *  even if its other prerequisite hasn't landed yet. */
  revealsClueIds?: string[];
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
  /** shown when the player's typed question doesn't match any keyword at all —
   *  a genuine "I don't know what you're asking." Optional, engine has a
   *  generic fallback if omitted. */
  confusedResponse?: string;
  /** shown when the player's question matches a topic's keywords, but that
   *  topic is still locked (its unlocksAfterClueId hasn't been discovered).
   *  This is the "you're onto something but can't prove it yet" deflection —
   *  distinct from confusedResponse, which means the question didn't land
   *  anywhere at all. Optional, engine has a generic fallback if omitted. */
  stonewallResponse?: string;
  /** unlocked once the interrogation's pressure meter fills — the "crack in
   *  the story" moment. Optional; suspects without one just cap out calmly. */
  breakthroughResponse?: string;
  /** clue ids to auto-discover the moment this suspect breaks (pressure
   *  meter fills). Optional — a breakthrough doesn't have to hand over new
   *  evidence, but often should. */
  breakthroughRevealsClueIds?: string[];
}
