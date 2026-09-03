import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { createPlayerAction } from "../actions";
import { PlayerForm } from "../player-form";

export default function NewPlayerPage() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>New player</CardTitle>
      </CardHeader>
      <PlayerForm action={createPlayerAction} submitLabel="Create player" />
    </Card>
  );
}
