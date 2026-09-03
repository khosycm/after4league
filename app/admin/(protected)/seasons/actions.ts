"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";
import { generateRoundRobinFixtures } from "@/lib/domain/fixtures";

const seasonSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  startDate: z.string().min(1, "Start date is required"),
});

export type SeasonFormState = { error?: string } | undefined;

export async function createSeasonAction(_prevState: SeasonFormState, formData: FormData): Promise<SeasonFormState> {
  await requireAdminSession();

  const parsed = seasonSchema.safeParse({
    name: formData.get("name"),
    startDate: formData.get("startDate"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const season = await prisma.season.create({
    data: { name: parsed.data.name, startDate: new Date(parsed.data.startDate) },
  });

  revalidatePath("/seasons");
  revalidatePath("/admin/seasons");
  redirect(`/admin/seasons/${season.id}/fixtures`);
}

export async function setActiveSeasonAction(seasonId: string) {
  await requireAdminSession();

  await prisma.$transaction([
    prisma.season.updateMany({ where: { isActive: true }, data: { isActive: false } }),
    prisma.season.update({ where: { id: seasonId }, data: { isActive: true } }),
  ]);

  revalidatePath("/");
  revalidatePath("/standings");
  revalidatePath("/fixtures");
  revalidatePath("/leaderboards");
  revalidatePath("/seasons");
  revalidatePath("/admin/seasons");
}

export async function setSeasonEntryActiveAction(seasonId: string, playerId: string, isActive: boolean) {
  await requireAdminSession();

  await prisma.seasonEntry.upsert({
    where: { playerId_seasonId: { playerId, seasonId } },
    update: { isActive },
    create: { playerId, seasonId, isActive },
  });

  revalidatePath(`/admin/seasons/${seasonId}/fixtures`);
}

export async function generateFixturesAction(seasonId: string) {
  await requireAdminSession();

  const existingMatchCount = await prisma.match.count({ where: { seasonId } });
  if (existingMatchCount > 0) return;

  const [season, entries] = await Promise.all([
    prisma.season.findUniqueOrThrow({ where: { id: seasonId } }),
    prisma.seasonEntry.findMany({ where: { seasonId, isActive: true }, select: { playerId: true } }),
  ]);

  const fixtures = generateRoundRobinFixtures(entries.map((entry) => entry.playerId));

  await prisma.$transaction(
    fixtures.map((fixture, index) =>
      prisma.match.create({
        data: {
          seasonId,
          round: fixture.round,
          scheduledAt: new Date(season.startDate.getTime() + index * 7 * 24 * 60 * 60 * 1000),
          homePlayerId: fixture.homePlayerId,
          awayPlayerId: fixture.awayPlayerId,
        },
      }),
    ),
  );

  revalidatePath(`/admin/seasons/${seasonId}/fixtures`);
  revalidatePath("/fixtures");
}
