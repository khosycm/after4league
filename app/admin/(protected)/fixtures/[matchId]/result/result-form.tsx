"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { recordResultAction, type ResultFormState } from "./actions";

const STATUS_OPTIONS = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "POSTPONED", label: "Postponed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "WALKOVER", label: "Walkover" },
];

type ResultFormValues = {
  status: string;
  homeScore: string;
  awayScore: string;
  homeClubUsed: string;
  awayClubUsed: string;
  notes: string;
};

export function ResultForm({ matchId, defaultValues }: { matchId: string; defaultValues: ResultFormValues }) {
  const boundAction = recordResultAction.bind(null, matchId);
  const [state, formAction, pending] = useActionState<ResultFormState, FormData>(boundAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues.status}
          className="h-10 w-full rounded-md border border-card-border bg-card px-3 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="homeScore">Home score</Label>
          <Input id="homeScore" name="homeScore" type="number" min={0} defaultValue={defaultValues.homeScore} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="awayScore">Away score</Label>
          <Input id="awayScore" name="awayScore" type="number" min={0} defaultValue={defaultValues.awayScore} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="homeClubUsed">Home club (optional)</Label>
          <Input id="homeClubUsed" name="homeClubUsed" defaultValue={defaultValues.homeClubUsed} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="awayClubUsed">Away club (optional)</Label>
          <Input id="awayClubUsed" name="awayClubUsed" defaultValue={defaultValues.awayClubUsed} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={defaultValues.notes}
          className="w-full rounded-md border border-card-border bg-card px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
      {state?.error && <p className="text-sm text-loss">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save result"}
      </Button>
    </form>
  );
}
