"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";
import { MatchStatus } from "@/lib/generated/prisma/enums";

const resultSchema = z
  .object({
    status: z.enum(["SCHEDULED", "COMPLETED", "POSTPONED", "CANCELLED", "WALKOVER"]),
    homeScore: z.string().optional(),
    awayScore: z.string().optional(),
    homeClubUsed: z.string().trim().optional(),
    awayClubUsed: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === MatchStatus.COMPLETED || data.status === MatchStatus.WALKOVER) {
      const home = Number(data.homeScore);
      const away = Number(data.awayScore);
      if (!data.homeScore || Number.isNaN(home) || home < 0) {
        ctx.addIssue({ code: "custom", message: "Enter a valid home score.", path: ["homeScore"] });
      }
      if (!data.awayScore || Number.isNaN(away) || away < 0) {
        ctx.addIssue({ code: "custom", message: "Enter a valid away score.", path: ["awayScore"] });
      }
    }
  });

export type ResultFormState = { error?: string } | undefined;

export async function recordResultAction(
  matchId: string,
  _prevState: ResultFormState,
  formData: FormData,
): Promise<ResultFormState> {
  const admin = await requireAdminSession();

  const parsed = resultSchema.safeParse({
    status: formData.get("status"),
    homeScore: formData.get("homeScore"),
    awayScore: formData.get("awayScore"),
    homeClubUsed: formData.get("homeClubUsed"),
    awayClubUsed: formData.get("awayClubUsed"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const isScored = parsed.data.status === MatchStatus.COMPLETED || parsed.data.status === MatchStatus.WALKOVER;

  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      status: parsed.data.status,
      homeScore: isScored ? Number(parsed.data.homeScore) : null,
      awayScore: isScored ? Number(parsed.data.awayScore) : null,
      homeClubUsed: parsed.data.homeClubUsed || null,
      awayClubUsed: parsed.data.awayClubUsed || null,
      notes: parsed.data.notes || null,
      recordedByAdminId: admin.id,
    },
  });

  revalidatePath("/fixtures");
  revalidatePath(`/fixtures/${matchId}`);
  revalidatePath("/standings");
  revalidatePath("/leaderboards");
  revalidatePath("/");
  revalidatePath(`/players/${match.homePlayerId}`);
  revalidatePath(`/players/${match.awayPlayerId}`);
  revalidatePath(`/admin/seasons/${match.seasonId}/fixtures`);
  redirect(`/admin/seasons/${match.seasonId}/fixtures`);
}
