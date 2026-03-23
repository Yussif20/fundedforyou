import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { ContactUsService } from "./contact-us.service";

const createContactUs = catchAsync(async (req, res) => {
  const result = await ContactUsService.createContactUs(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
    data: result.contactUs,
  });
});

const updateContactUsStatus = catchAsync(async (req, res) => {
  const contactUsId = req.params.contactUsId;
  const { status } = req.body;

  const result = await ContactUsService.updateContactUsStatus(
    contactUsId,
    status
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.contactUs,
  });
});

const deleteContactUs = catchAsync(async (req, res) => {
  const contactUsId = req.params.id;

  const result = await ContactUsService.deleteContactUs(contactUsId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
  });
});

const getAllContactUs = catchAsync(async (req, res) => {
  const result = await ContactUsService.getAllContactUss(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContactUss retrieved successfully",
    data: result,
  });
});

const getSingleContactUs = catchAsync(async (req, res) => {
  const contactUsId = req.params.contactUsId;

  const result = await ContactUsService.getSingleContactUs(contactUsId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const ContactUsController = {
  createContactUs,
  updateContactUsStatus,
  deleteContactUs,
  getAllContactUs,
  getSingleContactUs,
};
