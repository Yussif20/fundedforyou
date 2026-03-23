import { LogoFileValidation } from "@/constants/fileValidation";
import { authorize } from "@/middlewares";
import { uploadMiddleware } from "@/middlewares/uploadFiles.middleware";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { BrokerController } from "./broker.controller";
import { BrokerValidation } from "./broker.validation";

const router = express.Router();

router.get("/", BrokerController.getAllBroker);

router.get(
  "/:brokerId",
  validateRequest(BrokerValidation.getSingleBroker),
  BrokerController.getSingleBroker
);

router.post(
  "/",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    ...LogoFileValidation,
    isRequired: true,
  }),
  validateRequest(BrokerValidation.createBroker),
  BrokerController.createBroker
);

router.patch(
  "/:brokerId",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    ...LogoFileValidation,
  }),
  validateRequest(BrokerValidation.updateBroker),
  BrokerController.updateBroker
);

router.delete(
  "/:brokerId",
  authorize("SUPER_ADMIN"),
  validateRequest(BrokerValidation.deleteBroker),
  BrokerController.deleteBroker
);

export const BrokerRoutes = router;
