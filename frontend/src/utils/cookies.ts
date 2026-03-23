"use server";

import { cookies } from "next/headers";

export const getCookie = async (
  name: string
): Promise<{ name: string; value: string } | null> => {
  const cookieStore = await cookies();
  const cookieData = cookieStore.getAll();
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData.find((cookie) => cookie.name === name) || null);
    }, 1000)
  );
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();

  return cookieStore.delete(name);
};
