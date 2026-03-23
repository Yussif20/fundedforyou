"use client";

import SearchInputField from "@/components/Forms/SearchInputField";
import { Button } from "@/components/ui/button";
import { cn, handleSetSearchParams } from "@/lib/utils";
import { ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons/lib";
import { useTranslations } from "next-intl";
import useIsArabic from "@/hooks/useIsArabic";
import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 300;

export default function SpreadFilter() {
  const t = useTranslations("Spread");
  const tSearch = useTranslations("Search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "";
  const filterOpen = searchParams.get("filterOpen") === "true" ? true : false;
  const isArabic = useIsArabic();
  const urlSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const applySearch = useCallback(
    (value: string) => {
      handleSetSearchParams({ search: value, page: "1" }, searchParams, router);
    },
    [searchParams, router]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        applySearch(value);
        debounceRef.current = null;
      }, DEBOUNCE_MS);
    },
    [applySearch]
  );

  const handleSearchSubmit = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    applySearch(searchInput);
  }, [applySearch, searchInput]);

  const handleSetUrl = (value: Record<string, string>) => {
    handleSetSearchParams(value, searchParams, router);
  };

  const categories: { name: string; value: string; icon?: IconType }[] = [
    { name: t("popular"), value: "" },
    { name: t("forex"), value: "FOREX" },
    { name: t("crypto"), value: "CRYPTO" },
    { name: t("indices"), value: "INDICES" },
    { name: t("metals"), value: "METALS" },
  ];

  return (
    <div className="flex gap-4 items-center justify-between flex-col lg:flex-row">
      <div className="flex gap-2 md:gap-4 items-center overflow-x-auto max-w-full">
        <Button
          className={cn(
            "px-3! sm:px-6! text-xs sm:text-sm",
            isArabic ? "text-base font-semibold" : ""
          )}
          onClick={() => handleSetUrl({ filterOpen: filterOpen ? "" : "true" })}
          variant={filterOpen ? "defaultBH" : "secondary"}
        >
          <ListFilter /> {t("filter")}
        </Button>
        {categories.map((item) => {
          const isActive = category === item.value;
          return (
            <Button
              key={item.value}
              className={cn(
                "px-3! sm:px-6! text-xs sm:text-sm",
                isArabic ? "text-base font-semibold" : ""
              )}
              onClick={() => handleSetUrl({ category: item.value })}
              variant={isActive ? "default" : "outline"}
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
      <SearchInputField
        value={searchInput}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        placeholder={tSearch("searchPlaceholder")}
        className="w-full max-w-none"
      />
    </div>
  );
}
