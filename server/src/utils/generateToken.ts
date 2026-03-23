import { UserRoleEnum } from "@prisma/client";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
  tokenType: "ACCESS_TOKEN" | "REFRESH_TOKEN";
}

export const generateToken = (
  payload: TokenPayload,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
};

export const parseExpiry = (expiry: string) => {
  const unit = expiry.slice(-1); // last char: m, h, d
  const value = parseInt(expiry.slice(0, -1));

  switch (unit) {
    case "m":
      return value * 60 * 1000; // minutes
    case "h":
      return value * 60 * 60 * 1000; // hours
    case "d":
      return value * 24 * 60 * 60 * 1000; // days
    case "s":
      return value * 1000; // seconds
    default:
      throw new Error("Invalid JWT expiry format");
  }
};
