import httpStatus from "@/constants";
import { prisma } from "@/db";
import AppError from "@/helpers/errors/AppError";

import QueryBuilder from "@/helpers/prisma/query-builder";
import { deleteFromMinIO, uploadToMinIO } from "@/lib/uploadFileToStorage";
import { QueryT } from "@/types/index.types";
import {
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
} from "./payment-method.validation";

export const getAllPaymentMethod = async (query: QueryT) => {
  const paymentMethodQuery = new QueryBuilder(prisma.paymentMethod, query);

  query.isDeleted = false;
  const { data, meta } = await paymentMethodQuery
    .search(["title", "id"])
    .filter()
    .sort()
    .customFields({
      id: true,
      title: true,
      logoUrl: true,
    })
    .paginate()
    .execute();

  return { data, meta };
};

const getSinglePaymentMethod = async (paymentMethodId: string) => {
  const paymentMethod = await prisma.paymentMethod.findUnique({
    where: { id: paymentMethodId, isDeleted: false },
    select: { id: true, logoUrl: true, title: true, createdAt: true },
  });

  if (!paymentMethod) {
    throw new AppError(httpStatus.NOT_FOUND, "PaymentMethod not found");
  }

  return { message: "PaymentMethod retrieve success", paymentMethod };
};

const createPaymentMethod = async (
  paymentMethodData: CreatePaymentMethodInput["body"] & { logoUrl: string },
  paymentMethodImageFile: Express.Multer.File
) => {
  const paymentMethodExists = await prisma.paymentMethod.findFirst({
    where: { title: paymentMethodData.title, isDeleted: false },
    select: { id: true },
  });

  if (paymentMethodExists) {
    throw new Error("PaymentMethod with this title already exists");
  }

  paymentMethodData.logoUrl = await uploadToMinIO(paymentMethodImageFile);

  const paymentMethod = await prisma.paymentMethod.create({
    data: paymentMethodData,
  });

  return { message: "PaymentMethod created successful", paymentMethod };
};

const updatePaymentMethod = async (
  paymentMethodId: string,
  paymentMethodData: UpdatePaymentMethodInput["body"] & { logoUrl: string },
  paymentMethodImageFile?: Express.Multer.File
) => {
  const paymentMethodExists = await prisma.paymentMethod.findFirst({
    where: { id: paymentMethodId, isDeleted: false },
    select: { id: true, logoUrl: true },
  });

  if (!paymentMethodExists) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "PaymentMethod with this id does not exist"
    );
  }

  const paymentMethodExistWithSameTitle = await prisma.paymentMethod.findFirst({
    where: {
      title: paymentMethodData.title,
      id: {
        not: paymentMethodId,
      },
      isDeleted: false,
    },
  });

  if (paymentMethodExistWithSameTitle) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "PaymentMethod exist with this id"
    );
  }

  if (paymentMethodImageFile) {
    await deleteFromMinIO(paymentMethodExists.logoUrl);
    paymentMethodData.logoUrl = await uploadToMinIO(paymentMethodImageFile);
  }

  const updatedData = await prisma.paymentMethod.update({
    where: {
      id: paymentMethodId,
      isDeleted: false,
    },
    data: paymentMethodData,
  });

  return { message: "PaymentMethod updated successful", updatedData };
};

const deletePaymentMethod = async (paymentMethodId: string) => {
  const paymentMethodData = await prisma.paymentMethod.findUnique({
    where: { id: paymentMethodId, isDeleted: false },
    select: { logoUrl: true, title: true },
  });

  if (!paymentMethodData) {
    throw new AppError(httpStatus.NOT_FOUND, "PaymentMethod not found");
  }

  await prisma.paymentMethod.update({
    where: { id: paymentMethodId, isDeleted: false },
    data: { isDeleted: true },
  });

  return {
    message: `PaymentMethod '${paymentMethodData.title}' deleted successfully`,
  };
};

export const PaymentMethodService = {
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethod,
  updatePaymentMethod,
  getSinglePaymentMethod,
};
