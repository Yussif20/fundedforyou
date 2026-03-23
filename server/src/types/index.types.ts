import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export type FileTypePattern =
  | "image/*"
  | "image/png"
  | "image/jpg"
  | "image/jpeg"
  | "video/*"
  | "video/mp4"
  | "video/mkv"
  | "application/pdf"
  | "application/*";

export interface SearchParams {
  page?: number;
  limit?: number;
  sortBy?: string | string[];
  sortOrder?: "asc" | "desc";
  q?: string;
  [key: string]: any;
}

export type QueryT = {
  [key: string]: any;
};

export type ServerError_T = {
  status?: number;
  data?: {
    signOut?: boolean;
    accessTokenExpired?: boolean;
    refreshTokenExpired?: boolean;
  };
};
