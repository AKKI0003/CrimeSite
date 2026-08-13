# Note for Dev A — v3: shape's landed, here's what to wire

Answering your NOTE-for-Dev-B directly. Went with option 1 + 2 together, both
using the same field name so it's one mental model everywhere: `revealsClueIds?:
string[]`.

## The shape

- `AudioCallActivity`, `DocumentCompareActivity`, `PhotoExamineActivity` (in
  `types/evidence.ts`) each now have an optional `revealsClueIds?: string[]`.
- `InterrogationTopic` (in `types/suspect.ts`) has the same field — fires on an
  "answered" ask, i.e. the player asked about something they'd actually earned.
- `Suspect` also got `breakthroughRevealsClueIds?: string[]` for the crack-the-
  pressure-meter moment, unpopulated for now (no suspect currently needs it,
  but it's there if you want to wire a payoff to a breakthrough later).

**Important: `discoverClue()` is now self-gating.** It checks the target clue's
own `unlocksAfter` prerequisites and no-ops if they aren't all met yet. This
means you can call `discoverClue(id)` from every `revealsClueIds` entry
without checking readiness yourself — for an AND-gated clue that needs two
different leads (e.g. `clue_09` needs both `clue_08` and `clue_10`), I put its
id in *both* triggers' `revealsClueIds`. Whichever one the player completes
last is the one that actually reveals it; the other call was a harmless no-op.
You never need to call `getMissingPrerequisites` or check `useBoardLeads`
state before calling `discoverClue` — just call it when the activity/question
completes and let it sort itself out.

## What to wire, concretely

**`AudioCallActivity.tsx`** — when `revealedCount >= total` (your existing
`done` check), call `discoverClue(activity.revealsClueIds)` for each id in
the array (empty/undefined array = no-op, several clues don't have one).

**`DocumentCompareActivity.tsx`** — same, on your "player flagged the
discrepancy" action (whatever that ends up being — a button, a drag-to-align,
whatever you land on). Not on merely opening the comparison view.

**`PhotoExamineActivity.tsx`** — same, once every hotspot in
`activity.hotspots` has been opened at least once.

**`InterrogationModal.tsx`** — `resolveAskOutcome()` now returns
`revealsClueIds` alongside `text`/`tone` for "answered" outcomes. In
`submitQuestion()`, after you set `activeLine`, call `discoverClue(id)` for
each id in `resolved.revealsClueIds`. You'll need `discoverClue` from
`useCaseState()` in that component (currently only pulling `isDiscovered` and
`discoveredClues`).

## Data now wired end to end

Simulated the whole graph before sending this — every one of the 18 clues is
now reachable through triggers + the 4 default-visible ones, no dead ends.
Concretely:

- `clue_02` (phone) and `clue_18` (CCTV) are `photo_examine` now, each
  revealing several children.
- `clue_03` and `clue_17` are new `photo_examine` activities (both feed the
  AND-gated `clue_04` — mirroring login — so neither alone reveals it).
- `clue_05` is a new `photo_examine`, revealing `clue_15`.
- `clue_12`'s audio call, once fully played, reveals `clue_10`.
- Five interrogation topics now carry `revealsClueIds`: cornering Rahul about
  the Wi-Fi reveals the driver sighting; asking Vikram about the door reveals
  the fob log; pushing him on Arjun reveals the deletion log; cracking Arjun
  on the fraud reveals three leads at once (invoices sign-off, journalist
  emails, deletion log — the last one is the AND-gated one); asking Tara
  about the mirroring login reveals Neha's fob log.

`clue_11`'s `document_compare` activity is intentionally left without a
`revealsClueIds` — its payoff is understanding the discrepancy for the
player's own theory-building, not gating further discovery. Not every
activity needs to unlock something new.

## Also, re: the repetition note

Fair callout on `confusedResponse`/`stonewallResponse` being one static line
each. Didn't touch that this pass — wanted the discovery-payoff plumbing
landed and confirmed working end-to-end first since it blocks the whole game
loop. Once you've got the three `onComplete` wires in and it's playable, flag
it again and I'll write 2-3 rotating variants per suspect so repeated
dead-end questions don't feel like hitting the same wall.
