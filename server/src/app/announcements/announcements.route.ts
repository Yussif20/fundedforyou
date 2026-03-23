import { authorize } from "@/middlewares";
import { uploadMiddleware } from "@/middlewares/uploadFiles.middleware";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { AnnouncementsController } from "./announcements.controller";
import { AnnouncementsValidation } from "./announcements.validation";

const router = express.Router();

router.get("/:firmId", AnnouncementsController.getAllAnnouncementsForFirm);

router.post(
  "/",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("thumbnail", {
    isRequired: false,
    allowedFileTypes: ["image/*"],
  }),
  validateRequest(AnnouncementsValidation.createAnnouncement),
  AnnouncementsController.createAnnouncement
);

router.patch(
  "/:announcementId",
  authorize("SUPER_ADMIN"),
  uploadMiddleware.single("thumbnail", {
    isRequired: false,
    allowedFileTypes: ["image/*"],
  }),
  validateRequest(AnnouncementsValidation.updateAnnouncement),
  AnnouncementsController.updateAnnouncement
);

export const AnnouncementsRoutes = router;
