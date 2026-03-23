"use client";
import { TQueryParam } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useQueryBuilder = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Convert string → boolean | number | string
  const convertValue = (value: string): string | number | boolean => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  };

  // Memoize params so they are stable
  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const getParam = (
    key: string,
    defaultValue?: string | number | boolean
  ): string | null => {
    const val = params.get(key);
    if (val === null && defaultValue !== undefined) return String(defaultValue);
    return val;
  };

  const setParam = (key: string, value: string | number | boolean) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value === "" || value === null || value === undefined) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    router.push("?" + newParams.toString(), { scroll: false });
  };

  const getAllParams = (): TQueryParam[] =>
    Array.from(params.entries()).map(([name, value]) => ({
      name,
      value: convertValue(value),
    }));

  const getParamsWithKey = (
    key: string,
    defaultValue?: string | number | boolean
  ): TQueryParam | undefined => {
    const val = params.get(key);
    if (val === null) return undefined;
    return {
      name: key,
      value: val !== null ? convertValue(val) : defaultValue ?? "",
    };
  };

  return {
    getParam,
    setParam,
    getAllParams,
    getParamsWithKey,
  };
};

// ⭐ Fixed generateParams to return a stable object
export const generateParams = (args: TQueryParam[] = []) => {
  const params = new URLSearchParams();
  if (!Array.isArray(args)) {
    return params;
  }
  // If empty array, return null
  if (args.length === 0) {
    return params;
  }
  (args ?? [])?.forEach((item) => {
    if (item?.name && item?.value) {
      params.append(item.name, item.value as string);
    }
  });
  return params;
};
