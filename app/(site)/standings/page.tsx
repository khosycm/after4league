import { getActiveSeason, getPointsConfig } from "@/lib/data/seasons";
import { listRosterForSeason } from "@/lib/data/players";
import { getCompletedMatchesForSeason } from "@/lib/data/matches";
import { computeStandings } from "@/lib/domain/standings";
import { StandingsTable } from "@/components/standings/standings-table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StandingsPage() {
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
  const standings = computeStandings(matches, roster, getPointsConfig(season));

  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">{season.name}</p>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Table</h1>
      </div>
      <StandingsTable rows={standings} />
    </div>
  );
}
