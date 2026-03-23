import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { AnnouncementsService } from "./announcements.service";

const getAllAnnouncementsForFirm = catchAsync(async (req, res) => {
  const data = await AnnouncementsService.getAllAnnouncementsForFirm(
    req.params.firmId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Announcements retrieved successfully",
    data,
  });
});

export const createAnnouncement = catchAsync(async (req, res) => {
  const data = await AnnouncementsService.createAnnouncement(
    req.body,
    req.file!
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Announcement created successfully",
    data, // Replace with actual announcement data
  });
});

const updateAnnouncement = catchAsync(async (req, res) => {
  const data = await AnnouncementsService.updateAnnouncement(
    req.params.announcementId,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Announcement updated successfully",
    data,
  });
});

export const AnnouncementsController = {
  getAllAnnouncementsForFirm,
  createAnnouncement,
  updateAnnouncement,
};
