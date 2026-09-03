import { describe, expect, it } from "vitest";
import { generateRoundRobinFixtures } from "@/lib/domain/fixtures";

function pairKey(a: string, b: string) {
  return [a, b].sort().join("-");
}

describe("generateRoundRobinFixtures", () => {
  it("returns no fixtures for fewer than two players", () => {
    expect(generateRoundRobinFixtures([])).toEqual([]);
    expect(generateRoundRobinFixtures(["p1"])).toEqual([]);
  });

  it("pairs every player with every other player exactly once (even roster)", () => {
    const players = ["p1", "p2", "p3", "p4"];
    const fixtures = generateRoundRobinFixtures(players);
    expect(fixtures).toHaveLength(6);

    const seen = new Set<string>();
    for (const f of fixtures) {
      const key = pairKey(f.homePlayerId, f.awayPlayerId);
      expect(seen.has(key)).toBe(false);
      seen.add(key);
      expect(f.homePlayerId).not.toBe(f.awayPlayerId);
    }
  });

  it("handles an odd roster by dropping the bye, one match per round", () => {
    const players = ["p1", "p2", "p3"];
    const fixtures = generateRoundRobinFixtures(players);
    expect(fixtures).toHaveLength(3);

    const roundCounts = new Map<number, number>();
    for (const f of fixtures) {
      roundCounts.set(f.round, (roundCounts.get(f.round) ?? 0) + 1);
    }
    expect([...roundCounts.values()]).toEqual([1, 1, 1]);
  });

  it("never pairs a player against themselves and produces no duplicate pairings for a larger roster", () => {
    const players = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"];
    const fixtures = generateRoundRobinFixtures(players);
    const seen = new Set<string>();
    for (const f of fixtures) {
      expect(f.homePlayerId).not.toBe(f.awayPlayerId);
      const key = pairKey(f.homePlayerId, f.awayPlayerId);
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    // n(n-1)/2 total pairings for a full round-robin
    expect(fixtures).toHaveLength((players.length * (players.length - 1)) / 2);
  });
});
