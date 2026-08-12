// The answer key. Only theoryScorer.ts should import this.
// UI code must never import this file directly — that would let the solution leak
// into the client bundle in an inspectable way tied to visible UI logic/comments.
// (Note: for a real production game you'd keep this server-side; for a 3-day portfolio
// project shipped as a static site, everything is client-side anyway — but keeping the
// import boundary clean now means it's a small change later if you ever add a backend.)

export const SOLUTION = {
  correctCulpritId: "suspect_arjun",
  acceptableSecondaryCulpritId: "suspect_vikram", // give partial credit if chosen instead
  correctMotiveKeywords: ["fraud", "corebridge", "cover-up", "cover up", "funding round"],
  keyContradictionClueId: "clue_04", // paired against clue_03
  requiredSupportingClueIds: ["clue_04", "clue_08", "clue_09", "clue_10", "clue_13"],
  finalExplanationSummary:
    "Neha was never abducted. She staged her own disappearance with Tara and Rahul's help " +
    "to safely deliver fraud evidence to a journalist. The 11:42 PM timestamp is fabricated " +
    "— she actually left at 10:55 PM, before Vikram (sent by Arjun) searched her apartment " +
    "and found nothing.",
} as const;
