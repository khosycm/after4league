import Link from "next/link";
import { format } from "date-fns";
import { listSeasons } from "@/lib/data/seasons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setActiveSeasonAction } from "./actions";

export default async function AdminSeasonsPage() {
  const seasons = await listSeasons();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Seasons</h1>
        <Button asChild>
          <Link href="/admin/seasons/new">New season</Link>
        </Button>
      </div>
      <div className="space-y-2">
        {seasons.map((season) => (
          <Card key={season.id} className="flex items-center justify-between p-4">
            <div>
              <Link href={`/admin/seasons/${season.id}/fixtures`} className="font-medium text-ink hover:text-accent">
                {season.name}
              </Link>
              <p className="text-sm text-muted">{format(season.startDate, "d MMM yyyy")}</p>
            </div>
            {season.isActive ? (
              <span className="rounded bg-win-surface px-2 py-1 text-xs font-semibold uppercase text-win">
                Active
              </span>
            ) : (
              <form action={setActiveSeasonAction.bind(null, season.id)}>
                <Button type="submit" variant="outline" size="sm">
                  Set active
                </Button>
              </form>
            )}
          </Card>
        ))}
        {seasons.length === 0 && <p className="text-sm text-muted">No seasons yet.</p>}
      </div>
    </div>
  );
}
