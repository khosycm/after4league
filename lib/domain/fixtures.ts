export type FixturePairing = {
  round: number;
  homePlayerId: string;
  awayPlayerId: string;
};

const BYE = "__BYE__";

/**
 * Single round-robin schedule via the circle method: one fixed player, the rest
 * rotate each round. Home/away alternates by round parity so no one gets stuck
 * always home or always away. An odd roster gets a synthetic bye slot dropped
 * from the output.
 */
export function generateRoundRobinFixtures(playerIds: string[]): FixturePairing[] {
  if (playerIds.length < 2) return [];

  const ids = [...playerIds];
  if (ids.length % 2 !== 0) ids.push(BYE);

  const n = ids.length;
  const rounds = n - 1;
  const half = n / 2;
  const fixtures: FixturePairing[] = [];
  const rotating = ids.slice(1);

  for (let round = 0; round < rounds; round++) {
    const roundIds = [ids[0], ...rotating];
    for (let i = 0; i < half; i++) {
      const a = roundIds[i];
      const b = roundIds[n - 1 - i];
      if (a === BYE || b === BYE) continue;
      const [homePlayerId, awayPlayerId] = round % 2 === 0 ? [a, b] : [b, a];
      fixtures.push({ round: round + 1, homePlayerId, awayPlayerId });
    }
    rotating.unshift(rotating.pop()!);
  }

  return fixtures;
}
