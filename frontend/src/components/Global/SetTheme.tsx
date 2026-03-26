"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function SetTheme() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const themes = useMemo(
    () => ({
      normal: "root",
      yellow: "yellow-theme",
    }),
    []
  );
  useEffect(() => {
    const isFutures =
      pathName.includes("/futures") ||
      searchParams.get("type")?.toLowerCase() === "futures";
    if (isFutures) {
      document.documentElement.classList.remove(...Object.values(themes));
      document.documentElement.classList.add("yellow-theme");
    } else {
      document.documentElement.classList.remove(...Object.values(themes));
      document.documentElement.classList.add("root");
    }
  }, [pathName, searchParams]);
  return null;
}
