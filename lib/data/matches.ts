import { prisma } from "@/lib/db";
import type { CompletedMatch } from "@/lib/domain/types";
import { MatchStatus } from "@/lib/generated/prisma/enums";

function toCompletedMatch(match: {
  id: string;
  round: number;
  scheduledAt: Date;
  homePlayerId: string;
  awayPlayerId: string;
  homeScore: number | null;
  awayScore: number | null;
}): CompletedMatch | null {
  if (match.homeScore === null || match.awayScore === null) return null;
  return {
    id: match.id,
    round: match.round,
    scheduledAt: match.scheduledAt,
    homePlayerId: match.homePlayerId,
    awayPlayerId: match.awayPlayerId,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
  };
}

export async function getCompletedMatchesForSeason(seasonId: string): Promise<CompletedMatch[]> {
  const matches = await prisma.match.findMany({
    where: { seasonId, status: MatchStatus.COMPLETED },
    orderBy: [{ round: "asc" }, { scheduledAt: "asc" }],
  });
  return matches.map(toCompletedMatch).filter((m): m is CompletedMatch => m !== null);
}

export async function getCompletedMatchesForPlayer(
  seasonId: string,
  playerId: string,
): Promise<CompletedMatch[]> {
  const matches = await getCompletedMatchesForSeason(seasonId);
  return matches.filter((m) => m.homePlayerId === playerId || m.awayPlayerId === playerId);
}

export function getUpcomingFixturesForSeason(seasonId: string) {
  return prisma.match.findMany({
    where: { seasonId, status: MatchStatus.SCHEDULED },
    orderBy: [{ round: "asc" }, { scheduledAt: "asc" }],
    include: { homePlayer: true, awayPlayer: true },
  });
}

export function getMatchesForSeasonGroupedByRound(seasonId: string) {
  return prisma.match.findMany({
    where: { seasonId },
    orderBy: [{ round: "asc" }, { scheduledAt: "asc" }],
    include: { homePlayer: true, awayPlayer: true },
  });
}

export function getMatchById(matchId: string) {
  return prisma.match.findUnique({
    where: { id: matchId },
    include: { homePlayer: true, awayPlayer: true, season: true },
  });
}
