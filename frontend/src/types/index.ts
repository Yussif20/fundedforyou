/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { SVGProps } from "react";
export * from "./message.type";
export * from "./spread.types";
export * from "./platform.type";
export * from "./faq.type";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type UserRoleEnum = "USER" | "MODERATOR" | "SUPER_ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
  profile: string;
  location: string;
  authType: string;
  role: string;
  phoneNumber: number | null;
  createdAt: string;
  updatedAt: string;
  tookChallenge: string;
  tradingExperience: string;
  assetsTraded: string[];
  country: string;
  hasTakenSurvey: boolean;
}
export type TQueryParam =
  | {
      name: string;
      value: boolean | React.Key;
    }
  | undefined;

export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;

export type TApiResponse<T = any> = {
  statusCode?: number; // HTTP status code
  success?: boolean; // true if statusCode is 2xx/3xx
  message?: string; // optional message, could be from top-level or data.message
  data?:
    | {
        signOut?: boolean;
        accessTokenExpired?: boolean;
        refreshTokenExpired?: boolean;
        [key: string]: any;
      }
    | T;
  meta?: TMeta; // optional pagination/meta info
};

export type ServerError_T = {
  statusCode?: number;
  errorDetails?: {
    signOut?: boolean;
    accessTokenExpired?: boolean;
    refreshTokenExpired?: boolean;
  };
};

export type OmitTypes = "id" | "createdAt" | "updatedAt";

export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  SUPER_ADMIN = "SUPER_ADMIN",
}
