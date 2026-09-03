import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getSeasonById } from "@/lib/data/seasons";
import { listAllPlayers, listRosterForSeason } from "@/lib/data/players";
import { getMatchesForSeasonGroupedByRound } from "@/lib/data/matches";
import { MatchStatus } from "@/lib/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { generateFixturesAction, setSeasonEntryActiveAction } from "../../actions";

export default async function SeasonFixturesPage(props: PageProps<"/admin/seasons/[seasonId]/fixtures">) {
  const { seasonId } = await props.params;
  const season = await getSeasonById(seasonId);
  if (!season) notFound();

  const [allPlayers, roster, matches] = await Promise.all([
    listAllPlayers(),
    listRosterForSeason(seasonId),
    getMatchesForSeasonGroupedByRound(seasonId),
  ]);

  const rosterIds = new Set(roster.map((player) => player.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">{season.name}</h1>
        <p className="text-sm text-muted">{format(season.startDate, "d MMM yyyy")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roster ({roster.length})</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {allPlayers.map((player) => {
            const inRoster = rosterIds.has(player.id);
            return (
              <div
                key={player.id}
                className="flex items-center justify-between border-b border-card-border py-2 text-sm last:border-0"
              >
                <span>
                  {player.name} <span className="text-muted">@{player.gamertag}</span>
                </span>
                <form action={setSeasonEntryActiveAction.bind(null, seasonId, player.id, !inRoster)}>
                  <Button type="submit" variant={inRoster ? "outline" : "primary"} size="sm">
                    {inRoster ? "Remove" : "Add"}
                  </Button>
                </form>
              </div>
            );
          })}
          {allPlayers.length === 0 && (
            <p className="text-sm text-muted">No players yet — add some first.</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-baseline justify-between">
          <CardTitle>Fixtures ({matches.length})</CardTitle>
          {matches.length === 0 && roster.length >= 2 && (
            <form action={generateFixturesAction.bind(null, seasonId)}>
              <Button type="submit" size="sm">
                Generate round-robin fixtures
              </Button>
            </form>
          )}
        </CardHeader>
        <div className="space-y-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between border-b border-card-border py-2 text-sm last:border-0"
            >
              <span>
                R{match.round}: {match.homePlayer.name} vs {match.awayPlayer.name}
                {match.status === MatchStatus.COMPLETED && ` (${match.homeScore}-${match.awayScore})`}
              </span>
              <Link href={`/admin/fixtures/${match.id}/result`} className="text-sm font-medium text-accent hover:underline">
                {match.status === MatchStatus.COMPLETED ? "Edit result" : "Enter result"}
              </Link>
            </div>
          ))}
          {matches.length === 0 && <p className="text-sm text-muted">No fixtures yet.</p>}
        </div>
      </Card>
    </div>
  );
}
