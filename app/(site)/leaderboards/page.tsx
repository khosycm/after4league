import Link from "next/link";
import { getActiveSeason } from "@/lib/data/seasons";
import { listRosterForSeason } from "@/lib/data/players";
import { getCompletedMatchesForSeason } from "@/lib/data/matches";
import { computeBestWinRate, computeTopScorers } from "@/lib/domain/leaderboards";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LeaderboardsPage() {
  const season = await getActiveSeason();

  if (!season) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No active season</CardTitle>
          <CardDescription>Check back once the next season kicks off.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const [roster, matches] = await Promise.all([
    listRosterForSeason(season.id),
    getCompletedMatchesForSeason(season.id),
  ]);

  const topScorers = computeTopScorers(matches, roster);
  const bestWinRate = computeBestWinRate(matches, roster, 1);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">{season.name}</p>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Leaderboards</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top scorers</CardTitle>
          </CardHeader>
          <ol className="space-y-2">
            {topScorers.map((row, index) => (
              <li key={row.playerId} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="w-5 font-heading font-bold tabular-nums text-muted">{index + 1}</span>
                  <Link href={`/players/${row.playerId}`} className="font-medium text-ink hover:text-accent">
                    {row.name}
                  </Link>
                </span>
                <span className="font-heading font-bold tabular-nums text-navy">{row.goals}</span>
              </li>
            ))}
            {topScorers.length === 0 && <p className="text-sm text-muted">No goals scored yet.</p>}
          </ol>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best win rate</CardTitle>
          </CardHeader>
          <ol className="space-y-2">
            {bestWinRate.map((row, index) => (
              <li key={row.playerId} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="w-5 font-heading font-bold tabular-nums text-muted">{index + 1}</span>
                  <Link href={`/players/${row.playerId}`} className="font-medium text-ink hover:text-accent">
                    {row.name}
                  </Link>
                </span>
                <span className="font-heading font-bold tabular-nums text-navy">
                  {Math.round(row.winRate * 100)}%
                </span>
              </li>
            ))}
            {bestWinRate.length === 0 && <p className="text-sm text-muted">No matches played yet.</p>}
          </ol>
        </Card>
      </div>
    </div>
  );
}
