import httpStatus from "@/constants";
import catchAsync from "@/utils/catchAsync";
import sendResponse from "@/utils/sendResponse";
import { PaymentMethodService } from "./payment-method.service";

const getAllPaymentMethod = catchAsync(async (req, res) => {
  const data = await PaymentMethodService.getAllPaymentMethod(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment methods retrieved successfully",
    ...data,
  });
});

const getSinglePaymentMethod = catchAsync(async (req, res) => {
  const paymentMethodId = req.params.paymentMethodId;
  const data =
    await PaymentMethodService.getSinglePaymentMethod(paymentMethodId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment method retrieved successfully",
    data: data,
  });
});

const createPaymentMethod = catchAsync(async (req, res) => {
  const logoFile = req.file as Express.Multer.File;
  const data = await PaymentMethodService.createPaymentMethod(
    req.body,
    logoFile
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Payment method created successfully",
    data: data,
  });
});

const updatePaymentMethod = catchAsync(async (req, res) => {
  const logoFile = req.file as Express.Multer.File;
  const paymentMethodId = req.params.paymentMethodId;

  const data = await PaymentMethodService.updatePaymentMethod(
    paymentMethodId,
    req.body,
    logoFile
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment method updated successfully",
    data: data,
  });
});

const deletePaymentMethod = catchAsync(async (req, res) => {
  const paymentMethodId = req.params.paymentMethodId;
  const data = await PaymentMethodService.deletePaymentMethod(paymentMethodId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Payment method deleted successfully",
    data: data,
  });
});

export const PaymentMethodController = {
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethod,
  getSinglePaymentMethod,
  updatePaymentMethod,
};
