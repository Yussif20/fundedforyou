import { requestsLimiter } from "@/middlewares/rateLimiter";
import validateRequest from "@/middlewares/validate-request";
import express from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/signup",
  requestsLimiter(60, 50),
  validateRequest(AuthValidation.signupValidationSchema),
  AuthController.signup
);

router.post(
  "/login",
  requestsLimiter(60, 50),
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.post(
  "/login-admin",
  requestsLimiter(60, 50),
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginAdmin
);

router.post(
  "/google",
  requestsLimiter(60, 50),
  validateRequest(AuthValidation.googleLoginValidationSchema),
  AuthController.googleLogin
);

router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailValidationSchema),
  AuthController.verifyEmail
);

router.post(
  "/resend-verification",
  validateRequest(AuthValidation.resendVerificationEmailValidationSchema),
  AuthController.resendVerificationEmail
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/refresh-token",
  // validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.refreshAccessToken
);

export const AuthRoutes = router;
