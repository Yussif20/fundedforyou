import { ResponseMessages } from "@/constants/ResponseMessages";
import { insecurePrisma, prisma } from "@/db";
import ForgotPasswordEmail from "@/emails/ForgotPasswordEmail";
import { MagicVerifyLinkEmail } from "@/emails/SignupEmail";
import { env } from "@/env";
import AppError from "@/helpers/errors/AppError";
import { sendEmail } from "@/lib/email";
import { generateToken, parseExpiry } from "@/utils/generateToken";
import { verifyToken } from "@/utils/jwt";
import { reactComponentToHtml } from "@/utils/reactComponentToHtml";
import { AuthType, MagicLinkPurposeEnum, UserRoleEnum, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { OAuth2Client } from "google-auth-library";
import httpStatus from "http-status";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import z from "zod";
import {
  AuthValidation,
  ChangePasswordValidationInput,
} from "./auth.validation";

const isDev = env.NODE_ENV === "development";

// ------------------- SIGNUP -------------------
const signup = async (
  payload: z.infer<typeof AuthValidation.signupValidationSchema>["body"]
) => {
  console.log(`[Auth] Signup attempt for email: ${payload.email}`);
  if (!payload.isAggradedToTermsAndPolicies)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.SIGNUP.TERMS_NOT_AGREED
    );

  // Email uniqueness: only consider non-deleted users (global filter).
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email, status: { not: UserStatus.DELETED } },
  });

  if (existingUser) {
    if (!existingUser.isEmailVerified) {
      const hashedPassword = await bcrypt.hash(payload.password, 12);

      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          fullName: payload.fullName,
          password: hashedPassword,
          role: UserRoleEnum.USER,
          isAgreeWithTerms: payload.isAggradedToTermsAndPolicies,
          isEmailVerified: false,
        },
      });

      return await sendMagicLink(
        user.email,
        MagicLinkPurposeEnum.EMAIL_VERIFICATION
      );
    }

    throw new AppError(
      httpStatus.CONFLICT,
      ResponseMessages.AUTH.SIGNUP.EMAIL_EXISTS
    );
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await prisma.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      password: hashedPassword,
      role: UserRoleEnum.USER,
      isAggradedToTermsAndPolicies: payload.isAggradedToTermsAndPolicies,
      isEmailVerified: false,
      authType: AuthType.EMAIL,
    },
  });

  return await sendMagicLink(
    user.email,
    MagicLinkPurposeEnum.EMAIL_VERIFICATION
  );
};

// ------------------- LOGIN -------------------
const login = async (email: string, password: string) => {
  const user = await insecurePrisma.user.findFirst({
    where: { email, status: { not: UserStatus.DELETED } },
  });

  if (!user)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.LOGIN.INVALID_CREDENTIALS
    );

  if (!([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MODERATOR] as UserRoleEnum[]).includes(user.role) && !user.isEmailVerified) {
    const data = await sendMagicLink(
      user.email,
      MagicLinkPurposeEnum.EMAIL_VERIFICATION
    );

    return {
      ...data,
      message: ResponseMessages.AUTH.LOGIN.EMAIL_NOT_VERIFIED,
    };
  }

  if (!user.password)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.LOGIN.INVALID_CREDENTIALS
    );
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.LOGIN.INVALID_CREDENTIALS
    );

  const accessToken = generateToken(
    {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tokenType: "ACCESS_TOKEN",
    },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  );

  const refreshToken = generateToken(
    {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tokenType: "REFRESH_TOKEN",
    },
    env.JWT_REFRESH_SECRET!,
    env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  );

  const newAccessTokenExpiresAt = new Date(
    Date.now() + parseExpiry(process.env.JWT_ACCESS_EXPIRES_IN!)
  );
  const newExpiresAt = new Date(
    Date.now() + parseExpiry(process.env.JWT_REFRESH_EXPIRES_IN!)
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: newExpiresAt,
    },
  });

  await prisma.accessTokens.create({
    data: {
      userId: user.id,
      token: accessToken,
      expiresAt: newAccessTokenExpiresAt,
    },
  });

  return {
    message: ResponseMessages.AUTH.LOGIN.SUCCESS,
    user: {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      hasTakenSurvey: user.hasTakenSurvey,
    },
    accessToken,
    refreshToken,
  };
};

