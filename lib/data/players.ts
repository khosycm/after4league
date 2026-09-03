import { prisma } from "@/lib/db";
import type { RosterPlayer } from "@/lib/domain/types";

export async function listRosterForSeason(seasonId: string): Promise<RosterPlayer[]> {
  const entries = await prisma.seasonEntry.findMany({
    where: { seasonId, isActive: true },
    include: { player: true },
    orderBy: { player: { name: "asc" } },
  });
  return entries.map((entry) => ({
    id: entry.player.id,
    name: entry.player.name,
    gamertag: entry.player.gamertag,
  }));
}

export function listAllPlayers(includeInactive = false) {
  return prisma.player.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { name: "asc" },
  });
}

export function getPlayerById(playerId: string) {
  return prisma.player.findUnique({ where: { id: playerId } });
}
