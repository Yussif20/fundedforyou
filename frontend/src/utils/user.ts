"use server";

import { decodeJwt } from "jose";
import { getCookie } from "./cookies";

export const getCurrentSession = async () => {
  try {
    const token = await getCookie("accessToken");

    if (!token) {
      return { session: null, jwtUser: null };
    }

    const session = decodeJwt(token?.value);

    return { session, user: {} };
  } catch (error) {
    return { session: null };
  }
};