// ------------------- LOGIN ADMIN -------------------
const loginAdmin = async (email: string, password: string) => {
  const user = await insecurePrisma.user.findFirst({
    where: { email, role: { in: [UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MODERATOR] }, status: { not: UserStatus.DELETED } },
  });

  if (!user)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.LOGIN.INVALID_CREDENTIALS
    );

  if (!user.password)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.LOGIN.INVALID_CREDENTIALS
    );
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.LOGIN.INVALID_CREDENTIALS
    );

  const accessToken = generateToken(
    {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tokenType: "ACCESS_TOKEN",
    },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  );

  const refreshToken = generateToken(
    {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tokenType: "REFRESH_TOKEN",
    },
    env.JWT_REFRESH_SECRET!,
    env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  );

  const newAccessTokenExpiresAt = new Date(
    Date.now() + parseExpiry(process.env.JWT_ACCESS_EXPIRES_IN!)
  );
  const newExpiresAt = new Date(
    Date.now() + parseExpiry(process.env.JWT_REFRESH_EXPIRES_IN!)
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: newExpiresAt,
    },
  });

  await prisma.accessTokens.create({
    data: {
      userId: user.id,
      token: accessToken,
      expiresAt: newAccessTokenExpiresAt,
    },
  });

  return {
    message: ResponseMessages.AUTH.LOGIN.SUCCESS,
    user: {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      hasTakenSurvey: user.hasTakenSurvey,
    },
    accessToken,
    refreshToken,
  };
};

// ------------------- GOOGLE LOGIN -------------------
const googleLogin = async (credential: string) => {
  // 1. Verify Google ID token
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  let payload: any;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired Google token. Please try again.");
  }

  if (!payload?.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Google account did not return an email address.");
  }

  const { email, name } = payload;

  // 2. Find user (exclude DELETED, same as login)
  const existingUser = await insecurePrisma.user.findFirst({
    where: { email, status: { not: UserStatus.DELETED } },
  });

  let user: any;

  if (existingUser) {
    // 3a. Existing user — check status
    if (existingUser.status === UserStatus.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }
    // If unverified email account — mark verified now (Google confirmed it)
    if (!existingUser.isEmailVerified) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { isEmailVerified: true },
      });
    }
    user = existingUser;
  } else {
    // 3b. New user — create with random hashed password (fixes null password bug)
    const randomPassword = randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = await prisma.user.create({
      data: {
        fullName: name ?? email.split("@")[0],
        email,
        password: hashedPassword,
        role: UserRoleEnum.USER,
        authType: AuthType.GOOGLE,
        isEmailVerified: true,
        isAggradedToTermsAndPolicies: true,
        status: UserStatus.ACTIVE,
      },
    });
  }

  // 4. Generate tokens (identical to login)
  const accessToken = generateToken(
    { id: user.id, name: user.fullName, email: user.email, role: user.role, tokenType: "ACCESS_TOKEN" },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  );
  const refreshToken = generateToken(
    { id: user.id, name: user.fullName, email: user.email, role: user.role, tokenType: "REFRESH_TOKEN" },
    env.JWT_REFRESH_SECRET!,
    env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  );

  const newAccessTokenExpiresAt = new Date(Date.now() + parseExpiry(process.env.JWT_ACCESS_EXPIRES_IN!));
  const newExpiresAt = new Date(Date.now() + parseExpiry(process.env.JWT_REFRESH_EXPIRES_IN!));

  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: newExpiresAt } });
  await prisma.accessTokens.create({ data: { userId: user.id, token: accessToken, expiresAt: newAccessTokenExpiresAt } });

  // 5. Return same shape as login
  return {
    message: ResponseMessages.AUTH.LOGIN.SUCCESS,
    user: { id: user.id, name: user.fullName, email: user.email, role: user.role, hasTakenSurvey: user.hasTakenSurvey },
    accessToken,
    refreshToken,
  };
};

