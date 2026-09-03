import type {
  CompletedMatch,
  MatchOutcome,
  PlayerMatchSummary,
  PointsConfig,
  RosterPlayer,
} from "@/lib/domain/types";

export type ScorerRow = {
  playerId: string;
  name: string;
  gamertag: string;
  goals: number;
  matchesPlayed: number;
};

export function computeTopScorers(matches: CompletedMatch[], roster: RosterPlayer[]): ScorerRow[] {
  const rows = new Map<string, ScorerRow>();
  for (const player of roster) {
    rows.set(player.id, { playerId: player.id, name: player.name, gamertag: player.gamertag, goals: 0, matchesPlayed: 0 });
  }

  for (const match of matches) {
    const home = rows.get(match.homePlayerId);
    const away = rows.get(match.awayPlayerId);
    if (home) {
      home.goals += match.homeScore;
      home.matchesPlayed += 1;
    }
    if (away) {
      away.goals += match.awayScore;
      away.matchesPlayed += 1;
    }
  }

  return [...rows.values()].sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));
}

export type WinRateRow = {
  playerId: string;
  name: string;
  gamertag: string;
  played: number;
  won: number;
  winRate: number;
};

export function computeBestWinRate(
  matches: CompletedMatch[],
  roster: RosterPlayer[],
  minPlayed = 1,
): WinRateRow[] {
  const rows = new Map<string, WinRateRow>();
  for (const player of roster) {
    rows.set(player.id, { playerId: player.id, name: player.name, gamertag: player.gamertag, played: 0, won: 0, winRate: 0 });
  }

  for (const match of matches) {
    const home = rows.get(match.homePlayerId);
    const away = rows.get(match.awayPlayerId);
    if (home) {
      home.played += 1;
      if (match.homeScore > match.awayScore) home.won += 1;
    }
    if (away) {
      away.played += 1;
      if (match.awayScore > match.homeScore) away.won += 1;
    }
  }

  return [...rows.values()]
    .map((row) => ({ ...row, winRate: row.played > 0 ? row.won / row.played : 0 }))
    .filter((row) => row.played >= minPlayed)
    .sort((a, b) => b.winRate - a.winRate || b.played - a.played || a.name.localeCompare(b.name));
}

export function toPlayerMatchSummaries(
  playerId: string,
  matches: CompletedMatch[],
  opponentNameById: Record<string, string>,
): PlayerMatchSummary[] {
  const summaries: PlayerMatchSummary[] = [];

  for (const match of matches) {
    const isHome = match.homePlayerId === playerId;
    const isAway = match.awayPlayerId === playerId;
    if (!isHome && !isAway) continue;

    const opponentId = isHome ? match.awayPlayerId : match.homePlayerId;
    const goalsFor = isHome ? match.homeScore : match.awayScore;
    const goalsAgainst = isHome ? match.awayScore : match.homeScore;
    const result: MatchOutcome = goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D";

    summaries.push({
      matchId: match.id,
      round: match.round,
      scheduledAt: match.scheduledAt,
      opponentId,
      opponentName: opponentNameById[opponentId] ?? "Unknown",
      goalsFor,
      goalsAgainst,
      result,
    });
  }

  return summaries.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime() || a.round - b.round);
}

export function computeFormGuide(summaries: PlayerMatchSummary[], lastN = 5): PlayerMatchSummary[] {
  return summaries.slice(-lastN);
}

export type GoalsTrendPoint = PlayerMatchSummary & { cumulativePoints: number };

export function computeGoalsTrend(summaries: PlayerMatchSummary[], pointsConfig: PointsConfig): GoalsTrendPoint[] {
  let cumulativePoints = 0;
  return summaries.map((summary) => {
    cumulativePoints +=
      summary.result === "W" ? pointsConfig.win : summary.result === "D" ? pointsConfig.draw : pointsConfig.loss;
    return { ...summary, cumulativePoints };
  });
}
