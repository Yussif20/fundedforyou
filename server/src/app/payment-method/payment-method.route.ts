import { LogoFileValidation } from "@/constants/fileValidation";
import { authorize } from "@/middlewares";
import { uploadMiddleware } from "@/middlewares/uploadFiles.middleware";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { PaymentMethodController } from "./payment-method.controller";
import { PaymentMethodValidation } from "./payment-method.validation";

const router = express.Router();

router.get("/", PaymentMethodController.getAllPaymentMethod);

router.get(
  "/:paymentMethodId",
  validateRequest(PaymentMethodValidation.getSinglePaymentMethod),
  PaymentMethodController.getSinglePaymentMethod
);

router.post(
  "/",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    ...LogoFileValidation,
    isRequired: true,
  }),
  validateRequest(PaymentMethodValidation.createPaymentMethod),
  PaymentMethodController.createPaymentMethod
);

router.patch(
  "/:paymentMethodId",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    ...LogoFileValidation,
  }),
  validateRequest(PaymentMethodValidation.updatePaymentMethod),
  PaymentMethodController.updatePaymentMethod
);

router.delete(
  "/:paymentMethodId",
  authorize("SUPER_ADMIN"),
  validateRequest(PaymentMethodValidation.deletePaymentMethod),
  PaymentMethodController.deletePaymentMethod
);

export const PaymentMethodRoutes = router;
