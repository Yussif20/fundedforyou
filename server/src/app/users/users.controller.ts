import httpStatus from "@/constants";
import AppError from "@/helpers/errors/AppError";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { UserRoleEnum } from "@prisma/client";
import { UsersService } from "./users.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UsersService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const submitSurvey = catchAsync(async (req, res) => {
  const result = await UsersService.submitSurvey(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UsersService.getSingleUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const result = await UsersService.getSingleUser(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const deleteMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  if (req.user.role == UserRoleEnum.SUPER_ADMIN)
    throw new AppError(httpStatus.BAD_REQUEST, "You can't delete super admin");

  const result = await UsersService.changeUserStatus(userId, "DELETED");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const status = req.body.status;

  if (req.user.id == userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't change your own status"
    );
  }

  const result = await UsersService.changeUserStatus(userId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.user,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const profileData = req.body;
  const newFile = req.file;

  const result = await UsersService.updateMyProfile(
    userId,
    profileData,
    newFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.user,
  });
});

const getSurvey = catchAsync(async (req, res) => {
  const result = await UsersService.getSurvey(req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Survey retrieved successfully",
    data: result,
  });
});

const changeUserRole = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { role } = req.body;

  const result = await UsersService.changeUserRole(userId, role, req.user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.user,
  });
});

export const UsersController = {
  getAllUsers,
  getSingleUser,
  getProfile,
  deleteMyProfile,
  changeUserStatus,
  changeUserRole,
  submitSurvey,
  updateMyProfile,
  getSurvey,
};
