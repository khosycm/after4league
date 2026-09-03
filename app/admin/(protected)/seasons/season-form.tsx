"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createSeasonAction, type SeasonFormState } from "./actions";

export function SeasonForm() {
  const [state, formAction, pending] = useActionState<SeasonFormState, FormData>(createSeasonAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Season name</Label>
        <Input id="name" name="name" placeholder="2026 Office League" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="startDate">Start date</Label>
        <Input id="startDate" name="startDate" type="date" required />
      </div>
      {state?.error && <p className="text-sm text-loss">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create season"}
      </Button>
    </form>
  );
}
