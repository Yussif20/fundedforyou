"use client";
import { Button } from "@/components/ui/button";
import { cn, handleSetSearchParams } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import useIsArabic from "@/hooks/useIsArabic";

const FILTER_KEYS = [
  "in_firmId", "countries", "paymentMethods", "payoutMethods",
  "drawdown", "otherFeatures", "programType", "platforms", "range_maxAllocation",
];

export default function FirmsFilter() {
  const t = useTranslations("Filters");
  const searchParams = useSearchParams();
  const isArabic = useIsArabic();
  const router = useRouter();
  const filterOpen = searchParams.get("filterOpen") === "true" ? true : false;

  const activeFilterCount = FILTER_KEYS.filter((key) => {
    const val = searchParams.get(key);
    if (!val) return false;
    if (key === "range_maxAllocation") return val !== "100000,6000000";
    return true;
  }).length;
  const hasActiveFilters = activeFilterCount > 0;

  const handleSetCategory = (value: Record<string, string>) => {
    handleSetSearchParams(value, searchParams, router);
  };
  return (
    <Button
      className={cn(
        "h-8 px-2 text-[11px] sm:h-9 sm:px-3 sm:text-xs md:text-sm",
        isArabic ? "md:text-base font-semibold" : "",
        hasActiveFilters && !filterOpen && "border-primary/60 ring-1 ring-primary/20 bg-primary/10",
      )}
      onClick={() => {
        handleSetCategory({ filterOpen: filterOpen ? "" : "true" });
      }}
      variant={filterOpen ? "defaultBH" : "outline2"}
    >
      <Filter className="size-3.5 sm:size-4" /> {t("filter")}
      {hasActiveFilters && (
        <span className="inline-flex items-center justify-center size-4 sm:size-5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-medium">
          {activeFilterCount}
        </span>
      )}
    </Button>
  );
}
