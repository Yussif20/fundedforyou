import { prisma } from "@/db";
import AppError from "@/helpers/errors/AppError";
import QueryBuilder from "@/helpers/prisma/query-builder";
import { deleteFromMinIO, uploadToMinIO } from "@/lib/uploadFileToStorage";
import { QueryT } from "@/types/index.types";
import { UserRoleEnum, UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import { SubmitSurveyInput, UpdateMyProfileInput } from "./users.validation";

const submitSurvey = async (
  userId: string,
  surveyPayload: SubmitSurveyInput["body"]
) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hasTakenSurvey: true,
      tookChallenge: surveyPayload.tookChallenge,
      tradingExperience: surveyPayload.tradingExperience,
      assetsTraded: surveyPayload.assetsTraded,
      country: surveyPayload.country,
    },
  });

  return { message: "Survey submitted successfully" };
};

const getSurvey = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      hasTakenSurvey: true,
      tookChallenge: true,
      tradingExperience: true,
      assetsTraded: true,
      country: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const getAllUsers = async (query: QueryT) => {
  const userQuery = new QueryBuilder(prisma.user, query);

  const { data, meta } = await userQuery
    .where({ status: { not: "DELETED" } })
    .search(["fullName", "email"])
    .filter()
    .customFields({
      id: true,
      fullName: true,
      email: true,
      status: true,
      profile: true,
      location: true,
      authType: true,
      role: true,
      phoneNumber: true,
      createdAt: true,
      hasTakenSurvey: true,
      tookChallenge: true,
      tradingExperience: true,
      assetsTraded: true,
      country: true,
    })
    .paginate()
    .execute();

  return { users: data, meta };
};

const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      profile: true,
      location: true,
      authType: true,
      role: true,
      phoneNumber: true,
    },
  });

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with id ${userId} not found`
    );
  }

  return { user };
};

const changeUserStatus = async (userId: string, status: UserStatus) => {
  const userExist = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!userExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with id ${userId} not found`
    );
  }
  // Do not overwrite email/phoneNumber on soft delete: deleted users keep their
  // email so it remains visible in user management and can be reused for new signups
  // (email uniqueness is enforced only for non-deleted users via partial unique index).
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      profile: true,
      location: true,
      authType: true,
      role: true,
      phoneNumber: true,
    },
  });

  return { message: "User status updated successfully", user };
};

const updateMyProfile = async (
  userId: string,
  profileData: UpdateMyProfileInput["body"] & { profile?: string },
  newFile: Express.Multer.File | undefined
) => {
  const profile = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    select: { profile: true },
  });

  if (newFile) {
    profileData.profile = await uploadToMinIO(newFile);
    await deleteFromMinIO(profile.profile as string);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: profileData,
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      profile: true,
      location: true,
      authType: true,
      role: true,
      phoneNumber: true,
    },
  });

  return { message: "Profile updated successfully", user };
};

const changeUserRole = async (
  userId: string,
  role: UserRoleEnum,
  requestingUserId: string
) => {
  if (userId === requestingUserId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot change your own role"
    );
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `User with id ${userId} not found`);
  }

  if (user.status === "DELETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot change role of a deleted user"
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      profile: true,
      location: true,
      authType: true,
      role: true,
      phoneNumber: true,
    },
  });

  return { message: "User role updated successfully", user: updatedUser };
};

export const UsersService = {
  getAllUsers,
  getSingleUser,
  changeUserStatus,
  changeUserRole,
  submitSurvey,
  updateMyProfile,
  getSurvey,
};
