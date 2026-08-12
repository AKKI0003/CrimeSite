# CASE//FILE — Architecture & Work-Split Plan

## Core principle

The two devs never share a file unless it's in `/src/data` or `/src/types`, and those are
**written once on Day 1 morning, then frozen**. Everything else is owned by exactly one person.

If you ever find yourself both editing the same `.jsx`/`.ts` file — stop, that's a sign the
boundary is wrong, not that you need to "just be careful."

---

## Folder structure

```
case-file/
├── src/
│   ├── types/                     🔒 SHARED — freeze Day 1, morning
│   │   ├── evidence.ts            Clue, EvidenceType, Relationship types
│   │   ├── suspect.ts             Suspect type
│   │   ├── timeline.ts            TimelineEvent type
│   │   ├── theory.ts              PlayerTheory, ScoringResult types
│   │   └── index.ts               barrel export
│   │
│   ├── data/                      🟦 DEV B (Investigation Engine) owns content
│   │   ├── clues.ts                18 Clue objects
│   │   ├── suspects.ts             6 Suspect objects
│   │   ├── timeline.ts             timeline events (false + true)
│   │   ├── relationships.ts        the evidence graph edges
│   │   └── solution.ts             correct theory + scoring answer key
│   │
│   ├── engine/                    🟦 DEV B owns
│   │   ├── graphStore.ts           in-memory graph state (nodes/edges), connect/disconnect
│   │   ├── contradictionEngine.ts  detects `contradicts` edges, surfaces flags
│   │   ├── theoryScorer.ts         scoring logic (pure functions, unit-testable)
│   │   ├── persistence.ts          localStorage save/load of player progress
│   │   └── caseState.ts            central store: discovered clues, connections, notes
│   │                               (Zustand or Context — pick one, Dev B decides)
│   │
│   ├── ui/                        🟪 DEV A (Experience) owns
│   │   ├── board/
│   │   │   ├── EvidenceBoard.tsx       canvas/pan-zoom container
│   │   │   ├── EvidenceCard.tsx        draggable card component
│   │   │   ├── ConnectionLine.tsx      SVG line between cards
│   │   │   └── BoardControls.tsx       zoom/filter/search controls
│   │   ├── suspects/
│   │   │   ├── SuspectPanel.tsx
│   │   │   └── SuspectDetailModal.tsx
│   │   ├── timeline/
│   │   │   ├── TimelineView.tsx
│   │   │   └── TimelineScrubber.tsx
│   │   ├── evidence-detail/
│   │   │   └── EvidenceInspector.tsx   opens a clue in detail
│   │   ├── theory/
│   │   │   ├── TheoryBuilder.tsx       the "YOUR THEORY" construction screen
│   │   │   └── FinalReveal.tsx         cinematic reveal sequence
│   │   ├── shell/
│   │   │   ├── AppShell.tsx            main layout (header/panels)
│   │   │   ├── IntroSequence.tsx       cinematic case intro
│   │   │   └── AmbientAudio.tsx        audio toggle + playback
│   │   └── theme/
│   │       ├── tokens.css              colors, fonts, spacing (design tokens)
│   │       └── effects.css             grain, CRT flicker, paper textures
│   │
│   ├── hooks/                     🔶 SHARED, but additive-only (see rules below)
│   │   ├── useCaseState.ts         wraps engine/caseState for UI consumption
│   │   └── useContradictions.ts    wraps engine/contradictionEngine for UI
│   │
│   └── App.tsx                    🔒 SHARED — thin, touched rarely, coordinate before editing
│
├── public/
│   └── assets/                    🟪 DEV A owns (images, sfx, textures)
│
└── docs/
    ├── CASE-017-Design-Document.md
    └── CASE-FILE-Architecture.md   (this file)
```

---

## The contract: `src/types/` and `src/data/`

This is the single most important part of the split. Both of you agree on the **shape** of
the data before either of you builds anything real. Once frozen, Dev A can build the entire
UI against fake/sample data while Dev B fills in the real 18 clues — with zero collisions.

### `types/evidence.ts` (example — lock this in Day 1)

```typescript
export type EvidenceCategory = "physical" | "digital" | "location" | "human" | "timeline";

export type RelationshipType =
  | "supports" | "contradicts" | "caused_by" | "related_to"
  | "located_at" | "belongs_to" | "occurred_before" | "occurred_after" | "references";

export interface Relationship {
  target: string;          // clue or suspect id
  type: RelationshipType;
}

export interface Clue {
  id: string;
  category: EvidenceCategory;
  title: string;
  description: string;         // full inspectable text
  summary: string;             // short card-view text
  timestamp?: string;          // ISO or "10:56 PM" display string
  relatedSuspects: string[];   // suspect ids
  relationships: Relationship[];
  importance: "low" | "medium" | "high" | "critical";
  discoveredByDefault: boolean; // is it visible at game start, or unlocked later?
  unlocksAfter?: string[];      // clue ids that must be discovered first (optional gating)
}
```

**Why this matters:** Dev A never needs to know *what* clue #4 says to build the
`EvidenceCard` component. Dev A just needs to know it will receive a `Clue` object with
these fields. Dev B never needs to know how the card looks to write correct clue content.

Do the same lock-in for `Suspect`, `TimelineEvent`, `PlayerTheory`, and `ScoringResult`
before writing any UI or engine code. Budget ~1 hour Day 1 morning, together, just for this.

