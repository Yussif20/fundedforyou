import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { NewsLetterController } from "./news-letter.controller";
import { NewsLetterValidation } from "./news-letter.validation";
const router = express.Router();

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
