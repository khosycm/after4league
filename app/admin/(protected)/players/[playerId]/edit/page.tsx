import { notFound } from "next/navigation";
import { getPlayerById } from "@/lib/data/players";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePlayerAction } from "../../actions";
import { PlayerForm } from "../../player-form";

export default async function EditPlayerPage(props: PageProps<"/admin/players/[playerId]/edit">) {
  const { playerId } = await props.params;
  const player = await getPlayerById(playerId);
  if (!player) notFound();

  const boundAction = updatePlayerAction.bind(null, playerId);

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Edit player</CardTitle>
      </CardHeader>
      <PlayerForm
        action={boundAction}
        submitLabel="Save changes"
        showActiveToggle
        defaultValues={{
          name: player.name,
          gamertag: player.gamertag,
          email: player.email ?? "",
          favoriteClub: player.favoriteClub ?? "",
          bio: player.bio ?? "",
          active: player.active,
        }}
      />
    </Card>
  );
}
