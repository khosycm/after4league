import Link from "next/link";
import type { StandingsRow } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const HEADERS = ["#", "Player", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"] as const;

export function StandingsTable({ rows, compact = false }: { rows: StandingsRow[]; compact?: boolean }) {
  const visibleRows = compact ? rows.slice(0, 5) : rows;

  return (
    <div className="overflow-x-auto rounded-lg border border-card-border bg-card">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-card-border font-heading text-xs uppercase tracking-wide text-muted">
            {HEADERS.map((header, index) => (
              <th
                key={header}
                className={cn("px-3 py-2 font-semibold", index === 1 ? "text-left" : "text-right tabular-nums")}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.playerId} className="border-b border-card-border last:border-0">
              <td className="px-3 py-2 font-heading font-semibold text-navy tabular-nums">{row.rank}</td>
              <td className="px-3 py-2">
                <Link href={`/players/${row.playerId}`} className="font-medium text-ink hover:text-accent">
                  {row.name}
                </Link>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{row.played}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.won}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.drawn}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.lost}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.goalsFor}</td>
              <td className="px-3 py-2 text-right tabular-nums">{row.goalsAgainst}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="px-3 py-2 text-right font-heading font-bold tabular-nums">{row.points}</td>
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr>
              <td colSpan={HEADERS.length} className="px-3 py-6 text-center text-muted">
                No matches played yet this season.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
