import { authorize } from "@/middlewares";
import { uploadMiddleware } from "@/middlewares/uploadFiles.middleware";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { UsersController } from "./users.controller";
import { UsersValidation } from "./users.validation";
const router = express.Router();

router.get("/", authorize("SUPER_ADMIN"), UsersController.getAllUsers);

router.get("/me", authorize("LOGGED_IN"), UsersController.getProfile);

router.get("/:userId", authorize("SUPER_ADMIN"), UsersController.getSingleUser);

router.patch(
  "/me",
  authorize("LOGGED_IN"),
  uploadMiddleware.single("profile"),
  validateRequest(UsersValidation.updateMyProfile),
  UsersController.updateMyProfile
);

router.delete(
  "/delete-me",
  authorize("LOGGED_IN"),
  UsersController.deleteMyProfile
);

router.post(
  "/survey",
  authorize("LOGGED_IN"),
  validateRequest(UsersValidation.submitSurvey),
  UsersController.submitSurvey
);

router.patch(
  "/:userId/status",
  validateRequest(UsersValidation.updateUserStatus),
  authorize("SUPER_ADMIN"),
  UsersController.changeUserStatus
);

router.patch(
  "/:userId/role",
  authorize("SUPER_ADMIN"),
  validateRequest(UsersValidation.updateUserRole),
  UsersController.changeUserRole
);

router.get("/survey/data", authorize("LOGGED_IN"), UsersController.getSurvey);

export const UsersRoutes = router;