// ------------------- VERIFY EMAIL -------------------
const verifyEmail = async (token: string) => {
  const magic = await insecurePrisma.magicLink.findUnique({
    where: { token },
    include: { user: { select: { isEmailVerified: true, email: true } } },
  });

  if (!magic)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.EMAIL_VERIFICATION.INVALID_LINK
    );
  if (magic.user.isEmailVerified)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.EMAIL_VERIFICATION.ALREADY_VERIFIED
    );
  if (magic.expiresAt < new Date())
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.EMAIL_VERIFICATION.LINK_EXPIRED
    );
  if (magic.verified)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.EMAIL_VERIFICATION.LINK_USED
    );

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: magic.userId },
  });

  await prisma.magicLink.update({
    where: { id: magic.id },
    data: { verified: true },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true },
  });

  const accessToken = generateToken(
    {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tokenType: "ACCESS_TOKEN",
    },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  );

  const refreshToken = generateToken(
    {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      tokenType: "REFRESH_TOKEN",
    },
    env.JWT_REFRESH_SECRET!,
    env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
  );

  return {
    message: ResponseMessages.AUTH.EMAIL_VERIFICATION.SUCCESS,
    accessToken,
    refreshToken,
  };
};

// ------------------- RESEND EMAIL VERIFICATION -------------------
const resendVerificationEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email, status: { not: UserStatus.DELETED } },
  });
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, ResponseMessages.USER.NOT_FOUND);
  if (user.isEmailVerified)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.EMAIL_VERIFICATION.ALREADY_VERIFIED
    );

  return sendMagicLink(email, MagicLinkPurposeEnum.EMAIL_VERIFICATION);
};

// ------------------- FORGOT PASSWORD -------------------
const forgotPassword = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email, status: { not: UserStatus.DELETED } },
  });
  if (!user)
    throw new AppError(
      httpStatus.NOT_FOUND,
      ResponseMessages.USER.NOT_FOUND_WITH_EMAIL
    );
  if (!user.isEmailVerified)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.PASSWORD.FORGOT_EMAIL_NOT_VERIFIED
    );

  return sendMagicLink(email, MagicLinkPurposeEnum.PASSWORD_RESET);
};

// ------------------- RESET PASSWORD -------------------
const resetPassword = async (token: string, newPassword: string) => {
  const magic = await prisma.magicLink.findUnique({ where: { token } });
  if (!magic)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.EMAIL_VERIFICATION.INVALID_LINK
    );
  if (magic.expiresAt < new Date())
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.PASSWORD.RESET_LINK_EXPIRED
    );
  if (magic.verified)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.PASSWORD.RESET_LINK_USED
    );

  const user = await insecurePrisma.user.findUniqueOrThrow({
    where: { id: magic.userId },
  });

  if (!user.password)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ResponseMessages.AUTH.PASSWORD.RESET_LINK_USED
    );
  const isSameAsOldPassword = await bcrypt.compare(newPassword, user.password);

  if (isSameAsOldPassword) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      ResponseMessages.AUTH.PASSWORD.PASSWORD_SAME_AS_OLD
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  await prisma.magicLink.update({
    where: { id: magic.id },
    data: { verified: true },
  });

  return { message: ResponseMessages.AUTH.PASSWORD.RESET_SUCCESS };
};

