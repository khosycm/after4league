import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getMatchById } from "@/lib/data/matches";
import { MatchStatus } from "@/lib/generated/prisma/enums";
import { Card } from "@/components/ui/card";

export default async function FixtureDetailPage(props: PageProps<"/fixtures/[matchId]">) {
  const { matchId } = await props.params;
  const match = await getMatchById(matchId);

  if (!match) notFound();

  const isCompleted = match.status === MatchStatus.COMPLETED;

  return (
    <div className="space-y-4">
      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
        {match.season.name} · Round {match.round}
      </p>

      <Card className="space-y-4">
        <div className="flex items-center justify-center gap-6 text-center">
          <span className="flex-1 font-heading text-xl font-semibold text-navy">{match.homePlayer.name}</span>
          {isCompleted ? (
            <span className="font-heading text-4xl font-bold tabular-nums text-navy">
              {match.homeScore} – {match.awayScore}
            </span>
          ) : (
            <span className="font-heading text-lg font-semibold uppercase text-muted">vs</span>
          )}
          <span className="flex-1 font-heading text-xl font-semibold text-navy">{match.awayPlayer.name}</span>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-card-border pt-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted">Status</dt>
            <dd className="font-medium text-ink">{match.status}</dd>
          </div>
          <div>
            <dt className="text-muted">Kick-off</dt>
            <dd className="font-medium text-ink">{format(match.scheduledAt, "d MMM yyyy, HH:mm")}</dd>
          </div>
          {match.venue && (
            <div>
              <dt className="text-muted">Venue</dt>
              <dd className="font-medium text-ink">{match.venue}</dd>
            </div>
          )}
          {(match.homeClubUsed || match.awayClubUsed) && (
            <div>
              <dt className="text-muted">Clubs used</dt>
              <dd className="font-medium text-ink">
                {match.homeClubUsed ?? "—"} / {match.awayClubUsed ?? "—"}
              </dd>
            </div>
          )}
        </dl>

        {match.notes && (
          <p className="border-t border-card-border pt-4 text-sm text-muted">{match.notes}</p>
        )}
      </Card>
    </div>
  );
}
