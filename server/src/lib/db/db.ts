import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      emailVerificationToken: true,
      emailVerificationTokenExpires: true,
      isAgreeWithTerms: true,
    },
    userOTP: {
      code: false,
    },
  },
});

export const insecurePrisma = new PrismaClient();
