// prisma/sourceClient.ts
import { PrismaClient } from "@prisma/client";

export const sourcePrisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_SOURCE } },
});

export const destPrisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_DEST } },
});
// npx prisma db pull --url="postgresql://user:password@host:port/dest_db"
