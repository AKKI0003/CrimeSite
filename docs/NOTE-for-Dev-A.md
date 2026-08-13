# Note for Dev A — v2: free-text interrogation + activities, not clue-card reading

This supersedes the last note. Akki's feedback: the "Dig Deeper" fix wasn't enough —
clicking it on one card was popping the whole case open at once (real bug, fixed below),
predefined "ask about" buttons still make interrogation a script you click through, and
the whole thing is still just reading paragraphs of text. Wants: player finds every piece
of evidence themselves, asks suspects real typed questions, and *does things* — listens to
a call, compares two documents, examines a photo — instead of reading a card and clicking
next. Here's what changed on my side and what that means for yours.

---

## 1. Bug fix: "Dig Deeper" was unlocking the whole case in one click

`caseState.ts`'s `discoverClue()` was calling `cascadeUnlocks()`, which loops until
nothing new can unlock — so finding one clue chain-reacted through every clue that
was reachable from it, all at once. Fixed: `discoverClue()` now adds exactly the one
clue that was found and nothing else. If you still want a "dig deeper" affordance,
it should trigger exactly one more `discoverClue(id)` call per click, not a cascade.
(See point 4 below for why I'd rather you drop the explicit "Dig Deeper" UI element
entirely and use a quieter "new lead" indicator instead — same as before.)

## 2. Interrogation is now free-text, not buttons — this is the big one

**There is no more topic button list.** I removed `label` as a rendered UI element
(kept only as an internal dev-reference string) and every `InterrogationTopic` now
has a `keywords: string[]` array instead. New engine module:

**`src/engine/interrogationEngine.ts`** — exports:
- `matchQuestion(question, suspect, isDiscovered)` — takes whatever the player typed,
  scores it against every topic's `keywords`, and returns one of three outcomes:
  `answered` (matched an unlocked topic — give the real response), `stonewalled`
  (matched a topic that's still locked behind evidence — give a deflection, no info),
  or `confused` (didn't match anything — generic "I don't understand").
- `resolveAskOutcome(outcome, suspect)` — turns that into `{ text, tone }` ready to
  type out in the UI, using the suspect's new `confusedResponse` /
  `stonewallResponse` fields for the fallback cases.

**What this means you need to build in `InterrogationModal.tsx`:**
- Replace the "Ask About" button row with a real text input + submit (Enter or a
  button). Player types a question, hits enter, you call `matchQuestion()` +
  `resolveAskOutcome()`, type out the result the same way you already do for the
  old topic responses.
- Keep "Present Evidence" mode exactly as it is — that part was working and stays
  the primary way to actually corner someone (per the last note: pressure should
  only build from presenting evidence, not from asking questions, `stonewalled`/
  `confused` outcomes should add zero pressure, `answered` should add zero pressure
  too — only `presentEvidence()` bumps the meter).
- No keyword hints, no autocomplete, no suggested questions in the UI — the player
  should genuinely be composing the question themselves. If they're stuck, the
  case file / evidence board is where they're supposed to go get more to ask about.
- There's no dropdown of "which suspect knows about which clue" — that's the game.

This is plain keyword matching, not an LLM — there's no backend here to call one.
Write the `keywords` arrays generously (I did a first pass in `suspects.ts`) and
it holds up fine for a scripted mystery; if a specific phrasing keeps missing in
playtesting, ping me and I'll extend the keyword list rather than you hardcoding UI
logic around it.

## 3. Evidence is now split into "read" clues and "activities"

`types/evidence.ts` has a new `activity` field on `Clue`, one of:
- `audio_call` — `transcriptLines` that should be revealed as the player plays/
  scrubs a recording, not printed as one paragraph. No real audio files exist yet
  (`audioSrc` is optional) — for now, build the scrub/reveal interaction using the
  transcript lines directly; swap in real `<audio>` playback later if we get actual
  audio assets.
- `document_compare` — points at another clue id (`compareAgainstClueId`) the
  player has to actually pull up side-by-side and compare. The specific
  discrepancy (`discrepancyHint`) should only surface after the player attempts
  the comparison (e.g. clicks "flag a discrepancy" or drags to align them) — don't
  just print it under the description.
- `photo_examine` — `hotspots` with x/y percentages; render click-to-zoom points
  on an image, each revealing its `detail` only on click. No `imageSrc` yet for
  most of these — placeholder/redacted photo art is fine for now.
- `read` (or omitted) — current EvidenceInspector behavior, unchanged.

I've wired three real examples so you have working data to build against:
- `clue_12` (Priya's recorded call) → `audio_call`
- `clue_11` (Priya's signature) → `document_compare` against `clue_10` (the invoices)
- `clue_18` (lobby CCTV still) → `photo_examine`

The rest are still plain `read` for now — once you've got working components for
the three activity kinds, tell me which other clues should convert (e.g. `clue_06`
the Wi-Fi log or `clue_09` the deletion log both feel like `document_compare`
candidates) and I'll add the activity data for those too.

`EvidenceInspector.tsx` needs to branch on `clue.activity?.kind` and render the
right interaction instead of always showing `clue.description` as a paragraph.

## 4. Still true from the last note, unchanged

- Drop `relationships` rendering from `EvidenceInspector.tsx` — still spoils the
  corkboard deduction, same as before.
- Still want locked-but-close clues to feel present-but-unfound on the board
  rather than just absent, so a sparse-looking board doesn't read as "nothing
  else here." Your call on the visual treatment.

## Why this all matters together

The three changes are the same fix from different angles: nothing should be handed
to the player pre-digested. Evidence has to be worked for (find it, then actually
listen/compare/examine it), and suspects only give something up when you put real,
specific pressure on them with something you found — not by clicking through a
script. That's what "feels like a real detective" means mechanically.
