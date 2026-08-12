import type { PlayerTheory, ScoringResult, CategoryScore } from "@/types";
import { SOLUTION } from "@/data/solution";

const WEIGHTS = {
  culprit: 0.25,
  timeline: 0.2,
  keyContradiction: 0.2,
  motive: 0.15,
  evidenceSelection: 0.1,
  theoryCoherence: 0.1,
} as const;

function scoreCulprit(theory: PlayerTheory): CategoryScore {
  const correct = theory.culpritId === SOLUTION.correctCulpritId;
  const partial = theory.culpritId === SOLUTION.acceptableSecondaryCulpritId;
  const score = correct ? 100 : partial ? 60 : 0;
  return {
    category: "culprit",
    correct,
    score,
    explanation: correct
      ? "You correctly identified Arjun Mehra as criminally responsible."
      : partial
      ? "You identified Vikram Nair, who carried out the break-in — but the person who ordered it and stood to gain, Arjun Mehra, bears primary responsibility."
      : "The person you named isn't the one criminally responsible in this case. Look again at who ordered the break-in and who benefited from the cover-up.",
  };
}

function scoreMotive(theory: PlayerTheory): CategoryScore {
  const text = (theory.motiveId ?? "").toLowerCase();
  const correct = SOLUTION.correctMotiveKeywords.some((kw) => text.includes(kw));
  return {
    category: "motive",
    correct,
    score: correct ? 100 : 0,
    explanation: correct
      ? "You correctly connected the motive to the Corebridge fraud and the upcoming funding round."
      : "Your stated motive doesn't match the evidence. The driving motive was financial fraud, not a personal conflict.",
  };
}

function scoreKeyContradiction(theory: PlayerTheory): CategoryScore {
  const correct = theory.keyContradictionClueId === SOLUTION.keyContradictionClueId;
  return {
    category: "keyContradiction",
    correct,
    score: correct ? 100 : 0,
    explanation: correct
      ? "You flagged the core contradiction: the fake 11:42 PM text versus the phone-mirroring login record."
      : "You didn't flag the contradiction that breaks the false timeline open — check the 11:42 PM text against the device activity log.",
  };
}

function scoreEvidenceSelection(theory: PlayerTheory): CategoryScore {
  const required = new Set(SOLUTION.requiredSupportingClueIds);
  const chosen = new Set(theory.supportingClueIds);
  const hits = [...required].filter((id) => chosen.has(id)).length;
  const score = Math.round((hits / required.size) * 100);
  return {
    category: "evidenceSelection",
    correct: score >= 80,
    score,
    explanation:
      score >= 80
        ? "You selected the clues that actually prove the case."
        : `You selected ${hits} of ${required.size} of the clues that most directly prove what happened. Some of your other selections were red herrings.`,
  };
}

function scoreTimeline(theory: PlayerTheory): CategoryScore {
  // Simple heuristic: did the player include the real early-departure event
  // ("tlt_neha_exits") ahead of the fake anchor ("tlt_fake_text")?
  const ids = theory.reconstructedTimelineEventIds;
  const exitIdx = ids.indexOf("tlt_neha_exits");
  const fakeTextIdx = ids.indexOf("tlt_fake_text");
  const correct = exitIdx !== -1 && fakeTextIdx !== -1 && exitIdx < fakeTextIdx;
  return {
    category: "timeline",
    correct,
    score: correct ? 100 : exitIdx !== -1 ? 40 : 0,
    explanation: correct
      ? "You correctly placed Neha's real departure before the fabricated 11:42 PM text."
      : "Your timeline doesn't reflect that Neha actually left the building well before 11:42 PM.",
  };
}

function scoreTheoryCoherence(theory: PlayerTheory): CategoryScore {
  // Lightweight heuristic for a hackathon build: reward a non-trivial final explanation.
  const length = theory.finalExplanation.trim().length;
  const score = length > 400 ? 100 : length > 150 ? 70 : length > 30 ? 40 : 0;
  return {
    category: "theoryCoherence",
    correct: score >= 70,
    score,
    explanation:
      score >= 70
        ? "Your written explanation ties the motive, method, and timeline together clearly."
        : "Your final explanation could use more detail connecting motive, method, and timeline.",
  };
}

export function scoreTheory(theory: PlayerTheory): ScoringResult {
  const categoryScores: CategoryScore[] = [
    scoreCulprit(theory),
    scoreTimeline(theory),
    scoreKeyContradiction(theory),
    scoreMotive(theory),
    scoreEvidenceSelection(theory),
    scoreTheoryCoherence(theory),
  ];

  const overallScore = Math.round(
    categoryScores.reduce((sum, c) => sum + c.score * WEIGHTS[c.category], 0)
  );

  const rank: ScoringResult["rank"] =
    overallScore >= 85
      ? "MASTER DETECTIVE"
      : overallScore >= 65
      ? "DETECTIVE"
      : overallScore >= 40
      ? "INVESTIGATOR"
      : "NOVICE";

  return { overallScore, rank, categoryScores };
}
