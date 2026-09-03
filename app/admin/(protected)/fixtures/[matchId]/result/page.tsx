import { notFound } from "next/navigation";
import { getMatchById } from "@/lib/data/matches";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultForm } from "./result-form";

export default async function ResultEntryPage(props: PageProps<"/admin/fixtures/[matchId]/result">) {
  const { matchId } = await props.params;
  const match = await getMatchById(matchId);
  if (!match) notFound();

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>
          {match.homePlayer.name} vs {match.awayPlayer.name}
        </CardTitle>
      </CardHeader>
      <ResultForm
        matchId={match.id}
        defaultValues={{
          status: match.status,
          homeScore: match.homeScore?.toString() ?? "",
          awayScore: match.awayScore?.toString() ?? "",
          homeClubUsed: match.homeClubUsed ?? "",
          awayClubUsed: match.awayClubUsed ?? "",
          notes: match.notes ?? "",
        }}
      />
    </Card>
  );
}
