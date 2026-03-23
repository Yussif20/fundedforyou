import catchAsync from "@/utils/catchAsync";
import { SpreadSymbolValueService } from "./spreadSymbolValue.service";
import { SymbolService } from "./symbol.spread.service";
import { Spread } from "@prisma/client";
import { prisma } from "@/db";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "@/constants";
import QueryBuilder from "@/helpers/prisma/query-builder";

const createSpread = catchAsync(async (req, res) => {
  const data: Spread = req.body;

  await prisma.firm.findUniqueOrThrow({
    where: {
      id: data.firmId,
      isDeleted: false,
    },
    select: { id: true },
  });

  await prisma.platform.findUniqueOrThrow({
    where: {
      id: data.platformId,
    },
    select: { id: true },
  });

  const result = await prisma.spread.create({
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Spread created successfully",
    data: result,
  });
});

const updateSpread = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data: Partial<Spread> = req.body;

  if (data.firmId) {
    await prisma.firm.findUniqueOrThrow({
      where: {
        id: data.firmId,
        isDeleted: false,
      },
      select: { id: true },
    });
  }

  if (data.platformId) {
    await prisma.platform.findUniqueOrThrow({
      where: {
        id: data.platformId,
      },
      select: { id: true },
    });
  }

  const result = await prisma.spread.update({
    where: { id },
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Spread updated successfully",
    data: result,
  });
});

const deleteSpread = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await prisma.spread.update({
    where: { id },
    data: { isDeleted: true },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Spread deleted successfully",
    data: result,
  });
});

const getAllFirmsAndSpread = catchAsync(async (req, res) => {
  const query: Record<string, unknown> = req.query;
  query.isDeleted = false;
  const spreadQuery = new QueryBuilder(prisma.spread, query);
  const result = await spreadQuery
    .search(["firm.title", "platform.title"])
    .customFields({
      id: true,
      type: true,
      platform: true,
      spreadSymbolValues: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          maxValue: true,
          minValue: true,
          symbolId: true,
        },
      },
      firm: {
        select: {
          id: true,
          title: true,
          logoUrl: true,
        },
      },
    })
    .filter()
    .sort()
    .paginate()
    .exclude()
    .execute();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Firms and spreads fetched successfully",
    ...result,
  });
});

const getSingleFirmAndSpread = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await prisma.spread.findUniqueOrThrow({
    where: {
      isDeleted: false,
      id,
    },
    select: {
      id: true,
      type: true,
      platform: true,
      spreadSymbolValues: {
        where: {
          isDeleted: false,
        },
        select: {
          id: true,
          maxValue: true,
          minValue: true,
          symbolId: true,
        },
      },
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Firm and spreads fetched successfully",
    data: result,
  });
});

export const SpreadService = {
  updateSpread,
  createSpread,
  deleteSpread,
  ...SpreadSymbolValueService,
  ...SymbolService,
  getAllFirmsAndSpread,
  getSingleFirmAndSpread,
};
