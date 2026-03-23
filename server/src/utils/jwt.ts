import { UserRoleEnum } from "@prisma/client";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
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

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
