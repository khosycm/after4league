import { ResultBadge } from "@/components/fixtures/result-badge";
import type { PlayerMatchSummary } from "@/lib/domain/types";

export function FormGuide({ summaries }: { summaries: PlayerMatchSummary[] }) {
  if (summaries.length === 0) return <p className="text-sm text-muted">No recent form.</p>;

  return (
    <div className="flex gap-1.5">
      {summaries.map((summary) => (
        <ResultBadge key={summary.matchId} result={summary.result} />
      ))}
    </div>
  );
}
