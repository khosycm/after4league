import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { MatchStatus } from "../lib/generated/prisma/enums";
import bcrypt from "bcryptjs";
import { generateRoundRobinFixtures } from "../lib/domain/fixtures";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PLAYERS = [
  { id: "player-alice", name: "Alice Tanuwijaya", gamertag: "alice.tw", favoriteClub: "Man City" },
  { id: "player-budi", name: "Budi Santoso", gamertag: "budiS", favoriteClub: "Real Madrid" },
  { id: "player-cindy", name: "Cindy Wijaya", gamertag: "cindyw", favoriteClub: "Liverpool" },
  { id: "player-dedi", name: "Dedi Prasetyo", gamertag: "dediP", favoriteClub: "Bayern Munich" },
  { id: "player-eka", name: "Eka Putra", gamertag: "ekaputra", favoriteClub: "PSG" },
  { id: "player-fina", name: "Fina Amelia", gamertag: "finaA", favoriteClub: "Arsenal" },
];

async function main() {
  const passwordHash = await bcrypt.hash("changeme123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@after4league.local" },
    update: {},
    create: { email: "admin@after4league.local", passwordHash, name: "League Admin" },
  });

  for (const player of PLAYERS) {
    await prisma.player.upsert({
      where: { id: player.id },
      update: {},
      create: player,
    });
  }

  const season = await prisma.season.upsert({
    where: { id: "season-2026-office-league" },
    update: {},
    create: {
      id: "season-2026-office-league",
      name: "2026 Office League",
      startDate: new Date("2026-01-05"),
      isActive: true,
    },
  });

  for (const player of PLAYERS) {
    await prisma.seasonEntry.upsert({
      where: { playerId_seasonId: { playerId: player.id, seasonId: season.id } },
      update: {},
      create: { playerId: player.id, seasonId: season.id },
    });
  }

  const fixtures = generateRoundRobinFixtures(PLAYERS.map((p) => p.id));
  const startDate = new Date("2026-01-05T18:00:00Z");

  for (const [index, fixture] of fixtures.entries()) {
    const scheduledAt = new Date(startDate.getTime() + index * 7 * 24 * 60 * 60 * 1000);
    const isPlayed = fixture.round <= 2;

    await prisma.match.upsert({
      where: {
        seasonId_round_homePlayerId_awayPlayerId: {
          seasonId: season.id,
          round: fixture.round,
          homePlayerId: fixture.homePlayerId,
          awayPlayerId: fixture.awayPlayerId,
        },
      },
      update: {},
      create: {
        seasonId: season.id,
        round: fixture.round,
        scheduledAt,
        homePlayerId: fixture.homePlayerId,
        awayPlayerId: fixture.awayPlayerId,
        status: isPlayed ? MatchStatus.COMPLETED : MatchStatus.SCHEDULED,
        homeScore: isPlayed ? Math.floor(Math.random() * 4) : null,
        awayScore: isPlayed ? Math.floor(Math.random() * 4) : null,
      },
    });
  }

  console.log(`Seeded ${PLAYERS.length} players and ${fixtures.length} fixtures for "${season.name}".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
