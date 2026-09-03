export type PointsConfig = {
  win: number;
  draw: number;
  loss: number;
};

export type RosterPlayer = {
  id: string;
  name: string;
  gamertag: string;
};

export type CompletedMatch = {
  id: string;
  round: number;
  scheduledAt: Date;
  homePlayerId: string;
  awayPlayerId: string;
  homeScore: number;
  awayScore: number;
};

export type StandingsRow = {
  rank: number;
  playerId: string;
  name: string;
  gamertag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type MatchOutcome = "W" | "D" | "L";

export type PlayerMatchSummary = {
  matchId: string;
  round: number;
  scheduledAt: Date;
  opponentId: string;
  opponentName: string;
  goalsFor: number;
  goalsAgainst: number;
  result: MatchOutcome;
};
