"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import SwitchIcon from "./Icons/SwitchIcon";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import useIsArabic from "@/hooks/useIsArabic";
import { motion } from "framer-motion";
import { useState, useEffect, useId } from "react";

export default function FFT_Buttons({ compact }: { compact?: boolean }) {
  const id = useId();
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isArabic = useIsArabic();

  const routerIsFutures =
    pathname.startsWith("/futures") ||
    searchParams.get("type")?.toLowerCase() === "futures";

  // Optimistic state — updates immediately on click so animation doesn't
  // wait for Next.js router to finish navigating.
  const [isFutures, setIsFutures] = useState(routerIsFutures);
  const [rotation, setRotation] = useState(routerIsFutures ? 180 : 0);

  // Keep in sync when pathname changes externally (back/forward navigation).
  useEffect(() => {
    setIsFutures(routerIsFutures);
  }, [routerIsFutures]);

  const handleChange = (value: "/forex" | "/futures") => {
    const newIsFutures = value === "/futures";
    if (newIsFutures === isFutures) return;

    // Animate immediately — no waiting for the router.
    setIsFutures(newIsFutures);
    setRotation((prev) => prev + 180);

    window.scrollTo({ top: 0, behavior: "instant" });

    // On the comparison page, toggle the type param instead of changing the base path
    if (pathname === "/comparison") {
      router.push(
        `/comparison?type=${newIsFutures ? "futures" : "forex"}`,
        { scroll: false }
      );
      return;
    }

    const currentBase = isFutures ? "/futures" : "/forex";
    const strippedPath = pathname.startsWith(currentBase)
      ? pathname.slice(currentBase.length)
      : "";

    // Apply default filters on challenges page, reset everything else
    const isChallengePage = strippedPath.startsWith("/challenges");
    const suffix = isChallengePage ? "?size=100000&in_steps=STEP1" : "";
    router.push(value + strippedPath + suffix, { scroll: false });
  };

  return (
    <div
      className={cn(
        "max-w-max flex justify-center items-center rounded-full",
        compact ? "gap-1 rounded-xl py-0.5" : "gap-1 sm:gap-2",
      )}
    >
      {/* Forex Button */}
      <div className="relative">
        {!isFutures && (
          <motion.div
            layoutId={`fft-pill-${id}`}
            className="absolute inset-0 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Button
          className={cn(
            "relative z-10 rounded-full! bg-transparent! hover:bg-white/10!",
            compact
              ? "h-7 min-w-14 px-2! text-xs"
              : "px-2! sm:px-4! h-8 sm:h-9 min-w-20 sm:min-w-24",
            isArabic && !compact && "text-base md:text-lg",
          )}
          variant="ghost"
          onClick={() => handleChange("/forex")}
        >
          {t("forex")}
        </Button>
      </div>

      {/* Switch Icons */}
      <motion.div
        className={cn("max-w-max", compact && "scale-75")}
        animate={{ rotate: rotation }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <SwitchIcon className="text-success" />
        <SwitchIcon className="rotate-180 -mt-0.5 text-primary-dark" />
      </motion.div>

      {/* Futures Button */}
      <div className="relative">
        {isFutures && (
          <motion.div
            layoutId={`fft-pill-${id}`}
            className="absolute inset-0 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Button
          className={cn(
            "relative z-10 rounded-full! bg-transparent! hover:bg-white/10!",
            compact
              ? "h-7 min-w-14 px-2! text-xs"
              : "px-2! sm:px-4! h-8 sm:h-9 min-w-20 sm:min-w-24",
            isArabic && !compact && "text-base md:text-lg",
          )}
          variant="ghost"
          onClick={() => handleChange("/futures")}
        >
          {t("futures")}
        </Button>
      </div>
    </div>
  );
}
