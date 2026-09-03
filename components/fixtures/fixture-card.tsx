import Link from "next/link";
import { format } from "date-fns";
import { MatchStatus } from "@/lib/generated/prisma/enums";
import { Card } from "@/components/ui/card";

export type FixtureCardMatch = {
  id: string;
  round: number;
  scheduledAt: Date;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  homePlayer: { id: string; name: string };
  awayPlayer: { id: string; name: string };
};

export function FixtureCard({ match }: { match: FixtureCardMatch }) {
  const isCompleted = match.status === MatchStatus.COMPLETED;

  return (
    <Link href={`/fixtures/${match.id}`}>
      <Card className="flex items-center justify-between gap-4 p-4 hover:border-accent">
        <div className="flex flex-1 items-center justify-between gap-3">
          <span className="flex-1 truncate text-right font-medium text-ink">{match.homePlayer.name}</span>
          {isCompleted ? (
            <span className="font-heading text-lg font-bold tabular-nums text-navy">
              {match.homeScore} – {match.awayScore}
            </span>
          ) : (
            <span className="font-heading text-sm font-semibold uppercase text-muted">vs</span>
          )}
          <span className="flex-1 truncate text-left font-medium text-ink">{match.awayPlayer.name}</span>
        </div>
        <div className="w-28 shrink-0 text-right text-xs text-muted">
          {isCompleted ? (
            <span>Round {match.round}</span>
          ) : (
            <span>{format(match.scheduledAt, "d MMM, HH:mm")}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
