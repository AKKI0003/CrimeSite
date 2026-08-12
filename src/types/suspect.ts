// SHARED CONTRACT — frozen after Day 1 morning sync.

export interface SuspectStatement {
  id: string;
  /** the quoted statement text, as given to investigators */
  text: string;
  /** internal note for Dev B / design reference — NOT shown to player in the UI */
  trueMeaning?: string;
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
}
