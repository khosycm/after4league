import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPlayerById, listRosterForSeason } from "@/lib/data/players";
import { getActiveSeason, getPointsConfig } from "@/lib/data/seasons";
import { getCompletedMatchesForSeason } from "@/lib/data/matches";
import { computeStandings } from "@/lib/domain/standings";
import { computeFormGuide, computeGoalsTrend, toPlayerMatchSummaries } from "@/lib/domain/leaderboards";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { FormGuide } from "@/components/players/form-guide";
import { GoalsTrendChart } from "@/components/players/goals-trend-chart";
import { ResultBadge } from "@/components/fixtures/result-badge";

export default async function PlayerProfilePage(props: PageProps<"/players/[playerId]">) {
  const { playerId } = await props.params;
  const player = await getPlayerById(playerId);
  if (!player) notFound();

  const season = await getActiveSeason();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide text-navy">{player.name}</h1>
        <p className="text-sm text-muted">
          @{player.gamertag}
          {player.favoriteClub && ` · ${player.favoriteClub}`}
        </p>
        {player.bio && <p className="mt-2 max-w-2xl text-sm text-ink">{player.bio}</p>}
      </div>

      {!season ? (
        <p className="text-sm text-muted">No active season to show stats for.</p>
      ) : (
        <PlayerSeasonStats seasonId={season.id} playerId={player.id} pointsConfig={getPointsConfig(season)} />
      )}
    </div>
  );
}

async function PlayerSeasonStats({
  seasonId,
  playerId,
  pointsConfig,
}: {
  seasonId: string;
  playerId: string;
  pointsConfig: ReturnType<typeof getPointsConfig>;
}) {
  const [roster, matches] = await Promise.all([
    listRosterForSeason(seasonId),
    getCompletedMatchesForSeason(seasonId),
  ]);

  const standings = computeStandings(matches, roster, pointsConfig);
  const row = standings.find((r) => r.playerId === playerId);
  const opponentNameById = Object.fromEntries(roster.map((p) => [p.id, p.name]));
  const summaries = toPlayerMatchSummaries(playerId, matches, opponentNameById);
  const form = computeFormGuide(summaries, 5);
  const trend = computeGoalsTrend(summaries, pointsConfig);

  if (!row) {
    return <p className="text-sm text-muted">Not registered for the current season.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <StatTile label="Played" value={row.played} />
        <StatTile label="Won" value={row.won} />
        <StatTile label="Drawn" value={row.drawn} />
        <StatTile label="Lost" value={row.lost} />
        <StatTile label="Goal diff" value={row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference} />
        <StatTile label="Points" value={row.points} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form</CardTitle>
        </CardHeader>
        <FormGuide summaries={form} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Points trend</CardTitle>
        </CardHeader>
        <GoalsTrendChart points={trend} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match history</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {[...summaries].reverse().map((summary) => (
            <div key={summary.matchId} className="flex items-center justify-between border-b border-card-border py-2 text-sm last:border-0">
              <div className="flex items-center gap-3">
                <ResultBadge result={summary.result} />
                <span className="font-medium text-ink">vs {summary.opponentName}</span>
              </div>
              <div className="flex items-center gap-4 text-muted">
                <span className="tabular-nums">
                  {summary.goalsFor}-{summary.goalsAgainst}
                </span>
                <span>{format(summary.scheduledAt, "d MMM")}</span>
              </div>
            </div>
          ))}
          {summaries.length === 0 && <p className="text-sm text-muted">No matches played yet.</p>}
        </div>
      </Card>
    </div>
  );
}
