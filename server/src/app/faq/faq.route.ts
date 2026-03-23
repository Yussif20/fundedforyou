import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { FAQController } from "./faq.controller";
import { FAQValidation } from "./faq.validation";
import { authorize } from "@/middlewares";
const router = express.Router();

router.get("/", FAQController.getAllFaq);

router.get(
  "/:faqId",
  validateRequest(FAQValidation.getSingleFaq),
  FAQController.getSingleFaq
);

router.post(
  "/",
  authorize("SUPER_ADMIN"),
  validateRequest(FAQValidation.createFAQ),
  FAQController.createFaq
);

router.post(
  "/create-many",
  authorize("SUPER_ADMIN"),
  validateRequest(FAQValidation.createManyFAQ),
  FAQController.createManyFaqs
);

router.delete(
  "/:faqId",
  authorize("SUPER_ADMIN"),
  validateRequest(FAQValidation.deleteFAQ),
  FAQController.deleteFaq
);

router.patch(
  "/:faqId",
  authorize("SUPER_ADMIN"),
  validateRequest(FAQValidation.updateFAQ),
  FAQController.updateFaq
);

router.patch(
  "/change-index/:faqId",
  authorize("SUPER_ADMIN"),
  validateRequest(FAQValidation.changeIndex),
  FAQController.changeIndexOfFAQ
);

export const FAQRoutes = router;
