# Note for Dev B — v2: discovery has to come FROM the activities, not a board gesture

Akki's clarification on "ghost cards are too easy": it was never about the
gesture (tap vs. hold). The actual ask is that new evidence should surface
because the player did real investigative work — finished listening to a
call, compared two documents and caught the discrepancy, worked through a
photo's hotspots, connected the right cards, gotten something out of a
suspect — not because they clicked or held a shape on the corkboard. Same
expectation for suspects: what a suspect gives up should be earned through
the investigation, not just typing at them.

I pulled the hold-to-reveal mechanic back out. `GhostCard.tsx` is now purely
a presence indicator — dim silhouette, no click, no hold, nothing happens
if you interact with it. It tells the player "there's more, go earn it,"
and that's all it does now. Discovery needs to happen somewhere else
entirely: at the end of an activity, or from something that happens in
interrogation. That's the actual work, and it's mostly on your side.

## What's needed, concretely

There's currently no path from "player finished an activity" to
`discoverClue()` being called — that's the missing piece. Some options,
roughly in order of how much they'd need to change:

1. **Per-activity payoff.** Add an optional field to each activity variant
   in `types/evidence.ts` — something like `revealsClueId?: string` — so
   finishing that specific activity (all transcript lines played, the
   discrepancy flagged, every photo hotspot examined) triggers discovery of
   a real, related clue. E.g. finishing Priya's call recording could surface
   a clue about what she was actually hiding; flagging the invoice
   discrepancy could surface the journalist email thread. I already built
   the three activity components (`AudioCallActivity`, `DocumentCompareActivity`,
   `PhotoExamineActivity`) — they each have a clear "player just completed
   this" moment (transcript fully revealed, discrepancy flagged, all
   hotspots opened) that I can wire an `onComplete` callback to as soon as
   there's a field to read.

2. **Interrogation payoff.** Similarly, `InterrogationTopic` and/or
   `breakthroughResponse` could carry a `revealsClueId?: string` — asking
   the right (unlocked) question, or cracking a suspect entirely, hands the
   player something concrete rather than just a line of dialogue. Given the
   "same goes for suspects" note, this feels like the more important of the
   two to prioritize — right now getting a suspect to break down doesn't
   actually give the player anything to take back to the board.

3. **`unlocksAfter` stays as-is for now.** I'm not proposing you rip out the
   clue-to-clue gating — it's still fine as the underlying "is this even
   reachable yet" check that `useBoardLeads` reads for the ghost card's
   ready/near state. What's missing is the trigger that actually calls
   `discoverClue()` once it's reachable — right now nothing does that except
   the gesture I just removed.

This touches `types/evidence.ts` and `types/suspect.ts`, both frozen-shared —
flagging rather than just adding the fields myself. Once there's a shape
you're good with, I'll wire the `onComplete` calls into the three activity
components and the interrogation modal same day.

## Status in the meantime

Board leads currently just sit there glowing "ready" with no way to actually
open them — that's expected and temporary, not a bug, until #1/#2 land.
Didn't want to ship a fake gesture just to keep things clickable.

## Also still true from the last note

- Same interrogation-repetition issue as before: `confusedResponse` /
  `stonewallResponse` are one static line each and a lot of early questions
  land there. That's separate from the discovery-payoff work above but
  worth doing in the same pass since you'll already be in `suspects.ts`.
