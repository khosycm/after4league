import type { CompletedMatch, PointsConfig, RosterPlayer, StandingsRow } from "@/lib/domain/types";

export function computeStandings(
  matches: CompletedMatch[],
  roster: RosterPlayer[],
  pointsConfig: PointsConfig,
): StandingsRow[] {
  const rows = new Map<string, StandingsRow>();

  for (const player of roster) {
    rows.set(player.id, {
      rank: 0,
      playerId: player.id,
      name: player.name,
      gamertag: player.gamertag,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  for (const match of matches) {
    const home = rows.get(match.homePlayerId);
    const away = rows.get(match.awayPlayerId);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      home.points += pointsConfig.win;
      away.lost += 1;
      away.points += pointsConfig.loss;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      away.points += pointsConfig.win;
      home.lost += 1;
      home.points += pointsConfig.loss;
    } else {
      home.drawn += 1;
      home.points += pointsConfig.draw;
      away.drawn += 1;
      away.points += pointsConfig.draw;
    }
  }

  const sorted = [...rows.values()];
  for (const row of sorted) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }

  sorted.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name),
  );

  sorted.forEach((row, index) => {
    row.rank = index + 1;
  });

  return sorted;
}
