import { notFound } from "next/navigation";
import { getSeasonById, getPointsConfig } from "@/lib/data/seasons";
import { listRosterForSeason } from "@/lib/data/players";
import { getCompletedMatchesForSeason } from "@/lib/data/matches";
import { computeStandings } from "@/lib/domain/standings";
import { StandingsTable } from "@/components/standings/standings-table";

export default async function SeasonDetailPage(props: PageProps<"/seasons/[seasonId]">) {
  const { seasonId } = await props.params;
  const season = await getSeasonById(seasonId);
  if (!season) notFound();

  const [roster, matches] = await Promise.all([
    listRosterForSeason(season.id),
    getCompletedMatchesForSeason(season.id),
  ]);
  const standings = computeStandings(matches, roster, getPointsConfig(season));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">{season.name}</h1>
        {season.isActive && <p className="text-sm font-medium text-win">Current season</p>}
      </div>
      <StandingsTable rows={standings} />
    </div>
  );
}
