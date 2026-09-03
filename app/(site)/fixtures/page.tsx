import { getActiveSeason } from "@/lib/data/seasons";
import { getMatchesForSeasonGroupedByRound } from "@/lib/data/matches";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FixturesPage() {
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

  const matches = await getMatchesForSeasonGroupedByRound(season.id);
  const rounds = new Map<number, typeof matches>();
  for (const match of matches) {
    const bucket = rounds.get(match.round);
    if (bucket) bucket.push(match);
    else rounds.set(match.round, [match]);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">{season.name}</p>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Fixtures &amp; results</h1>
      </div>

      {[...rounds.entries()].map(([round, roundMatches]) => (
        <div key={round} className="space-y-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted">Round {round}</h2>
          <div className="space-y-3">
            {roundMatches.map((match) => (
              <FixtureCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}

      {rounds.size === 0 && <p className="text-sm text-muted">No fixtures scheduled yet.</p>}
    </div>
  );
}
