"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { GoalsTrendPoint } from "@/lib/domain/leaderboards";

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as GoalsTrendPoint;

  return (
    <div className="rounded-md border border-card-border bg-card px-3 py-2 text-xs shadow-none">
      <p className="font-heading font-semibold text-navy">Round {point.round}</p>
      <p className="text-muted">
        {point.result === "W" ? "Won" : point.result === "D" ? "Drew" : "Lost"} vs {point.opponentName} (
        {point.goalsFor}-{point.goalsAgainst})
      </p>
      <p className="mt-1 font-semibold tabular-nums text-ink">{point.cumulativePoints} pts</p>
    </div>
  );
}

export function GoalsTrendChart({ points }: { points: GoalsTrendPoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-muted">No completed matches yet this season.</p>;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="var(--color-card-border)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="round"
            tickFormatter={(round) => `R${round}`}
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            axisLine={{ stroke: "var(--color-card-border)" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "var(--color-muted)" }}
            axisLine={{ stroke: "var(--color-card-border)" }}
            tickLine={false}
            width={32}
          />
          <Tooltip content={ChartTooltip} cursor={{ stroke: "var(--color-card-border)", strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="cumulativePoints"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--color-accent)", stroke: "var(--color-card)", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "var(--color-accent)", stroke: "var(--color-card)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
