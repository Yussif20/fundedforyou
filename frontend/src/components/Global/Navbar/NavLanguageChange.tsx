"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import LinearBorder from "../LinearBorder";
import { Languages } from "lucide-react";

export default function NavLanguageChange({ triggerClassName }: { triggerClassName?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en";
  const [language, setLanguage] = useState(currentLocale);

  const stripLocalePrefix = (path: string) => {
    return path.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);

    const params = searchParams.toString();
    const queryString = params ? `?${params}` : "";
    const basePath = stripLocalePrefix(pathname);
    const newPath = newLang === "ar" ? `/ar${basePath}` : `/en${basePath}`;

    router.replace(`${newPath}${queryString}#top`);
  };

  useEffect(() => {
    setLanguage(pathname.startsWith("/ar") ? "ar" : "en");
  }, [pathname]);

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
      className={cn(
        "group z-30 flex items-center justify-center rounded-lg p-0 transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        triggerClassName
      )}
    >
      <LinearBorder className2="transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <div className="flex h-7 w-7 items-center justify-center tablet:h-9 tablet:w-9">
          <Languages className="h-4 w-4 tablet:h-5 tablet:w-5" />
        </div>
      </LinearBorder>
    </button>
  );
}
