import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import httpStatus from "http-status";
import { FAQService } from "./faq.service";

const getAllFaq = catchAsync(async (req, res) => {
  const data = await FAQService.getAllFaq(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQs retrieved successfully",
    ...data,
  });
});

const getSingleFaq = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const data = await FAQService.getSingleFaq(faqId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ retrieved successfully",
    data,
  });
});

const createFaq = catchAsync(async (req, res) => {
  const faqData = req.body;
  const data = await FAQService.createFaq(faqData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "FAQ created successfully",
    data,
  });
});

const createManyFaqs = catchAsync(async (req, res) => {
  const faqData = req.body;
  const data = await FAQService.createManyFaqs(faqData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "FAQs created successfully",
    data,
  });
});

const deleteFaq = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const data = await FAQService.deleteFaq(faqId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ deleted successfully",
    data,
  });
});

const updateFaq = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const faqData = req.body;
  const data = await FAQService.updateFaq(faqId, faqData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ updated successfully",
    data,
  });
});

const changeIndexOfFAQ = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const { index } = req.body;
  const data = await FAQService.changeIndexOfFAQ(faqId, index);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FAQ index changed successfully",
    data,
  });
});

export const FAQController = {
  getAllFaq,
  getSingleFaq,
  createFaq,
  createManyFaqs,
  deleteFaq,
  updateFaq,
  changeIndexOfFAQ,
};
