import express from "express";
import { OfferService } from "./offer.service";
import { authorize } from "@/middlewares";
const router = express.Router();

router.post("/", authorize("SUPER_ADMIN"), OfferService.createOffer);
router.patch("/:id", authorize("SUPER_ADMIN"), OfferService.updateOffer);
router.delete("/:id", authorize("SUPER_ADMIN"), OfferService.deleteOffer);
router.get("/all", OfferService.getAllOffers);
router.get("/:id", OfferService.getSingleOffer);
router.get("/firm/:id", OfferService.getOffersByFirmId);
router.get("/", OfferService.getAllOffersByFirm);

export const OfferRoutes = router;
