import httpStatus from "@/constants";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { PlatformService } from "./platform.service";

const getAllPlatform = catchAsync(async (req, res) => {
  const data = await PlatformService.getAllPlatform(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Platforms retrieved successfully",
    data: data,
  });
});

const getSinglePlatform = catchAsync(async (req, res) => {
  const platformId = req.params.platformId;
  const data = await PlatformService.getSinglePlatform(platformId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Platform retrieved successfully",
    data: data,
  });
});

const createPlatform = catchAsync(async (req, res) => {
  const logoFile = req.file as Express.Multer.File;
  const data = await PlatformService.createPlatform(req.body, logoFile);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Platform created successfully",
    data: data,
  });
});

const updatePlatform = catchAsync(async (req, res) => {
  const logoFile = req.file as Express.Multer.File;
  const platformId = req.params.platformId;
  const data = await PlatformService.updatePlatform(
    platformId,
    req.body,
    logoFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Platform updated successfully",
    data: data,
  });
});

const deletePlatform = catchAsync(async (req, res) => {
  const platformId = req.params.platformId;
  const data = await PlatformService.deletePlatform(platformId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Platform deleted successfully",
    data: data,
  });
});

export const PlatformController = {
  createPlatform,
  deletePlatform,
  getAllPlatform,
  getSinglePlatform,
  updatePlatform,
};