// ------------------- REFRESH ACCESS TOKEN -------------------
const refreshAccessToken = async (token: string) => {
  if (!token)
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token missing");

  const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET!);

  if (decoded.tokenType !== "REFRESH_TOKEN") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token type");
  }

  // Find the refresh token in DB
  const storedToken = await prisma.refreshToken.findFirst({
    where: { token },
  });

  if (
    !storedToken ||
    storedToken.revoked ||
    storedToken.expiresAt < new Date()
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Refresh token expired or revoked",
      {
        signout: true,
      }
    );
  }

  // Rotate token: invalidate old
  await prisma.refreshToken.update({
    where: { token },
    data: { revoked: true },
  });

  // Issue new refresh token
  const newRefreshToken = generateToken(
    {
      id: decoded.id as string,
      email: decoded.email,
      role: decoded.role,
      name: decoded.fullName,
      tokenType: "REFRESH_TOKEN",
    },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN as JwtPayload[""]
  );

  const newExpiresAt = new Date(
    Date.now() + parseExpiry(process.env.JWT_REFRESH_EXPIRES_IN!)
  );

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.id,
      expiresAt: newExpiresAt,
    },
  });

  // Issue new access token
  const newAccessToken = generateToken(
    {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      tokenType: "ACCESS_TOKEN",
    },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      email: decoded.email,
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    },
  };
};

// ------------------- SEND MAGIC LINK (COMMON HELPER) -------------------
const sendMagicLink = async (email: string, purpose: MagicLinkPurposeEnum) => {
  const user = await prisma.user.findFirst({
    where: { email, status: { not: UserStatus.DELETED } },
  });
  if (!user)
    throw new AppError(httpStatus.NOT_FOUND, ResponseMessages.USER.NOT_FOUND);

  const token = randomBytes(32).toString("hex");
  const expiresAt = addMinutes(new Date(), 15);

  await prisma.magicLink.create({
    data: { userId: user.id, token, purpose, expiresAt },
  });

  const link =
    purpose === MagicLinkPurposeEnum.EMAIL_VERIFICATION
      ? `${env.FRONTEND_URL}/auth/verify-email?token=${token}`
      : `${env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  const subject =
    purpose === MagicLinkPurposeEnum.EMAIL_VERIFICATION
      ? "Verify Your Email"
      : "Reset Your Password";

  let message = ResponseMessages.AUTH.PASSWORD.RESET_LINK_SENT;

  if (purpose === MagicLinkPurposeEnum.EMAIL_VERIFICATION) {
    const htmlEmail = await reactComponentToHtml(MagicVerifyLinkEmail, {
      token,
    });
    message = ResponseMessages.AUTH.EMAIL_VERIFICATION.SENT;
    console.log(`[Auth] Sending verification email to ${user.email}`);
    await sendEmail(user.email, { html: htmlEmail, subject });
    console.log(`[Auth] Verification email sent successfully to ${user.email}`);
  } else if (purpose === MagicLinkPurposeEnum.PASSWORD_RESET) {
    const htmlEmail = await reactComponentToHtml(ForgotPasswordEmail, {
      token,
    });
    message = ResponseMessages.AUTH.PASSWORD.RESET_LINK_SENT;
    console.log(`[Auth] Sending password reset email to ${user.email}`);
    await sendEmail(user.email, { html: htmlEmail, subject });
    console.log(`[Auth] Password reset email sent successfully to ${user.email}`);
  }

  const res: any = { message };
  if (isDev) res.link = link;
  if (isDev) res.token = token;
  return res;
};

const changePassword = async (
  user: JwtPayload,
  payload: ChangePasswordValidationInput["body"]
) => {
  const dbUser = await insecurePrisma.user.findFirstOrThrow({
    where: { email: user.email, status: "ACTIVE" },
  });

  if (!dbUser.password)
    throw new AppError(httpStatus.BAD_REQUEST, "Current password is incorrect");
  const isCorrect = await bcrypt.compare(payload.oldPassword, dbUser.password);
  const isSameAsOldPassword = await bcrypt.compare(
    payload.newPassword,
    dbUser.password
  );

  if (isSameAsOldPassword) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Password cant be same as old password"
    );
  }

  if (!isCorrect)
    throw new AppError(httpStatus.BAD_REQUEST, "Current password is incorrect");

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: { id: dbUser.id },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully!" };
};

// ------------------- EXPORT -------------------
export const AuthServices = {
  signup,
  login,
  loginAdmin,
  googleLogin,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  changePassword,
};
