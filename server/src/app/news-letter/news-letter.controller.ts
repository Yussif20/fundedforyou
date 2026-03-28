import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { NewsLetterService } from "./news-letter.service";

const getAllSubscribers = catchAsync(async (req, res) => {
  const result = await NewsLetterService.getAllSubscribers(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscribers retrieved successfully",
    data: result,
  });
});

const subscribeToNewsLetter = catchAsync(async (req, res) => {
  const result = await NewsLetterService.subscribeToNewsLetter(req.body.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscribed to newsletter successfully",
    data: result,
  });
});

const unSubscribeFromNewsLetter = catchAsync(async (req, res) => {
  const result = await NewsLetterService.unSubscribeFromNewsLetter(
    req.body.email
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unsubscribed from newsletter successfully",
    data: result,
  });
});

const deleteSubscriber = catchAsync(async (req, res) => {
  const result = await NewsLetterService.deleteSubscriber(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscriber removed successfully",
    data: result,
  });
});

const sendBulkEmail = catchAsync(async (req, res) => {
  const result = await NewsLetterService.sendBulkEmail(
    req.body.subject,
    req.body.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Email sent to ${result.sent} subscribers`,
    data: result,
  });
});

export const NewsLetterController = {
  getAllSubscribers,
  subscribeToNewsLetter,
  unSubscribeFromNewsLetter,
  deleteSubscriber,
  sendBulkEmail,
};
