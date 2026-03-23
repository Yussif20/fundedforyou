import express from "express";
import { NewsService } from "./news.service";
import { authorize } from "@/middlewares";
const router = express.Router();

router.post("/", authorize("SUPER_ADMIN"), NewsService.createNews);
router.get("/", NewsService.getAllNews);
router.patch("/reorder", authorize("SUPER_ADMIN"), NewsService.reorderNews);
router.patch("/change-index/:id", authorize("SUPER_ADMIN"), NewsService.changeIndexOfNews);
router.patch("/:newsId", authorize("SUPER_ADMIN"), NewsService.updateNews);
router.delete("/:newsId", authorize("SUPER_ADMIN"), NewsService.deleteNews);

export const NewsRoutes = router;
