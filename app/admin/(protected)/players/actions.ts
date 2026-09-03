"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";

const playerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  gamertag: z.string().trim().min(1, "Gamertag is required"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  favoriteClub: z.string().trim().optional(),
  bio: z.string().trim().optional(),
});

function readPlayerForm(formData: FormData) {
  return playerSchema.safeParse({
    name: formData.get("name"),
    gamertag: formData.get("gamertag"),
    email: formData.get("email"),
    favoriteClub: formData.get("favoriteClub"),
    bio: formData.get("bio"),
  });
}

export type PlayerFormState = { error?: string } | undefined;

export async function createPlayerAction(_prevState: PlayerFormState, formData: FormData): Promise<PlayerFormState> {
  await requireAdminSession();

  const parsed = readPlayerForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await prisma.player.create({
      data: {
        name: parsed.data.name,
        gamertag: parsed.data.gamertag,
        email: parsed.data.email || null,
        favoriteClub: parsed.data.favoriteClub || null,
        bio: parsed.data.bio || null,
      },
    });
  } catch {
    return { error: "A player with that gamertag already exists." };
  }

  revalidatePath("/players");
  revalidatePath("/admin/players");
  redirect("/admin/players");
}

export async function updatePlayerAction(
  playerId: string,
  _prevState: PlayerFormState,
  formData: FormData,
): Promise<PlayerFormState> {
  await requireAdminSession();

  const parsed = readPlayerForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const active = formData.get("active") === "on";

  try {
    await prisma.player.update({
      where: { id: playerId },
      data: {
        name: parsed.data.name,
        gamertag: parsed.data.gamertag,
        email: parsed.data.email || null,
        favoriteClub: parsed.data.favoriteClub || null,
        bio: parsed.data.bio || null,
        active,
      },
    });
  } catch {
    return { error: "A player with that gamertag already exists." };
  }

  revalidatePath("/players");
  revalidatePath(`/players/${playerId}`);
  revalidatePath("/admin/players");
  redirect("/admin/players");
}
