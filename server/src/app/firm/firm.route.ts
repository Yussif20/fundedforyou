import { authorize } from "@/middlewares";
import { uploadMiddleware } from "@/middlewares/uploadFiles.middleware";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { FirmController } from "./firm.controller";
import { FirmValidation } from "./firm.validation";

const router = express.Router();

router.get("/", FirmController.getAllFirms);
router.get("/:firmId", FirmController.getSingleFirm);

router.post(
  "/",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    isRequired: true,
    allowedFileTypes: ["image/*"],
  }),
  validateRequest(FirmValidation.createFirm),
  FirmController.createFirm
);

router.patch(
  "/:firmId",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("logo", {
    isRequired: false,
    allowedFileTypes: ["image/*"],
  }),
  validateRequest(FirmValidation.updateFirm),
  FirmController.updatePropFirm
);

router.delete("/:firmId", authorize("SUPER_ADMIN"), FirmController.deleteFirm);
router.patch(
  "/change-index/:firmId",
  authorize("SUPER_ADMIN"),
  FirmController.changeIndexOfFirm
);
export const FirmRoutes = router;
