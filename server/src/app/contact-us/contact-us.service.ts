import httpStatus from "@/constants";
import { prisma } from "@/db";
import AppError from "@/helpers/errors/AppError";

import QueryBuilder from "@/helpers/prisma/query-builder";
import { QueryT } from "@/types/index.types";
import { ContactUsStatusEnum } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { CreateContactUsInput } from "./contact-us.validation";

export const getAllContactUss = async (query: QueryT) => {
  const contactUsQuery = new QueryBuilder(prisma.contactUs, query);

  const { data, meta } = await contactUsQuery
    .search(["name", "email", "subject"])
    .sort()
    .customFields({
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profile: true,
        },
      },
      email: true,
      status: true,
      userId: true,
      message: true,
      inquiry: true,
      fullName: true,
      createdAt: true,
      contactType: true,
    })
    .paginate()
    .execute();

  return { contactUs: data, meta };
};

const getSingleContactUs = async (contactUsId: string) => {
  const contactUs = await prisma.contactUs.findUnique({
    where: { id: contactUsId },
    select: {
      id: true,
      user: true,
      email: true,
      status: true,
      userId: true,
      message: true,
      inquiry: true,
      fullName: true,
      createdAt: true,
      contactType: true,
    },
  });

  if (!contactUs) {
    throw new AppError(httpStatus.NOT_FOUND, "ContactUs not found");
  }

  return { message: "ContactUs retrieved successfully", contactUs };
};

const createContactUs = async (
  contactUsData: CreateContactUsInput["body"] & { userId?: string },
  user: JwtPayload
) => {
  if (user?.id) {
    contactUsData.userId = user.id;
  }
  const contactUs = await prisma.contactUs.create({
    data: contactUsData,
  });

  return { message: "ContactUs created successfully", contactUs };
};

const updateContactUsStatus = async (
  contactUsId: string,
  status: ContactUsStatusEnum
) => {
  const contactUsExists = await prisma.contactUs.findFirst({
    where: { id: contactUsId },
  });

  if (!contactUsExists) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Contact us not found");
  }

  const contactUs = await prisma.contactUs.update({
    where: { id: contactUsId },
    data: { status },
  });

  return { message: "Contact Us status updated successfully", contactUs };
};

const deleteContactUs = async (contactUsId: string) => {
  const contactUsExists = await prisma.contactUs.findUnique({
    where: { id: contactUsId },
  });

  if (!contactUsExists) {
    throw new AppError(httpStatus.NOT_FOUND, "ContactUs not found");
  }

  await prisma.contactUs.delete({
    where: { id: contactUsId },
  });

  return {
    message: `Contact Us from '${contactUsExists.fullName}' deleted successfully`,
  };
};

export const ContactUsService = {
  createContactUs,
  getAllContactUss,
  getSingleContactUs,
  deleteContactUs,
  updateContactUsStatus,
};
