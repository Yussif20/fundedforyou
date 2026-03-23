import { prisma } from "@/db";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "@/constants";
import { SpreadSymbolValue } from "@prisma/client";
import AppError from "@/helpers/errors/AppError";

// ✅ CREATE
const createSymbolValue = catchAsync(async (req, res) => {
  const data: SpreadSymbolValue = req.body;

  if (data.maxValue < data.minValue) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Max value cannot be smaller than Min value"
    );
  }

  // ✅ Check Firm
  await prisma.spread.findUniqueOrThrow({
    where: {
      id: data.spreadId,
      isDeleted: false,
    },
    select: { id: true },
  });

  // ✅ Check Symbol
  await prisma.symbol.findUniqueOrThrow({
    where: {
      id: data.symbolId,
      isDeleted: false,
    },
    select: { id: true },
  });

  const isExistWithSameSpreadAndSymbol =
    await prisma.spreadSymbolValue.findFirst({
      where: {
        spreadId: data.spreadId,
        symbolId: data.symbolId,
        isDeleted: false,
      },
    });

  if (isExistWithSameSpreadAndSymbol) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Spread symbol value already exists"
    );
  }

  const result = await prisma.spreadSymbolValue.create({
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Spread created successfully",
    data: result,
  });
});

// ✅ GET ALL
const getAllSymbolValueBySpreadId = catchAsync(async (req, res) => {
  const result = await prisma.spreadSymbolValue.findMany({
    where: {
      spreadId: req.params.id,
      isDeleted: false,
    },
    select: {
      symbolId: true,
      minValue: true,
      maxValue: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Spread not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Spreads retrieved successfully",
    data: result,
  });
});

// ✅ GET SINGLE
const getSingleSymbolValue = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await prisma.spreadSymbolValue.findUnique({
    where: { id, isDeleted: false },
    include: {
      spread: {
        select: {
          id: true,
          firmId: true,
        },
      },
      symbol: {
        select: {
          id: true,
          countries: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Spread not found");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Spread retrieved successfully",
    data: result,
  });
});

// ✅ UPDATE
const updateSymbolValue = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data: Partial<SpreadSymbolValue> = req.body;

  await prisma.spreadSymbolValue.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });

  if (
    data.maxValue !== undefined &&
    data.minValue !== undefined &&
    data.maxValue < data.minValue
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Max value cannot be smaller than Min value"
    );
  }

  const result = await prisma.spreadSymbolValue.update({
    where: { id },
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Symbol value updated successfully",
    data: result,
  });
});

// ✅ DELETE (Soft Delete)
const deleteSymbolValue = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await prisma.spreadSymbolValue.update({
    where: { id },
    data: { isDeleted: true },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Symbol value deleted successfully",
    data: result,
  });
});

export const SpreadSymbolValueService = {
  createSymbolValue,
  getAllSymbolValueBySpreadId,
  getSingleSymbolValue,
  updateSymbolValue,
  deleteSymbolValue,
};
