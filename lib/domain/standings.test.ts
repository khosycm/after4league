import { describe, expect, it } from "vitest";
import { computeStandings } from "@/lib/domain/standings";
import type { CompletedMatch, PointsConfig, RosterPlayer } from "@/lib/domain/types";

const pointsConfig: PointsConfig = { win: 3, draw: 1, loss: 0 };

const roster: RosterPlayer[] = [
  { id: "p1", name: "Alice", gamertag: "alice" },
  { id: "p2", name: "Bob", gamertag: "bob" },
  { id: "p3", name: "Cara", gamertag: "cara" },
];

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

describe("computeStandings", () => {
  it("ranks a player with zero matches played without erroring, all zeroed", () => {
    const rows = computeStandings([], roster, pointsConfig);
    expect(rows).toHaveLength(3);
    expect(rows.every((r) => r.played === 0 && r.points === 0)).toBe(true);
  });

  it("awards win/loss points and computes goal difference", () => {
    const rows = computeStandings([match({ id: "m1", homeScore: 2, awayScore: 0 })], roster, pointsConfig);
    const alice = rows.find((r) => r.playerId === "p1")!;
    const bob = rows.find((r) => r.playerId === "p2")!;
    expect(alice).toMatchObject({ played: 1, won: 1, drawn: 0, lost: 0, points: 3, goalDifference: 2 });
    expect(bob).toMatchObject({ played: 1, won: 0, drawn: 0, lost: 1, points: 0, goalDifference: -2 });
  });

  it("counts draws correctly for both players", () => {
    const rows = computeStandings([match({ id: "m1", homeScore: 1, awayScore: 1 })], roster, pointsConfig);
    const alice = rows.find((r) => r.playerId === "p1")!;
    const bob = rows.find((r) => r.playerId === "p2")!;
    expect(alice.points).toBe(1);
    expect(bob.points).toBe(1);
    expect(alice.drawn).toBe(1);
    expect(bob.drawn).toBe(1);
  });

  it("sorts by points, then goal difference, then goals for", () => {
    const matches: CompletedMatch[] = [
      match({ id: "m1", homePlayerId: "p1", awayPlayerId: "p2", homeScore: 5, awayScore: 0 }),
      match({ id: "m2", homePlayerId: "p3", awayPlayerId: "p2", homeScore: 1, awayScore: 0 }),
      match({ id: "m3", homePlayerId: "p1", awayPlayerId: "p3", homeScore: 0, awayScore: 0 }),
    ];
    const rows = computeStandings(matches, roster, pointsConfig);
    // p1: 1W 1D = 4pts, GD +5; p3: 1W 1D = 4pts, GD +1 -> p1 ranks above p3 on GD
    expect(rows.map((r) => r.playerId)).toEqual(["p1", "p3", "p2"]);
    expect(rows[0].rank).toBe(1);
    expect(rows[2].rank).toBe(3);
  });

  it("ignores matches referencing players outside the roster", () => {
    const rows = computeStandings(
      [match({ id: "m1", homePlayerId: "p1", awayPlayerId: "ghost", homeScore: 3, awayScore: 0 })],
      roster,
      pointsConfig,
    );
    expect(rows.find((r) => r.playerId === "p1")!.played).toBe(0);
  });
});
