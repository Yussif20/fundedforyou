import { env } from "@/env";
import AppError from "@/helpers/errors/AppError";
import { parseExpiry } from "@/utils/generateToken";
import { ClientTypeEnum } from "@prisma/client";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const isDev = env.NODE_ENV === "development";

// ---------------- SIGNUP ----------------
const signup = catchAsync(async (req, res) => {
  const result = await AuthServices.signup(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User registered successfully. Please verify your email.",
    data: result,
  });
});

// ---------------- LOGIN ----------------
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const clientType = ((req.headers["x-client-type"] as string) ||
    "WEB") as ClientTypeEnum;

  const result = await AuthServices.login(email, password);

  if (clientType === "WEB") {
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // cannot be accessed via JS
      secure: !isDev, // true in production with HTTPS
      sameSite: "strict", // prevent CSRF
      maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN!), // set expiry dynamically
    });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true, // cannot be accessed via JS
      secure: !isDev, // true in production with HTTPS
      sameSite: "lax", // prevent CSRF
      maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN!), // set expiry dynamically
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: {
      ...result,
    },
  });
});

// ---------------- LOGIN ADMIN ----------------
const loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const clientType = ((req.headers["x-client-type"] as string) ||
    "WEB") as ClientTypeEnum;

  const result = await AuthServices.loginAdmin(email, password);

  if (clientType === "WEB") {
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // cannot be accessed via JS
      secure: !isDev, // true in production with HTTPS
      sameSite: "strict", // prevent CSRF
      maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN!), // set expiry dynamically
    });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true, // cannot be accessed via JS
      secure: !isDev, // true in production with HTTPS
      sameSite: "lax", // prevent CSRF
      maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN!), // set expiry dynamically
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: {
      ...result,
    },
  });
});

// ---------------- GOOGLE LOGIN ----------------
const googleLogin = catchAsync(async (req, res) => {
  const { credential } = req.body;
  const clientType = ((req.headers["x-client-type"] as string) || "WEB") as ClientTypeEnum;

  const result = await AuthServices.googleLogin(credential);

  if (clientType === "WEB") {
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: "strict",
      maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN!),
    });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: "lax",
      maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN!),
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Google login successful",
    data: { ...result },
  });
});

// ---------------- VERIFY EMAIL ----------------
const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body;
  const result = await AuthServices.verifyEmail(token as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Email verified successfully",
    data: result,
  });
});

// ---------------- RESEND VERIFICATION EMAIL ----------------
const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.resendVerificationEmail(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Verification email resent successfully",
    data: result,
  });
});

// ---------------- FORGOT PASSWORD ----------------
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.forgotPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password reset link sent successfully",
    data: result,
  });
});

// ---------------- RESET PASSWORD ----------------
const resetPassword = catchAsync(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const result = await AuthServices.resetPassword(resetToken, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password reset successfully",
    data: result,
  });
});

// ---------------- REFRESH ACCESS TOKEN ----------------
const refreshAccessToken = catchAsync(async (req, res) => {
  const clientType = ((req.headers["x-client-type"] as string) ||
    "WEB") as ClientTypeEnum;

  const refreshToken =
    clientType === "WEB" ? req.cookies.refreshToken : req.body.refreshToken;

  if (!refreshToken) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Refresh token not found", {
      signOutUser: true,
    });
  }

  const result = await AuthServices.refreshAccessToken(refreshToken);

  if (clientType === "WEB") {
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // cannot be accessed via JS
      secure: !isDev, // true in production with HTTPS
      sameSite: "lax", // prevent CSRF
      maxAge: parseExpiry(env.JWT_REFRESH_EXPIRES_IN!), // set expiry dynamically
    });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true, // cannot be accessed via JS
      secure: !isDev, // true in production with HTTPS
      sameSite: "lax", // prevent CSRF
      maxAge: parseExpiry(env.JWT_ACCESS_EXPIRES_IN!), // set expiry dynamically
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Refresh token generated successfully",
    data: {
      ...result,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

// ---------------- EXPORT ----------------
export const AuthController = {
  signup,
  login,
  loginAdmin,
  googleLogin,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshAccessToken,
};
