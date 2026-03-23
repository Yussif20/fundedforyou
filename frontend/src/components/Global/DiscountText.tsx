"use client";
import { cn } from "@/lib/utils";
import useIsArabic from "@/hooks/useIsArabic";
import { visibleText } from "@/utils/visibleText";
import { useTranslations } from "next-intl";

export default function DiscountText({
  percentage,
  className,
  mainClassName,
  discountType,
  discountText,
  discountTextArabic,
}: {
  percentage: number;
  className?: string;
  mainClassName?: string;
  discountType?: "PERCENTAGE" | "TEXT" | string;
  discountText?: string;
  discountTextArabic?: string;
}) {
  const t = useTranslations("Features");
  const isArabic = useIsArabic();

  if (discountType === "TEXT") {
    const text = visibleText(isArabic, discountText, discountTextArabic);
    if (!text) return null;
    return (
      <div
        className={cn(
          "inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0 px-4 py-2 min-w-0",
          mainClassName
        )}
      >
        <span className={cn("whitespace-nowrap shrink-0", className)}>
          {text}
        </span>
      </div>
    );
  }

  // PERCENTAGE mode (default)
  if (percentage === 0) return null;

  return (
    <div
      dir="ltr"
      className={cn(
        "inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0 px-4 py-2 min-w-0",
        mainClassName
      )}
    >
      <span className="whitespace-nowrap shrink-0">{percentage} %</span>
      <span className={cn("whitespace-nowrap shrink-0", className)}>
        {t("offLabel")}
      </span>
    </div>
  );
}
