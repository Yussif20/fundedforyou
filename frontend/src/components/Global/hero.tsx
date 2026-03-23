"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import HeroScene from "@/components/3d/HeroScene";
import Container from "./Container";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
};

const COLOR_SCHEMES = {
  forex:   { spotlight: "#00e05c", candlestick: "#00e05c" },
  futures: { spotlight: "#ffe000", candlestick: "#ffe000" },
} as const;

export default function Hero() {
  const pathname = usePathname();
  const isFutures = pathname.startsWith("/futures");
  const t = useTranslations("HomePage");
  const locale = useLocale();

  const currentColors = isFutures ? COLOR_SCHEMES.futures : COLOR_SCHEMES.forex;
  const isArabic = locale === "ar";

  return (
    <div
      id="top"
      className="relative overflow-x-clip bg-background min-h-[55vh] lg:min-h-[60vh] lg:px-4"
    >
      {/* Mobile / tablet decorative background (hidden on lg+) */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
        {/* Large central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
        {/* Top-right accent */}
        <div className="absolute -top-20 -right-20 w-[350px] h-[350px] rounded-full bg-primary/6 blur-[90px]" />
        {/* Bottom-left accent */}
        <div className="absolute -bottom-10 -left-10 w-[280px] h-[280px] rounded-full bg-primary/5 blur-[80px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Bottom vignette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-background to-transparent" />

      {/* Text-side readability fade — desktop only */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 z-10 hidden lg:block",
          isArabic
            ? "right-0 w-[40%] bg-linear-to-l from-background/50 to-transparent"
            : "left-0 w-[40%] bg-linear-to-r from-background/50 to-transparent",
        )}
      />

      {/* ── Layout ──
          Mobile/tablet : centered content, proper padding.
          Desktop (lg+) : strict 1/3 text | 2/3 3D side-by-side, both inside Container. */}
      <div className="relative z-20 flex min-h-[55vh] lg:min-h-[60vh] items-stretch">
        <Container className="w-full px-6 sm:px-8 lg:px-5 flex">
          <div className="flex w-full items-center py-16 md:py-24 lg:py-28">

            {/* Text column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                "pointer-events-auto",
                "flex flex-col gap-5 sm:gap-7 lg:gap-7",
                // Mobile/tablet: constrained width, centered; desktop: full width so title spans both lines
                "w-full max-w-xl max-lg:mx-auto lg:max-w-none",
                !isArabic && "items-center lg:items-start",
                isArabic && "items-center lg:items-end",
              )}
            >
              {/* Heading */}
              <motion.h1
                variants={itemVariants}
                className={cn(
                  "font-extrabold tracking-tight",
                  isArabic
                    ? "text-2xl sm:text-3xl lg:text-[34px] xl:text-[34px] 2xl:text-[34px]"
                    : "text-3xl sm:text-4xl lg:text-[34px] xl:text-[34px] 2xl:text-[34px]",
                  "w-full text-center leading-[1.4]",
                  !isArabic && "lg:text-left",
                  isArabic && "lg:text-right",
                )}
              >
                {t("heroTitle.title1")}
                <span className="block mt-1 sm:mt-2"> {t("heroTitle.title2")}</span>
                <span className="text-primary block mt-1 sm:mt-2"> {t("heroTitle.title3")}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className={cn(
                  "text-muted-foreground/90 leading-relaxed",
                  "text-[12px] sm:text-base lg:text-lg",
                  "w-full max-w-xs sm:max-w-sm lg:max-w-none",
                  "text-center",
                  !isArabic && "lg:text-left",
                  isArabic && "lg:text-right",
                )}
              >
                {t("heroTitle.subtitle")}
              </motion.p>
            </motion.div>

            {/* 3D — desktop only, absolutely overlays right (LTR) or left (RTL) portion of container */}
            <div
              className={cn(
                "hidden lg:absolute lg:inset-y-0 lg:block lg:w-[77%]",
                isArabic ? "left-0" : "right-0",
              )}
            >
              <HeroScene
                spotlightColor={currentColors.spotlight}
                candlestickColor={currentColors.candlestick}
                mirror={isArabic}
              />
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
