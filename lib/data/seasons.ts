import { prisma } from "@/lib/db";
import type { PointsConfig } from "@/lib/domain/types";

export function getPointsConfig(season: {
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
}): PointsConfig {
  return { win: season.pointsForWin, draw: season.pointsForDraw, loss: season.pointsForLoss };
}

export function getActiveSeason() {
  return prisma.season.findFirst({ where: { isActive: true }, orderBy: { startDate: "desc" } });
}

export function getSeasonById(seasonId: string) {
  return prisma.season.findUnique({ where: { id: seasonId } });
}

export function listSeasons() {
  return prisma.season.findMany({ orderBy: { startDate: "desc" } });
}
