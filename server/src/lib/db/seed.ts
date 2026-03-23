import { prisma } from "@/db";
import { env } from "@/env";
import { AuthType, UserRoleEnum } from "@prisma/client";
import * as bcrypt from "bcrypt";

const SUPER_ADMIN_DATA = {
  fullName: "Supe",
  email: "admin@gmail.com",
  password: "123456",
  phoneNumber: "01821558090",
  role: UserRoleEnum.SUPER_ADMIN,
  isAgreeWithTerms: true,
  isEmailVerified: true,
  authType: AuthType.EMAIL,
  isAggradedToTermsAndPolicies: true,
};

export const seedSuperAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: UserRoleEnum.SUPER_ADMIN,
      },
    });

    // If not, create one
    if (!isSuperAdminExist) {
      SUPER_ADMIN_DATA.password = await bcrypt.hash(
        env.SUPER_ADMIN_PASSWORD,
        Number(env.BCRYPT_SALT_ROUNDS) || 12
      );
      await prisma.user.create({
        data: {
          ...SUPER_ADMIN_DATA,
        },
      });
      console.log("Super Admin created successfully.");
    } else {
      return;
      //   console.log("Super Admin already exists.");
    }
  } catch (error) {
    console.error("Error seeding Super Admin:", error);
  }
};
