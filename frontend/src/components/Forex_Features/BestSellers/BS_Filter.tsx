"use client";

import { Button } from "@/components/ui/button";
import { cn, handleSetSearchParams } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons/lib";
import { useTranslations } from "next-intl";

import Create_BS from "./Create_BS";
import useIsArabic from "@/hooks/useIsArabic";

export default function BS_Filter() {
  const t = useTranslations("BestSellers");
  const searchParams = useSearchParams();
  const router = useRouter();
  const isArabic = useIsArabic();

  const categories: { name: string; value: string; icon?: IconType }[] = [
    { name: t("all"), value: "" },
    { name: t("crypto"), value: "CRYPTO" },
    { name: t("stock"), value: "STOCK" },
  ];

  const dateRange: { name: string; value: string; icon?: IconType }[] = [
    { name: t("weekly"), value: "weeklyRank" },
    { name: t("monthly"), value: "monthlyRank" },
  ];

  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "";

  const handleSetUrl = (value: Record<string, string>) => {
    handleSetSearchParams(value, searchParams, router);
  };

  return (
    <div className="flex gap-2 md:gap-4 items-center justify-between">
      <div className="flex gap-2 md:gap-4 items-center">
        {categories.map((item) => {
          const isActive = type === item.value;
          return (
            <Button
              key={item.value}
              className={cn(
                "px-3! sm:px-6! text-xs sm:text-sm",
                isArabic && "font-semibold"
              )}
              onClick={() => handleSetUrl({ type: item.value })}
              variant={isActive ? "outline" : "outline2"}
            >
              {item.icon && (
                <item.icon
                  className={cn("text-primary", isActive && "text-foreground")}
                />
              )}
              {item.name}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-2 md:gap-4 items-center">
        {dateRange.map((item) => {
          const isActive = sort === item.value;
          return (
            <Button
              key={item.value}
              className={cn(
                "px-3! sm:px-6! text-xs sm:text-sm",
                isArabic && "font-semibold"
              )}
              onClick={() => handleSetUrl({ sort: item.value })}
              variant={isActive ? "outline" : "outline2"}
            >
              {item.icon && (
                <item.icon
                  className={cn("text-primary", isActive && "text-foreground")}
                />
              )}
              {item.name}
            </Button>
          );
        })}

        <Create_BS />
      </div>
    </div>
  );
}
