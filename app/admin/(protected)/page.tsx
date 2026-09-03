import Link from "next/link";
import { format } from "date-fns";
import { getActiveSeason } from "@/lib/data/seasons";
import { getUpcomingFixturesForSeason } from "@/lib/data/matches";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const season = await getActiveSeason();
  const upcoming = season ? await getUpcomingFixturesForSeason(season.id) : [];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Admin dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Players</CardTitle>
            <CardDescription>Manage the roster.</CardDescription>
          </CardHeader>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/players">Manage players</Link>
          </Button>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Seasons</CardTitle>
            <CardDescription>Create seasons, manage rosters and fixtures.</CardDescription>
          </CardHeader>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/seasons">Manage seasons</Link>
          </Button>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fixtures awaiting a result</CardTitle>
          <CardDescription>{season ? season.name : "No active season"}</CardDescription>
        </CardHeader>
        <div className="space-y-2">
          {upcoming.map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between border-b border-card-border py-2 text-sm last:border-0"
            >
              <span>
                {match.homePlayer.name} vs {match.awayPlayer.name}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-muted">{format(match.scheduledAt, "d MMM, HH:mm")}</span>
                <Link href={`/admin/fixtures/${match.id}/result`} className="font-medium text-accent hover:underline">
                  Enter result
                </Link>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-muted">
              {season ? "No fixtures scheduled." : "Set an active season to see its fixtures here."}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
