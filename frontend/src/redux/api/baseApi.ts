/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { AppConfig } from "@/config";
import { ServerError_T } from "@/types";
import Cookies from "js-cookie";
import { logout, setUser } from "../authSlice";

const isDev = process.env.NODE_ENV === "development";

// In dev: direct backend URL + /api/v1
// In prod: proxy route (which already forwards to /api/v1)
const baseUrl = isDev ? `${AppConfig.backendUrl}/api/v1` : AppConfig.backendUrl;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      headers.set("Authorization", `${accessToken}`);
    }

    headers.set("x-client-type", "MOBILE");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  // if access token expired

  const error = result.error?.data as ServerError_T;

  if (error?.statusCode === 401) {
    Cookies.remove("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    // try refreshing
    const refreshResult = (await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions,
    )) as {
      data?: { data: { accessToken: string; refreshToken: string; user: {} } };
    };

    if (refreshResult?.data?.data?.accessToken) {
      // store new tokens
      Cookies.set("accessToken", refreshResult.data.data.accessToken);
      Cookies.set("refreshToken", refreshResult.data.data.refreshToken);

      api.dispatch(
        setUser({
          user: { ...refreshResult.data.data.user },
          token: refreshResult.data.data.accessToken,
        }),
      );

      // retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300,
  tagTypes: [
    "User",
    "Category",
    "Product",
    "Message",
    "Payment",
    "Support",
    "Faq",
    "ContactUs",
    "Firm",
    "Platform",
    "Spread",
    "Spreads",
    "Firms",
    "Symbol",
    "Subscribe",
    "Challenge",
    "PaymentMethod",
    "Broker",
    "Offer",
    "Offers",
    "BestSeller",
    "Announcement",
    "News",
  ],
  endpoints: () => ({}),
});
