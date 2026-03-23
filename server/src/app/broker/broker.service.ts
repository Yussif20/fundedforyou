import httpStatus from "@/constants";
import { prisma } from "@/db";
import AppError from "@/helpers/errors/AppError";

import QueryBuilder from "@/helpers/prisma/query-builder";
import { deleteFromMinIO, uploadToMinIO } from "@/lib/uploadFileToStorage";
import { QueryT } from "@/types/index.types";
import { CreateBrokerInput, UpdateBrokerInput } from "./broker.validation";

export const getAllBroker = async (query: QueryT) => {
  query.isDeleted = false;
  const brokerQuery = new QueryBuilder(prisma.broker, query);

  const { data, meta } = await brokerQuery
    .search(["title", "id"])
    .sort()
    .customFields({
      id: true,
      title: true,
      logoUrl: true,
    })
    .filter()
    .paginate()
    .execute();

  return { brokers: data, meta };
};

const getSingleBroker = async (brokerId: string) => {
  const broker = await prisma.broker.findUnique({
    where: { id: brokerId, isDeleted: false },
    select: { id: true, logoUrl: true, title: true, createdAt: true },
  });

  if (!broker) {
    throw new AppError(httpStatus.NOT_FOUND, "Broker not found");
  }

  return { message: "Broker retrieve success", broker };
};

const createBroker = async (
  brokerData: CreateBrokerInput["body"] & { logoUrl: string },
  brokerImageFile: Express.Multer.File
) => {
  const brokerExists = await prisma.broker.findFirst({
    where: { title: brokerData.title, isDeleted: false },
    select: { id: true },
  });

  if (brokerExists) {
    throw new Error("Broker with this title already exists");
  }

  brokerData.logoUrl = await uploadToMinIO(brokerImageFile);

  const broker = await prisma.broker.create({
    data: brokerData,
  });

  return { message: "Broker created successful", broker };
};

const updateBroker = async (
  brokerId: string,
  brokerData: UpdateBrokerInput["body"] & { logoUrl: string },
  brokerImageFile?: Express.Multer.File
) => {
  const brokerExists = await prisma.broker.findFirst({
    where: { id: brokerId, isDeleted: false },
    select: { id: true, logoUrl: true },
  });

  if (!brokerExists) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Broker with this title does not exist"
    );
  }

  const brokerExistWithSameTitle = await prisma.broker.findFirst({
    where: {
      title: brokerData.title,
      id: {
        not: brokerId,
      },
      isDeleted: false,
    },
  });

  if (brokerExistWithSameTitle) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Broker exist with this id");
  }

  if (brokerImageFile) {
    await deleteFromMinIO(brokerExists.logoUrl);
    brokerData.logoUrl = await uploadToMinIO(brokerImageFile);
  }

  const updatedData = await prisma.broker.update({
    where: {
      id: brokerId,
    },
    data: brokerData,
  });

  return { message: "Broker updated successful", updatedData };
};

const deleteBroker = async (brokerId: string) => {
  const brokerData = await prisma.broker.findUnique({
    where: { id: brokerId, isDeleted: false },
    select: { logoUrl: true, title: true },
  });

  if (!brokerData) {
    throw new AppError(httpStatus.NOT_FOUND, "Broker not found");
  }

  await deleteFromMinIO(brokerData.logoUrl);

  await prisma.broker.update({
    where: { id: brokerId, isDeleted: false },
    data: { isDeleted: true },
  });

  return { message: `Broker '${brokerData.title}' deleted successfully` };
};

export const BrokerService = {
  createBroker,
  deleteBroker,
  getAllBroker,
  updateBroker,
  getSingleBroker,
};