---

## Day-by-day split

### Day 1

**Together (first hour):** Finalize `types/`, agree on state management choice (Zustand
recommended — simpler than Context for this), agree on the 3 shared hook signatures.

**Dev A (Experience):**
- App shell layout, dark theme tokens, base typography
- Evidence board canvas with pan/zoom (can use dummy clue array first)
- Draggable evidence cards (visual only, positions in local component state initially)
- Suspect panel list view

**Dev B (Investigation Engine):**
- All 18 `Clue` objects in `data/clues.ts` (content from the design doc)
- All 6 `Suspect` objects in `data/suspects.ts`
- `caseState.ts` — Zustand store: discovered clues, board positions, connections, player notes
- Basic timeline data array (both false and true timelines, flagged)

**End of Day 1 checkpoint:** Dev A's board renders real clues from Dev B's data file
(via the shared hook) instead of dummy data. This is the first integration point — do it
together, live, for 15 minutes, not async.

---

### Day 2

**Dev A:**
- Connection lines between cards (SVG, driven by `relationships` data via `useCaseState`)
- Timeline view + scrubber
- Evidence inspector modal (detail view on click)
- Suspect detail modal (statement comparison UI)
- Contradiction visual indicator (reads from `useContradictions`, doesn't compute it)

**Dev B:**
- `contradictionEngine.ts` — detects `contradicts` edges among discovered/connected clues
- `theoryScorer.ts` — pure scoring functions against `data/solution.ts` answer key
- `TheoryBuilder` **data model** (what fields a submitted theory needs) — but Dev A builds
  the actual `TheoryBuilder.tsx` UI against that model
- `persistence.ts` — localStorage save/load so progress isn't lost on refresh

**Integration checkpoint (end of Day 2):** Full loop works — discover clues, connect them,
board flags a contradiction, player can open the theory builder and submit something, and
get a real (even if rough) score back.

---

### Day 3 — Polish (both, but still separated)

**Dev A:**
- Cinematic intro sequence
- Final reveal animation sequence (your theory vs. what actually happened)
- Sound effects, ambient audio polish
- Responsive pass, transitions, micro-interactions, easter eggs

**Dev B:**
- Score explanation text generation (the "why you got X%" copy logic)
- Edge case handling — empty states, incomplete theories, malformed saves
- Final QA pass on data accuracy (does every clue actually connect the way the design doc says)
- Loading states / error boundaries for the engine layer

---

## Rules that prevent regressions

1. **`types/` is frozen after Day 1's first hour.** If you need to change a shared type on
   Day 2 or 3, say so out loud first, change it together, and both re-check your side
   compiles. Don't silently modify a shared type.

2. **Dev A never imports directly from `data/`.** Always go through `hooks/useCaseState.ts`
   or `useContradictions.ts`. This means Dev B can restructure how data is stored/computed
   internally without breaking any UI component, as long as the hook's return shape doesn't
   change.

3. **Dev B never imports from `ui/`.** The engine has zero knowledge of React components.
   `engine/` and `data/` should be plain TypeScript, testable without rendering anything.

4. **`App.tsx` stays thin.** It should basically just be `<AppShell />` wrapping a router/state
   provider. If it starts accumulating logic, that logic belongs in `engine/` or a `ui/shell/`
   component instead — otherwise this becomes the one file you're both constantly editing.

5. **New shared hook? Add, don't modify.** If Dev A needs a new piece of derived state,
   prefer adding a new hook (`useTimelineFilters.ts`) over changing the signature of an
   existing one that the other person already depends on.

6. **Git workflow:** feature branches per person (`dev-a/board-connections`,
   `dev-b/contradiction-engine`), merge to `main` at the two integration checkpoints
   (end of Day 1, end of Day 2), not continuously. Small, frequent merges of *isolated*
   folders are safe; the checkpoints are for the moments your work actually touches.

7. **If a merge conflict ever happens outside `types/` or `App.tsx`, the folder boundary was
   violated somewhere** — figure out which file shouldn't have been shared and fix the
   boundary, not just the conflict.

---

## Suggested stack (matches original brief, made concrete)

- **React + Vite + TypeScript**
- **Zustand** for `caseState` (simpler than Redux, avoids Context re-render issues on a
  board with many draggable cards)
- **Framer Motion** for card drag/animations, reveal sequence
- **Tailwind** for layout/spacing, custom CSS for grain/CRT/paper texture effects (Tailwind
  utilities don't do that well — hand-write those in `theme/effects.css`)
- Plain SVG for connection lines (no need for React Flow at this scope — 18 clues and
  6 suspects is small enough that a hand-rolled SVG line layer will be faster to build and
  easier to style than adopting a graph library's opinions)
- **localStorage** for persistence, wrapped in `engine/persistence.ts` so it's one swappable
  module if you ever want to change storage strategy

---

## What to do right now

1. Both read this doc and the case design doc together.
2. Spend the first hour of Day 1 writing `src/types/*.ts` together — nothing else.
3. Split immediately after that per the Day 1 breakdown above.

Once you're ready, tell me which half you want me to start scaffolding first — I'd suggest
starting with the shared `types/` files since both halves depend on them, then moving into
whichever side you're personally building so you're not blocked.
