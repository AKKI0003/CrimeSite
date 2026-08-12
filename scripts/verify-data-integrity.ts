// Run with: npm run verify-data
// Pure data-layer QA — checks referential integrity across clues.ts, suspects.ts,
// timeline.ts, relationships.ts, and solution.ts. Catches typo'd ids and dangling
// references before they cause silent UI bugs (e.g. a contradiction line that
// never renders because its target id doesn't exist).

import { clues } from "../src/data/clues";
import { suspects } from "../src/data/suspects";
import { timelineEvents } from "../src/data/timeline";
import { allEdges } from "../src/data/relationships";
import { SOLUTION } from "../src/data/solution";

let errors: string[] = [];
let warnings: string[] = [];

const clueIds = new Set(clues.map((c) => c.id));
const suspectIds = new Set(suspects.map((s) => s.id));

// 1. Every clue relationship target must exist as a clue or suspect id.
for (const clue of clues) {
  for (const rel of clue.relationships) {
    if (!clueIds.has(rel.target) && !suspectIds.has(rel.target)) {
      errors.push(
        `clue "${clue.id}" has a relationship targeting unknown id "${rel.target}" (type: ${rel.type})`
      );
    }
  }
  for (const suspectId of clue.relatedSuspects) {
    if (!suspectIds.has(suspectId)) {
      errors.push(`clue "${clue.id}" references unknown suspect id "${suspectId}"`);
    }
  }
  if (clue.unlocksAfter) {
    for (const prereq of clue.unlocksAfter) {
      if (!clueIds.has(prereq)) {
        errors.push(`clue "${clue.id}" has unlocksAfter referencing unknown clue "${prereq}"`);
      }
    }
  }
}

// 2. "contradicts" relationships should be symmetric (A contradicts B implies B contradicts A)
//    — not strictly required by the engine, but asymmetric contradictions are almost
//    always a data-entry mistake, so flag them as warnings.
for (const clue of clues) {
  for (const rel of clue.relationships) {
    if (rel.type !== "contradicts") continue;
    const target = clues.find((c) => c.id === rel.target);
    if (!target) continue; // already flagged as an error above
    const reciprocal = target.relationships.some(
      (r) => r.type === "contradicts" && r.target === clue.id
    );
    if (!reciprocal) {
      warnings.push(
        `clue "${clue.id}" contradicts "${rel.target}", but "${rel.target}" does not contradict back — likely a one-sided data entry`
      );
    }
  }
}

// 3. Every suspect's relatedEvidence must point to real clues.
for (const suspect of suspects) {
  for (const clueId of suspect.relatedEvidence) {
    if (!clueIds.has(clueId)) {
      errors.push(`suspect "${suspect.id}" relatedEvidence references unknown clue "${clueId}"`);
    }
  }
}

// 4. Timeline events must reference real clues/suspects.
for (const event of timelineEvents) {
  for (const clueId of event.relatedClueIds) {
    if (!clueIds.has(clueId)) {
      errors.push(`timeline event "${event.id}" references unknown clue "${clueId}"`);
    }
  }
  for (const suspectId of event.relatedSuspectIds) {
    if (!suspectIds.has(suspectId)) {
      errors.push(`timeline event "${event.id}" references unknown suspect "${suspectId}"`);
    }
  }
}

// 5. relationships.ts edges must reference real clues/suspects on both ends.
for (const edge of allEdges) {
  if (!clueIds.has(edge.source) && !suspectIds.has(edge.source)) {
    errors.push(`relationships.ts edge has unknown source "${edge.source}"`);
  }
  if (!clueIds.has(edge.target) && !suspectIds.has(edge.target)) {
    errors.push(`relationships.ts edge has unknown target "${edge.target}"`);
  }
}

// 6. solution.ts references must resolve to real ids.
if (!suspectIds.has(SOLUTION.correctCulpritId)) {
  errors.push(`solution.ts correctCulpritId "${SOLUTION.correctCulpritId}" is not a known suspect`);
}
if (!suspectIds.has(SOLUTION.acceptableSecondaryCulpritId)) {
  errors.push(
    `solution.ts acceptableSecondaryCulpritId "${SOLUTION.acceptableSecondaryCulpritId}" is not a known suspect`
  );
}
if (!clueIds.has(SOLUTION.keyContradictionClueId)) {
  errors.push(`solution.ts keyContradictionClueId "${SOLUTION.keyContradictionClueId}" is not a known clue`);
}
for (const clueId of SOLUTION.requiredSupportingClueIds) {
  if (!clueIds.has(clueId)) {
    errors.push(`solution.ts requiredSupportingClueIds references unknown clue "${clueId}"`);
  }
}

// 7. Sanity checks on counts, per the design doc.
if (clues.length !== 18) {
  warnings.push(`expected 18 clues per design doc, found ${clues.length}`);
}
if (suspects.length !== 6) {
  warnings.push(`expected 6 suspects per design doc, found ${suspects.length}`);
}

// ---- report ----
console.log(`Checked ${clues.length} clues, ${suspects.length} suspects, ${timelineEvents.length} timeline events, ${allEdges.length} graph edges.\n`);

if (warnings.length > 0) {
  console.log(`⚠ ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`  - ${w}`));
  console.log("");
}

if (errors.length > 0) {
  console.error(`✗ ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log("✓ Data integrity check passed — no dangling references.");
}
