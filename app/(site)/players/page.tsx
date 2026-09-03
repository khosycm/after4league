import Link from "next/link";
import { listAllPlayers } from "@/lib/data/players";
import { Card } from "@/components/ui/card";

export default async function PlayersPage() {
  const players = await listAllPlayers();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Players</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <Link key={player.id} href={`/players/${player.id}`}>
            <Card className="hover:border-accent">
              <p className="font-heading text-lg font-semibold text-navy">{player.name}</p>
              <p className="text-sm text-muted">@{player.gamertag}</p>
              {player.favoriteClub && <p className="mt-2 text-xs text-muted">{player.favoriteClub}</p>}
            </Card>
          </Link>
        ))}
        {players.length === 0 && <p className="text-sm text-muted">No players yet.</p>}
      </div>
    </div>
  );
}
