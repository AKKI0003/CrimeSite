# CASE//FILE — Case #017

An interactive detective investigation web app. See `docs/CASE-017-Design-Document.md`
for the full mystery and `docs/CASE-FILE-Architecture.md` for the work-split plan.

## Quickstart

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Ownership map (read this before editing anything)

| Folder | Owner | Notes |
|---|---|---|
| `src/types/` | Shared | Frozen after Day 1 morning sync. Change together. |
| `src/data/` | Dev B | Case content — clues, suspects, timeline, solution. |
| `src/engine/` | Dev B | Pure TS. No React imports allowed in here. |
| `src/hooks/` | Shared, additive-only | Dev A consumes these instead of importing `data/`/`engine/` directly. |
| `src/ui/` | Dev A | All components, styling, animation. |
| `src/App.tsx` | Shared, thin | Should basically never grow past a few lines. |
| `public/assets/` | Dev A | Images, sfx, textures. |
| `docs/` | Shared | Design + architecture reference. |

**Golden rule:** `ui/` never imports from `data/` or `engine/` directly — always go
through `hooks/useCaseState.ts` or `hooks/useContradictions.ts`. `engine/` never
imports from `ui/`. If you're about to break either rule, stop and add a field to
the relevant hook instead.

## Status

Day 1 scaffold: types frozen, all 18 clues / 6 suspects / full timeline / solution
data in place, engine layer (state store, contradiction detection, scoring,
persistence) implemented. UI is stub-only — real board/board interactions,
suspect panel, timeline scrubber, and theory builder still to be built.

Run `npm run dev` — you should see a plain 3-column layout listing suspects, clues,
and a timeline count. That confirms the full data → engine → hook → UI pipeline
works. Everything from here is UI work on top of a working data layer.
