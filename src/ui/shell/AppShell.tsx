import { EvidenceBoard } from "@/ui/board/EvidenceBoard";
import { SuspectPanel } from "@/ui/suspects/SuspectPanel";
import { TimelineView } from "@/ui/timeline/TimelineView";

// STUB — Dev A: replace with the real 3-column investigation layout from the design doc.
export function AppShell() {
  return (
    <div className="min-h-screen bg-neutral-950 grid grid-cols-3">
      <SuspectPanel />
      <EvidenceBoard />
      <TimelineView />
    </div>
  );
}
