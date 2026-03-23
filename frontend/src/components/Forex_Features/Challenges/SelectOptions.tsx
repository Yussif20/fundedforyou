"use client";

import CustomSlider from "@/components/Global/CustomSlider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrencyShort } from "@/lib/formatCurrencyShort ";
import { cn, handleSetSearchParams } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useIsArabic from "@/hooks/useIsArabic";

type PropType = {
  cols?: number;
  options: { name: string; value: string }[];
  name: string;
  title: string;
  defaultValue?: string;
  triggerClassName?: string;
  forceDir?: "ltr" | "rtl";
  custom?: {
    show: true;
    max: number;
    min: number;
    identifier?: string;
  };
};

export default function SelectOptions({
  cols,
  options,
  name,
  title,
  custom,
  defaultValue,
  triggerClassName,
  forceDir,
}: PropType) {
  const text = useTranslations("SelectOption");
  const isArabic = useIsArabic();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoriesText = searchParams.get(name) || "";
  const categories = categoriesText ? categoriesText.split(",") : [];
  const hasAppliedDefault = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Set default value only on initial load when no param exists (e.g. 100k for size filter)
  // Don't re-apply when user explicitly clears the selection
  useEffect(() => {
    if (hasAppliedDefault.current) return;
    const hasParam =
      searchParams.get(name) || searchParams.get(`${name}_range`);
    if (hasParam) {
      hasAppliedDefault.current = true;
      return;
    }
    if (defaultValue) {
      hasAppliedDefault.current = true;
      handleSetSearchParams({ [name]: defaultValue }, searchParams, router);
    }
  }, [defaultValue, name, searchParams, router]);
  const rangeText = searchParams.get(`${name}_range`);
  const range = rangeText?.split("-").map(Number) || [];
  const isCustom = !!rangeText;

  const handleSetCategory = (value: string) => {
    const isExist = categories.find((item) => item === value);
    const newCategories = isExist
      ? categories.filter((item) => item !== value)
      : [...categories, value];
    handleSetSearchParams(
      { [name]: newCategories.join(","), [`${name}_range`]: "", page: "1" },
      searchParams,
      router,
    );
  };

  const handleSetRange = (range: string) => {
    handleSetSearchParams(
      { [`${name}_range`]: range, [name]: "", page: "1" },
      searchParams,
      router,
    );
  };
  const showingText = isCustom
    ? `${custom?.identifier || "$"}${formatCurrencyShort(range[0], false)} - ${
        custom?.identifier || "$"
      }${formatCurrencyShort(range[1], false)}`
    : categories.length < 1
      ? text("select")
      : categories.length === 1
        ? options.find((item) => item.value === categories[0])?.name
        : text("multiple");

  const hasSelection = categories.length >= 1 || isCustom;
  const baseCols = cols
    ? cols
    : options.length < 6
      ? 2
      : options.length > 7
        ? 4
        : 3;
  // On mobile, limit to 2 columns max for better responsiveness
  const usableCols = isMobile ? Math.min(baseCols, 2) : baseCols;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button
            className={cn(
              "h-8 px-2 text-[11px] sm:h-9 sm:px-3 sm:text-xs md:text-sm transition-all",
              isArabic && "font-semibold",
              hasSelection &&
                "ring-2 ring-primary/25 bg-primary/5 border-primary/40 hover:bg-primary/10 hover:ring-primary/35",
              triggerClassName,
            )}
            variant={"outline2"}
          >
            {title}:{" "}
            <span dir={forceDir} className={cn(hasSelection && "font-semibold text-primary")}>
              {showingText}
            </span>{" "}
            <ChevronDown
              className={cn(
                "size-3.5 opacity-70",
                hasSelection && "opacity-90",
              )}
            />
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1.5 sm:p-2 min-w-[8rem] sm:min-w-[10rem] max-w-[calc(100vw-2rem)] sm:max-w-none">
        <div className="p-1 sm:p-2 space-y-2.5 sm:space-y-4">
          <h2 className="text-[10px] sm:text-sm font-semibold text-muted-foreground">
            {text("selectOneOrMultiple")}
          </h2>
          <div
            className="grid gap-1.5 sm:gap-2"
            style={{
              gridTemplateColumns: `repeat(${usableCols}, 1fr)`,
              ...(isArabic && forceDir !== "ltr" && { direction: "rtl" }),
            }}
          >
            {options.map((item) => {
              const isExist = categories.find((cat) => cat === item.value);
              return (
                <Button
                  onClick={() => handleSetCategory(item.value)}
                  className={cn(
                    "w-full relative gap-1 sm:gap-2 transition-all text-[10px] sm:text-sm h-7 sm:h-9 px-1.5 sm:px-4",
                    isArabic && "font-semibold",
                    isExist
                      ? "bg-primary/10 border border-primary/60 text-primary font-semibold shadow-sm ring-1 ring-primary/20 hover:bg-primary/15 hover:border-primary/80 hover:ring-primary/30"
                      : "border border-transparent hover:bg-muted/50",
                  )}
                  variant="outline2"
                  key={item.value}
                >
                  {isExist && (
                    <span className="flex size-3.5 sm:size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Check
                        className="size-2 sm:size-3 text-primary"
                        strokeWidth={2.5}
                      />
                    </span>
                  )}
                  <span dir={forceDir} className="flex-1 text-start">{item.name}</span>
                </Button>
              );
            })}
          </div>
          {custom && custom.show && (
            <>
              <Button
                onClick={() =>
                  handleSetRange(
                    isCustom ? "" : [custom.min, custom.max].join(","),
                  )
                }
                className={cn(
                  "w-full relative gap-1 sm:gap-2 transition-all text-[10px] sm:text-sm h-7 sm:h-10 px-1.5 sm:px-6",
                  isArabic && "font-semibold",
                  isCustom
                    ? "bg-primary/10 border border-primary/60 text-primary font-semibold shadow-sm ring-1 ring-primary/20 hover:bg-primary/15 hover:border-primary/80 hover:ring-primary/30"
                    : "border border-transparent hover:bg-muted/50",
                )}
                variant="outline2"
              >
                {isCustom && (
                  <span className="flex size-3.5 sm:size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-2 sm:size-3 text-primary" strokeWidth={2.5} />
                  </span>
                )}
                <span className="flex-1 text-center">{text("custom")}</span>
              </Button>
              {isCustom && (
                <CustomSlider
                  min={custom.min}
                  max={custom.max}
                  extraQuery={{ [name]: "" }}
                  name={`${name}_range`}
                />
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
