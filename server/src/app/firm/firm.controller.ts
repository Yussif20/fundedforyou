import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { FirmParams } from "./firm.interface";
import { FirmService } from "./firm.service";

const getSingleFirm = catchAsync(async (req, res) => {
  const { firmId } = req.params;

  const data = await FirmService.getSingleFirm(firmId, req.query, (req as any).user?.role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Firm retrieved successfully",
    data: data,
  });
});

const createFirm = catchAsync(async (req, res) => {
  const logoFile = req.file as Express.Multer.File;
  const data = await FirmService.createFirm(req.body, logoFile);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Firm created successfully",
    data: data,
  });
});

const updatePropFirm = catchAsync(async (req, res) => {
  const { firmId } = req.params;
  const logoFile = req.file as Express.Multer.File | undefined;
  const data = await FirmService.updatePropFirm(firmId, req.body, logoFile);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Firm updated successfully",
    data: data,
  });
});

const getAllFirms = catchAsync(async (req, res) => {
  const data = await FirmService.getAllFirms(req.query as FirmParams, (req as any).user?.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Firms retrieved successfully",
    ...data,
  });
});

const deleteFirm = catchAsync(async (req, res) => {
  const { firmId } = req.params;

  const data = await FirmService.deleteFirm(firmId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Firm deleted successfully",
    data: data,
  });
});

const changeIndexOfFirm = catchAsync(async (req, res) => {
  const { firmId } = req.params;
  const { index } = req.body;

  const data = await FirmService.changeIndexOfFirm(firmId, index);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Firm index changed successfully",
    data: data,
  });
});

export const FirmController = {
  createFirm,
  getAllFirms,
  updatePropFirm,
  getSingleFirm,
  deleteFirm,
  changeIndexOfFirm,
};
