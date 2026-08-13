import type { InterrogationTopic, Suspect } from "@/types";

/**
 * Replaces button-driven "ask about" topics with real free-text input.
 * There is no predefined question list rendered anywhere anymore — the
 * player types whatever they want, and this pure function decides what
 * the suspect says back. No AI call here (this is a static frontend);
 * matching is keyword-based against each topic's `keywords` array. That's
 * enough to feel like a real conversation as long as `keywords` lists are
 * written generously (see suspects.ts) — Dev B's job to keep those good.
 */

export type AskOutcome =
  | { kind: "answered"; topic: InterrogationTopic }
  | { kind: "stonewalled"; topic: InterrogationTopic } // matched, but locked
  | { kind: "confused" }; // matched nothing at all

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s:'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Very small scoring pass: counts how many of a topic's keywords appear
 * as substrings of the normalized question. Ties broken by more keywords
 * matched, then by topic order (first-authored wins). No stemming/NLP —
 * deliberately simple and fully deterministic so it's easy to debug/tune. */
function scoreTopic(question: string, topic: InterrogationTopic): number {
  let score = 0;
  for (const kw of topic.keywords) {
    if (question.includes(kw.toLowerCase())) score += 1;
  }
  return score;
}

/**
 * Given free text the player typed and the suspect being interrogated,
 * returns what should happen. Callers (ui/) still need to check whether
 * the matched topic is unlocked (isDiscovered(topic.unlocksAfterClueId))
 * via `isTopicUnlocked` below — this function itself doesn't know about
 * the player's discovered-clues state, keeping it a pure function of
 * (question, suspect) that's trivial to unit test.
 */
export function matchQuestion(
  question: string,
  suspect: Suspect,
  isDiscovered: (clueId: string) => boolean
): AskOutcome {
  const topics = suspect.interrogationTopics ?? [];
  const q = normalize(question);
  if (q.length === 0) return { kind: "confused" };

  let best: InterrogationTopic | null = null;
  let bestScore = 0;

  for (const topic of topics) {
    const score = scoreTopic(q, topic);
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  if (!best || bestScore === 0) return { kind: "confused" };

  const unlocked = !best.unlocksAfterClueId || isDiscovered(best.unlocksAfterClueId);
  return unlocked ? { kind: "answered", topic: best } : { kind: "stonewalled", topic: best };
}

/** Resolves an AskOutcome + suspect into the actual line of dialogue and
 * tone to render, so ui/ doesn't have to branch on `kind` itself. */
export function resolveAskOutcome(
  outcome: AskOutcome,
  suspect: Suspect
): { text: string; tone?: string; matchedTopicId?: string } {
  switch (outcome.kind) {
    case "answered":
      return { text: outcome.topic.response, tone: outcome.topic.tone, matchedTopicId: outcome.topic.id };
    case "stonewalled":
      return {
        text: suspect.stonewallResponse ?? "I'm not answering that without something to back it up.",
        tone: "evasive",
      };
    case "confused":
      return {
        text: suspect.confusedResponse ?? "I don't understand what you're asking.",
        tone: "calm",
      };
  }
}
