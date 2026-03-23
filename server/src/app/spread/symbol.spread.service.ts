import { prisma } from "@/db";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { Symbol } from "@prisma/client";
import httpStatus from "http-status";

const createSymbol = catchAsync(async (req, res) => {
  const data: Symbol = req.body;

  const result = await prisma.symbol.create({
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Symbol created successfully",
    data: result,
  });
});

const getAllSymbols = catchAsync(async (_, res) => {
  const result = await prisma.symbol.findMany({
    where: {
      isDeleted: false,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Symbols retrieved successfully",
    data: result,
  });
});

const getSingleSymbol = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await prisma.symbol.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Symbol retrieved successfully",
    data: result,
  });
});

const updateSymbol = catchAsync(async (req, res) => {
  const data: Partial<Symbol> = req.body;
  const id = req.params.id;
  const result = await prisma.symbol.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Symbol updated successfully",
    data: result,
  });
});

const deleteSymbol = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await prisma.symbol.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Symbol deleted successfully",
    data: result,
  });
});

export const SymbolService = {
  createSymbol,
  getAllSymbols,
  getSingleSymbol,
  updateSymbol,
  deleteSymbol,
};
