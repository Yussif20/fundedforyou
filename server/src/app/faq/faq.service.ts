import httpStatus from "@/constants";
import { prisma } from "@/db";
import AppError from "@/helpers/errors/AppError";
import QueryBuilder from "@/helpers/prisma/query-builder";
import { QueryT } from "@/types/index.types";
import {
  CreateFAQInput,
  CreateManyFAQInput,
  UpdateFAQInput,
} from "./faq.validation";

const getAllFaq = async (query: QueryT) => {
  query.sort = "index";
  const faqQuery = new QueryBuilder(prisma.fAQ, query);


  const { data, meta } = await faqQuery
    .search(["question", "id"])
    .sort()
    .customFields({
      id: true,
      question: true,
      answer: true,
      createdAt: true,
      answerArabic: true,
      questionArabic: true,
      index: true,
      mobileFontSize: true,
    })
    .paginate()
    .execute();

  return { data, meta };
};

const getSingleFaq = async (faqId: string) => {
  const faq = await prisma.fAQ.findUnique({
    where: { id: faqId },
    select: { id: true, question: true, answer: true, createdAt: true, mobileFontSize: true },
  });

  if (!faq) {
    throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
  }

  return { message: "FAQ retrieved successfully", faq };
};

const createFaq = async (faqData: CreateFAQInput["body"]) => {
  const faqExists = await prisma.fAQ.findFirst({
    where: { question: faqData.question },
    select: { id: true },
  });

  const lastIndex = await prisma.fAQ.findFirst({
    orderBy: {
      index: "desc",
    },
  });
  const index = lastIndex ? lastIndex.index + 1 : 0;

  if (faqExists) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "FAQ with this question already exists"
    );
  }

  const createdFaq = await prisma.fAQ.create({
    data: {
      ...faqData,
      index,
    },
  });

  return { message: "FAQ created successfully", faq: createdFaq };
};

const createManyFaqs = async (faqData: CreateManyFAQInput["body"]) => {
  const lastIndex = await prisma.fAQ.findFirst({
    orderBy: {
      index: "desc",
    },
  });
  const index = lastIndex ? lastIndex.index + 1 : 0;
  const createdFaqs = await prisma.fAQ.createMany({
    data: faqData.faqs.map((faq, idx) => ({
      ...faq,
      index: index + idx,
    })),
  });

  return { message: "FAQs created successfully", faqs: createdFaqs };
};

const deleteFaq = async (faqId: string) => {
  const faq = await prisma.fAQ.findUnique({
    where: { id: faqId },
    select: { id: true },
  });

  if (!faq) {
    throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
  }

  await prisma.fAQ.delete({
    where: { id: faqId },
  });

  return { message: "FAQ deleted successfully" };
};

const updateFaq = async (faqId: string, faqData: UpdateFAQInput["body"]) => {
  const faqExists = await prisma.fAQ.findUnique({
    where: { id: faqId },
    select: { id: true },
  });

  if (!faqExists) {
    throw new AppError(httpStatus.NOT_FOUND, "FAQ not found");
  }

  const faqExistWithSameQuestion = await prisma.fAQ.findFirst({
    where: {
      question: faqData.question,
      id: { not: faqId },
    },
    select: { id: true },
  });

  if (faqExistWithSameQuestion) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "FAQ with this question already exists"
    );
  }

  const updatedFaq = await prisma.fAQ.update({
    where: { id: faqId },
    data: faqData,
  });

  return { message: "FAQ updated successfully", faq: updatedFaq };
};

const changeIndexOfFAQ = async (faqId: string, index: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.fAQ.findUniqueOrThrow({
      where: { id: faqId },
      select: { index: true },
    });

    const oldIndex = item.index;

    if (oldIndex === index) {
      return null;
    }

    if (index < oldIndex) {
      await tx.fAQ.updateMany({
        where: {
          index: {
            gte: index,
            lt: oldIndex,
          },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });
    } else {
      await tx.fAQ.updateMany({
        where: {
          index: {
            gt: oldIndex,
            lte: index,
          },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });
    }

    return await tx.fAQ.update({
      where: { id: faqId },
      data: { index },
    });
  });

  return result;
};


export const FAQService = {
  getAllFaq,
  getSingleFaq,
  createFaq,
  createManyFaqs,
  deleteFaq,
  updateFaq,
  changeIndexOfFAQ,
};
