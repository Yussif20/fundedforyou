"use client";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function SetTheme() {
  const pathName = usePathname();
  const themes = useMemo(
    () => ({
      normal: "root",
      yellow: "yellow-theme",
    }),
    []
  );
  useEffect(() => {
    if (pathName.includes("/futures")) {
      document.documentElement.classList.remove(...Object.values(themes));
      document.documentElement.classList.add("yellow-theme");
    } else {
      document.documentElement.classList.remove(...Object.values(themes));
      document.documentElement.classList.add("root");
    }
  }, [pathName]);
  return null;
}
