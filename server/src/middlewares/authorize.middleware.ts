import { insecurePrisma } from "@/db";
import AppError from "@/helpers/errors/AppError";
import { verifyToken } from "@/utils/jwt";
import { ClientTypeEnum, UserRoleEnum } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

type RoleOrLoggedIn =
  | UserRoleEnum
  | "LOGGED_IN"
  | (UserRoleEnum | "LOGGED_IN")[];

interface AuthOptions {
  optional?: boolean;
}

const authorize =
  (role?: RoleOrLoggedIn, options: AuthOptions = {}) =>
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const clientType =
        (req.headers["x-client-type"] as ClientTypeEnum) || "WEB";

      // Get access token
      const accessToken =
        clientType === "MOBILE"
          ? req.headers.authorization
          : req.cookies.accessToken;
      if (!accessToken) {
        if (options.optional) return next();
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!", {
          accessTokenExpired: true,
        });
      }

      // Verify access token
      let decodedAccessToken;
      try {
        decodedAccessToken = verifyToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET!
        );

        if (decodedAccessToken.tokenType !== "ACCESS_TOKEN") {
          throw new Error("Not an access token");
        }
      } catch (err) {
        if (options.optional) return next();
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid or expired access token!",
          {
            accessTokenExpired: true,
          }
        );
      }

      // Fetch user from DB
      const user = await insecurePrisma.user.findUnique({
        where: { id: decodedAccessToken.id },
      });

      if (!user) {
        if (options.optional) return next();
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      if (!user.isEmailVerified) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not verified!");
      }

      if (user.status === "BLOCKED") {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are blocked!", {
          signOut: true,
        });
      }

      // Attach user to request
      req.user = {
        ...decodedAccessToken,
        role: user.role,
        profile: user.profile,
      };

      // Role check
      if (role && role !== "LOGGED_IN") {
        const allowedRoles = Array.isArray(role) ? role : [role];
        if (!allowedRoles.includes(req.user.role)) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to do this action!"
          );
        }
      }

      next();
    } catch (error) {
      if (options.optional) return next();
      next(error);
    }
  };

export default authorize;
