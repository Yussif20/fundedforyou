"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import LinearBorder from "@/components/Global/LinearBorder";
import useIsArabic from "@/hooks/useIsArabic";

type SearchInputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
};

export default function SearchInputField({
  value,
  onChange,
  onSubmit,
  placeholder = "Search Here",
  className,
  "aria-label": ariaLabel = placeholder,
}: SearchInputFieldProps) {
  const isArabic = useIsArabic();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn("w-full", className)}
    >
      <LinearBorder className="w-full max-w-full rounded-full">
        <div className={cn("relative flex items-center w-full", isArabic && "flex-row-reverse")}>
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10 text-muted-foreground pointer-events-none",
              isArabic ? "right-3" : "left-3"
            )}
          >
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="search"
            withoutLinearBorder
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            dir={isArabic ? "rtl" : "ltr"}
            className={cn(
              "h-8 sm:h-9 w-full flex-1 min-w-0 pl-7 sm:pl-9 pr-3 rounded-full border-0 bg-transparent text-[11px] sm:text-xs md:text-sm",
              isArabic ? "pr-7 sm:pr-9 pl-3 text-[11px] sm:text-xs md:text-base font-semibold text-right" : ""
            )}
            aria-label={ariaLabel}
          />
        </div>
      </LinearBorder>
    </form>
  );
}
