import express from "express";
import { BestSellerService } from "./best-seller.service";
import { authorize } from "@/middlewares";
const router = express.Router();

router.get("/", BestSellerService.getAllBestSeller);
router.get("/:id", BestSellerService.getBestSeller);
router.post("/", authorize("SUPER_ADMIN"), BestSellerService.createBestSeller);
router.patch(
  "/:id",
  authorize("SUPER_ADMIN"),
  BestSellerService.updateBestSeller
);
router.delete(
  "/:id",
  authorize("SUPER_ADMIN"),
  BestSellerService.deleteBestSeller
);
router.patch(
  "/weekly/:id",
  authorize("SUPER_ADMIN"),
  BestSellerService.handleChangeIndexOfWeeklyBestSeller
);
router.patch(
  "/monthly/:id",
  authorize("SUPER_ADMIN"),
  BestSellerService.handleChangeIndexOfMonthlyBestSeller
);

router.patch(
  "/rank/:id",
  authorize("SUPER_ADMIN"),
  BestSellerService.handleChangeIndexOfRankBestSeller
);

export const BestSellerRoutes = router;
