import { UserRoleEnum, UserStatus } from "@prisma/client";
import z from "zod";

const updateUserStatus = z.object({
  body: z
    .object({
      status: z.enum(UserStatus),
    })
    .strict(),
});

const updateUserRole = z.object({
  body: z
    .object({
      role: z.enum(UserRoleEnum),
    })
    .strict(),
});

const submitSurvey = z.object({
  body: z
    .object({
      tookChallenge: z.string(),
      tradingExperience: z.string(),
      assetsTraded: z.array(z.string()),
      country: z.string(),
    })
    .strict(),
});

const updateMyProfile = z.object({
  body: z
    .object({
      fullName: z.string().optional(),
      phoneNumber: z.string().optional(),
      location: z.string().optional(),
    })
    .strict(),
});

export const UsersValidation = {
  updateUserStatus,
  updateUserRole,
  submitSurvey,
  updateMyProfile,
};

export type SubmitSurveyInput = z.infer<typeof submitSurvey>;
export type UpdateMyProfileInput = z.infer<typeof updateMyProfile>;
