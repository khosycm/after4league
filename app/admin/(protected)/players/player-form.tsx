"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { PlayerFormState } from "./actions";

type PlayerFormAction = (state: PlayerFormState, formData: FormData) => Promise<PlayerFormState>;

type PlayerFormValues = {
  name: string;
  gamertag: string;
  email: string;
  favoriteClub: string;
  bio: string;
  active?: boolean;
};

export function PlayerForm({
  action,
  defaultValues,
  submitLabel,
  showActiveToggle = false,
}: {
  action: PlayerFormAction;
  defaultValues?: PlayerFormValues;
  submitLabel: string;
  showActiveToggle?: boolean;
}) {
  const [state, formAction, pending] = useActionState<PlayerFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="gamertag">Gamertag</Label>
        <Input id="gamertag" name="gamertag" defaultValue={defaultValues?.gamertag} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues?.email} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="favoriteClub">Favorite club (optional)</Label>
        <Input id="favoriteClub" name="favoriteClub" defaultValue={defaultValues?.favoriteClub} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio (optional)</Label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={defaultValues?.bio}
          className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
      {showActiveToggle && (
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="active" defaultChecked={defaultValues?.active ?? true} />
          Active (visible on public roster)
        </label>
      )}
      {state?.error && <p className="text-sm text-loss">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
