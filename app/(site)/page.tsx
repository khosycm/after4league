import Link from "next/link";
import { getActiveSeason } from "@/lib/data/seasons";
import { listRosterForSeason } from "@/lib/data/players";
import { getCompletedMatchesForSeason, getUpcomingFixturesForSeason } from "@/lib/data/matches";
import { getPointsConfig } from "@/lib/data/seasons";
import { computeStandings } from "@/lib/domain/standings";
import { computeTopScorers } from "@/lib/domain/leaderboards";
import { StandingsTable } from "@/components/standings/standings-table";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
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

  const [roster, completedMatches, upcomingFixtures] = await Promise.all([
    listRosterForSeason(season.id),
    getCompletedMatchesForSeason(season.id),
    getUpcomingFixturesForSeason(season.id),
  ]);

  const standings = computeStandings(completedMatches, roster, getPointsConfig(season));
  const topScorers = computeTopScorers(completedMatches, roster).slice(0, 3);
  const nextFixtures = upcomingFixtures.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">
          {season.name}
        </p>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide text-navy">
          Office eFootball League
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <CardHeader className="flex flex-row items-baseline justify-between">
            <CardTitle>Table</CardTitle>
            <Link href="/standings" className="text-sm font-medium text-accent hover:underline">
              Full table →
            </Link>
          </CardHeader>
          <StandingsTable rows={standings} compact />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top scorers</CardTitle>
          </CardHeader>
          <ol className="space-y-3">
            {topScorers.map((scorer, index) => (
              <li key={scorer.playerId} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="font-heading font-bold text-muted tabular-nums">{index + 1}</span>
                  <Link href={`/players/${scorer.playerId}`} className="font-medium text-ink hover:text-accent">
                    {scorer.name}
                  </Link>
                </span>
                <span className="font-heading font-bold tabular-nums text-navy">{scorer.goals}</span>
              </li>
            ))}
            {topScorers.length === 0 && <p className="text-sm text-muted">No goals scored yet.</p>}
          </ol>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-baseline justify-between">
          <CardTitle>Upcoming fixtures</CardTitle>
          <Link href="/fixtures" className="text-sm font-medium text-accent hover:underline">
            All fixtures →
          </Link>
        </CardHeader>
        <div className="space-y-3">
          {nextFixtures.map((match) => (
            <FixtureCard key={match.id} match={match} />
          ))}
          {nextFixtures.length === 0 && <p className="text-sm text-muted">No upcoming fixtures scheduled.</p>}
        </div>
      </Card>
    </div>
  );
}
