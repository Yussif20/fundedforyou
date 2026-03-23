import { authorize } from "@/middlewares";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { ContactUsController } from "./contact-us.controller";
import { ContactUsValidation } from "./contact-us.validation";
const router = express.Router();

router.get("/", authorize(["SUPER_ADMIN", "MODERATOR"]), ContactUsController.getAllContactUs);

router.get(
  "/:contactUsId",
  authorize(["SUPER_ADMIN", "MODERATOR"]),
  ContactUsController.getSingleContactUs
);

router.post(
  "/",
  validateRequest(ContactUsValidation.createContactUs),
  ContactUsController.createContactUs
);

router.patch(
  "/:contactUsId/status",
  authorize(["SUPER_ADMIN", "MODERATOR"]),
  validateRequest(ContactUsValidation.updateContactUsStatus),
  ContactUsController.updateContactUsStatus
);

export const ContactUsRoutes = router;
