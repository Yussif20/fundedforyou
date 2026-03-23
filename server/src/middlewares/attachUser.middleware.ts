import { insecurePrisma } from "@/db";
import { env } from "@/env";
import AppError from "@/helpers/errors/AppError";
import { verifyToken } from "@/utils/jwt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const attachUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const deviceType = req.headers["x-client-type"] || "WEB";

    const token =
      deviceType == "MOBILE"
        ? req.headers.authorization
        : req.cookies.accessToken;

    if (!token) return next();

    let decoded;
    try {
      decoded = verifyToken(token, env.JWT_ACCESS_SECRET);
    } catch {
      return next();
    }

    if (!decoded) return next();

    const user = await insecurePrisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) return next();

    if (!user.isEmailVerified)
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not verified!");
    if (user.status === "BLOCKED" || user.status === "DELETED")
      throw new AppError(httpStatus.UNAUTHORIZED, "You are Blocked!");

    req.user = {
      ...decoded,
      profile: user.profile,
      role: user.role,
    };

    return next();
  } catch (error) {
    console.error("AttachUser error:", error);
    return next();
  }
};

export default attachUser;
