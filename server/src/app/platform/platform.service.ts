import httpStatus from "@/constants";
import { prisma } from "@/db";
import AppError from "@/helpers/errors/AppError";

import QueryBuilder from "@/helpers/prisma/query-builder";
import { deleteFromMinIO, uploadToMinIO } from "@/lib/uploadFileToStorage";
import { QueryT } from "@/types/index.types";
import {
  CreatePlatformInput,
  UpdatePlatformInput,
} from "./platform.validation";

export const getAllPlatform = async (query: QueryT) => {
  query.isDeleted = false;
  const platformQuery = new QueryBuilder(prisma.platform, query);

  const { data, meta } = await platformQuery
    .search(["title", "id"])
    .sort()
    .customFields({
      id: true,
      title: true,
      logoUrl: true,
      isDeleted: true,
    })
    .filter()
    .paginate()
    .execute();

  return { platforms: data, meta };
};

const getSinglePlatform = async (platformId: string) => {
  const platform = await prisma.platform.findUnique({
    where: { id: platformId, isDeleted: false },
    select: { id: true, logoUrl: true, title: true, createdAt: true },
  });

  if (!platform) {
    throw new AppError(httpStatus.NOT_FOUND, "Platform not found");
  }

  return { message: "Platform retrieve success", platform };
};

const createPlatform = async (
  platformData: CreatePlatformInput["body"] & { logoUrl: string },
  platformImageFile: Express.Multer.File
) => {
  const platformExists = await prisma.platform.findFirst({
    where: { title: platformData.title, isDeleted: false },
    select: { id: true },
  });

  if (platformExists) {
    throw new Error("Platform with this title already exists");
  }

  platformData.logoUrl = await uploadToMinIO(platformImageFile);

  const platform = await prisma.platform.create({
    data: platformData,
  });

  return { message: "Platform created successful", platform };
};

const updatePlatform = async (
  platformId: string,
  platformData: UpdatePlatformInput["body"] & { logoUrl: string },
  platformImageFile?: Express.Multer.File
) => {
  const platformExists = await prisma.platform.findFirst({
    where: { id: platformId, isDeleted: false },
    select: { id: true, logoUrl: true },
  });

  if (!platformExists) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Platform with this id does not exist"
    );
  }

  const platformExistWithSameTitle = await prisma.platform.findFirst({
    where: {
      title: platformData.title,
      id: {
        not: platformId,
      },
      isDeleted: false,
    },
  });

  if (platformExistWithSameTitle) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Platform exist with this id"
    );
  }

  if (platformImageFile) {
    platformData.logoUrl = await uploadToMinIO(platformImageFile);
    await deleteFromMinIO(platformExists.logoUrl);
  }

  const updatedData = await prisma.platform.update({
    where: {
      id: platformId,
      isDeleted: false,
    },
    data: platformData,
  });

  return { message: "Platform updated successful", updatedData };
};

const deletePlatform = async (platformId: string) => {
  const platformData = await prisma.platform.findUnique({
    where: { id: platformId, isDeleted: false },
    select: { logoUrl: true, title: true },
  });

  if (!platformData) {
    throw new AppError(httpStatus.NOT_FOUND, "Platform not found");
  }

  await deleteFromMinIO(platformData.logoUrl);

  await prisma.platform.update({
    where: { id: platformId, isDeleted: false },
    data: { isDeleted: true },
  });

  return { message: `Platform '${platformData.title}' deleted successfully` };
};

export const PlatformService = {
  createPlatform,
  deletePlatform,
  getAllPlatform,
  updatePlatform,
  getSinglePlatform,
};
