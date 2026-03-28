import { authorize } from "@/middlewares";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { NewsLetterController } from "./news-letter.controller";
import { NewsLetterValidation } from "./news-letter.validation";
const router = express.Router();

router.get(
  "/subscribers",
  authorize(["SUPER_ADMIN"]),
  NewsLetterController.getAllSubscribers
);

router.delete(
  "/subscribers/:id",
  authorize(["SUPER_ADMIN"]),
  validateRequest(NewsLetterValidation.deleteSubscriber),
  NewsLetterController.deleteSubscriber
);

router.post(
  "/send-bulk",
  authorize(["SUPER_ADMIN"]),
  validateRequest(NewsLetterValidation.sendBulkEmail),
  NewsLetterController.sendBulkEmail
);

router.post(
  "/subscribe",
  validateRequest(NewsLetterValidation.subscribe),
  NewsLetterController.subscribeToNewsLetter
);

router.post(
  "/unsubscribe",
  validateRequest(NewsLetterValidation.subscribe),
  NewsLetterController.unSubscribeFromNewsLetter
);

export const NewsLetterRoutes = router;
