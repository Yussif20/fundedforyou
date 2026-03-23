/**
 * One-time migration script to populate drawDownProgramTypeMap for existing firms.
 * For each firm, assigns all of the firm's programTypes to each drawDown entry.
 * Skips firms that already have a non-empty map.
 *
 * Usage: npx tsx scripts/migrate-drawdown-map.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const firms = await prisma.firm.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      drawDowns: true,
      programTypes: true,
      drawDownProgramTypeMap: true,
    },
  });

  let updated = 0;
  let skipped = 0;

  for (const firm of firms) {
    const existingMap = firm.drawDownProgramTypeMap as Record<string, string[]> | null;

    // Skip if already has a non-empty map
    if (existingMap && typeof existingMap === "object" && Object.keys(existingMap).length > 0) {
      skipped++;
      continue;
    }

    if (firm.drawDowns.length === 0) {
      skipped++;
      continue;
    }

    // Build map: each drawDown gets all programTypes
    const map: Record<string, string[]> = {};
    for (const dd of firm.drawDowns) {
      map[dd] = [...firm.programTypes];
    }

    await prisma.firm.update({
      where: { id: firm.id },
      data: { drawDownProgramTypeMap: map },
    });

    updated++;
    console.log(`Updated "${firm.title}": ${JSON.stringify(map)}`);
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
