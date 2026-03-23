import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting challenge names migration...");

  // Step 1: Create ChallengeName records (no transaction needed, idempotent)
  const firms = await prisma.firm.findMany({
    where: { isDeleted: false },
    select: { id: true, challengeNames: true },
  });

  console.log(`Found ${firms.length} firms to process`);

  // Check which firms already have records (so re-running is safe)
  const existingRecords = await prisma.challengeName.findMany({
    where: { isDeleted: false },
    select: { firmId: true, name: true },
  });
  const existingSet = new Set(existingRecords.map((r) => `${r.firmId}::${r.name}`));

  for (const firm of firms) {
    let created = 0;
    for (let i = 0; i < firm.challengeNames.length; i++) {
      const name = firm.challengeNames[i];
      const key = `${firm.id}::${name}`;
      if (existingSet.has(key)) continue; // skip duplicates on re-run

      await prisma.challengeName.create({
        data: {
          name,
          nameArabic: "",
          discountPercentage: 0,
          order: i,
          firmId: firm.id,
        },
      });
      created++;
    }
    console.log(`Firm ${firm.id}: ${created} created, ${firm.challengeNames.length - created} already existed`);
  }

  // Step 2: Link challenges to ChallengeName records
  const challenges = await prisma.challenge.findMany({
    where: { isDeleted: false, challengeNameId: null },
    select: { id: true, challengeName: true, firmId: true },
  });

  console.log(`Found ${challenges.length} unlinked challenges`);

  const allRecords = await prisma.challengeName.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true, firmId: true },
  });

  const lookup = new Map<string, string>();
  for (const cn of allRecords) {
    lookup.set(`${cn.firmId}::${cn.name}`, cn.id);
  }

  let linked = 0;
  for (const challenge of challenges) {
    const key = `${challenge.firmId}::${challenge.challengeName}`;
    const challengeNameId = lookup.get(key);
    if (challengeNameId) {
      await prisma.challenge.update({
        where: { id: challenge.id },
        data: { challengeNameId },
      });
      linked++;
    }
  }

  console.log(`Linked ${linked} out of ${challenges.length} unlinked challenges`);
  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
