import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { NewsLetterService } from "./news-letter.service";

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

export const NewsLetterController = {
  subscribeToNewsLetter,
  unSubscribeFromNewsLetter,
};
