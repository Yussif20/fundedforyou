import { LogoFileValidation } from "@/constants/fileValidation";
import { authorize } from "@/middlewares";
import { uploadMiddleware } from "@/middlewares/uploadFiles.middleware";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { PlatformController } from "./platform.controller";
import { PlatformValidation } from "./platform.validation";

const router = express.Router();

router.get("/", PlatformController.getAllPlatform);

router.get(
  "/:platformId",
  validateRequest(PlatformValidation.getSinglePlatform),
  PlatformController.getSinglePlatform
);

router.post(
  "/",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    ...LogoFileValidation,
    isRequired: true,
  }),
  validateRequest(PlatformValidation.createPlatform),
  PlatformController.createPlatform
);

router.patch(
  "/:platformId",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    ...LogoFileValidation,
  }),
  validateRequest(PlatformValidation.updatePlatform),
  PlatformController.updatePlatform
);

router.delete(
  "/:platformId",
  authorize("SUPER_ADMIN"),
  validateRequest(PlatformValidation.deletePlatform),
  PlatformController.deletePlatform
);

export const PlatformRoutes = router;
