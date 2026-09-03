import Link from "next/link";
import { format } from "date-fns";
import { listSeasons } from "@/lib/data/seasons";
import { Card } from "@/components/ui/card";

export default async function SeasonsPage() {
  const seasons = await listSeasons();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Seasons</h1>
      <div className="space-y-3">
        {seasons.map((season) => (
          <Link key={season.id} href={`/seasons/${season.id}`}>
            <Card className="flex items-center justify-between hover:border-accent">
              <div>
                <p className="font-heading font-semibold text-navy">{season.name}</p>
                <p className="text-sm text-muted">
                  {format(season.startDate, "d MMM yyyy")}
                  {season.endDate && ` – ${format(season.endDate, "d MMM yyyy")}`}
                </p>
              </div>
              {season.isActive && (
                <span className="rounded bg-win-surface px-2 py-1 text-xs font-semibold uppercase text-win">
                  Active
                </span>
              )}
            </Card>
          </Link>
        ))}
        {seasons.length === 0 && <p className="text-sm text-muted">No seasons yet.</p>}
      </div>
    </div>
  );
}
