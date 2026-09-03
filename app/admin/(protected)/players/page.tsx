import Link from "next/link";
import { listAllPlayers } from "@/lib/data/players";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminPlayersPage() {
  const players = await listAllPlayers(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Players</h1>
        <Button asChild>
          <Link href="/admin/players/new">New player</Link>
        </Button>
      </div>
      <div className="space-y-2">
        {players.map((player) => (
          <Card key={player.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink">
                {player.name} <span className="text-muted">@{player.gamertag}</span>
              </p>
              {!player.active && (
                <span className="text-xs font-semibold uppercase text-loss">Inactive</span>
              )}
            </div>
            <Link href={`/admin/players/${player.id}/edit`} className="text-sm font-medium text-accent hover:underline">
              Edit
            </Link>
          </Card>
        ))}
        {players.length === 0 && <p className="text-sm text-muted">No players yet.</p>}
      </div>
    </div>
  );
}
