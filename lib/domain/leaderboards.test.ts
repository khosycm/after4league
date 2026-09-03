import { describe, expect, it } from "vitest";
import {
  computeBestWinRate,
  computeFormGuide,
  computeGoalsTrend,
  computeTopScorers,
  toPlayerMatchSummaries,
} from "@/lib/domain/leaderboards";
import type { CompletedMatch, PointsConfig, RosterPlayer } from "@/lib/domain/types";

const pointsConfig: PointsConfig = { win: 3, draw: 1, loss: 0 };

const roster: RosterPlayer[] = [
  { id: "p1", name: "Alice", gamertag: "alice" },
  { id: "p2", name: "Bob", gamertag: "bob" },
];

const opponentNameById = { p1: "Alice", p2: "Bob" };

function match(overrides: Partial<CompletedMatch>): CompletedMatch {
  return {
    id: "m1",
    round: 1,
    scheduledAt: new Date("2026-01-01"),
    homePlayerId: "p1",
    awayPlayerId: "p2",
    homeScore: 1,
    awayScore: 0,
    ...overrides,
  };
}

describe("computeTopScorers", () => {
  it("sums goals across home and away appearances", () => {
    const matches = [
      match({ id: "m1", homeScore: 2, awayScore: 1 }),
      match({ id: "m2", homePlayerId: "p2", awayPlayerId: "p1", homeScore: 3, awayScore: 0 }),
    ];
    const rows = computeTopScorers(matches, roster);
    expect(rows.find((r) => r.playerId === "p1")!.goals).toBe(2);
    expect(rows.find((r) => r.playerId === "p2")!.goals).toBe(4);
  });
});

describe("computeBestWinRate", () => {
  it("filters out players below the minimum played threshold", () => {
    const matches = [match({ id: "m1", homeScore: 1, awayScore: 0 })];
    const rows = computeBestWinRate(matches, roster, 1);
    expect(rows.map((r) => r.playerId).sort()).toEqual(["p1", "p2"]);
    const rowsStrict = computeBestWinRate(matches, roster, 2);
    expect(rowsStrict).toHaveLength(0);
  });

  it("computes win rate as wins over matches played", () => {
    const matches = [
      match({ id: "m1", homeScore: 1, awayScore: 0 }),
      match({ id: "m2", homeScore: 0, awayScore: 1 }),
    ];
    const rows = computeBestWinRate(matches, roster, 1);
    const alice = rows.find((r) => r.playerId === "p1")!;
    expect(alice.played).toBe(2);
    expect(alice.won).toBe(1);
    expect(alice.winRate).toBeCloseTo(0.5);
  });
});

describe("player match summaries, form guide, goals trend", () => {
  const matches = [
    match({ id: "m1", round: 1, scheduledAt: new Date("2026-01-01"), homeScore: 2, awayScore: 0 }),
    match({ id: "m2", round: 2, scheduledAt: new Date("2026-01-08"), homePlayerId: "p2", awayPlayerId: "p1", homeScore: 1, awayScore: 1 }),
    match({ id: "m3", round: 3, scheduledAt: new Date("2026-01-15"), homeScore: 0, awayScore: 2 }),
  ];

  it("normalizes matches to the player's perspective in chronological order", () => {
    const summaries = toPlayerMatchSummaries("p1", matches, opponentNameById);
    expect(summaries.map((s) => s.result)).toEqual(["W", "D", "L"]);
    expect(summaries.map((s) => s.opponentName)).toEqual(["Bob", "Bob", "Bob"]);
  });

  it("returns only the last N results for the form guide", () => {
    const summaries = toPlayerMatchSummaries("p1", matches, opponentNameById);
    const form = computeFormGuide(summaries, 2);
    expect(form.map((s) => s.result)).toEqual(["D", "L"]);
  });

  it("accumulates points across the goals trend", () => {
    const summaries = toPlayerMatchSummaries("p1", matches, opponentNameById);
    const trend = computeGoalsTrend(summaries, pointsConfig);
    expect(trend.map((t) => t.cumulativePoints)).toEqual([3, 4, 4]);
  });
});
