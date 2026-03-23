"use client";

import SearchInputField from "@/components/Forms/SearchInputField";
import { handleSetSearchParams, cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { UserRole } from "@/types";
import useIsArabic from "@/hooks/useIsArabic";
import AddNewOffer from "./AddNewOffer";
import OfferFilter from "./OfferFilter";
import OfferList from "./OfferList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const DEBOUNCE_MS = 300;

export default function Offers({
  initialSearchParams: _initialSearchParams,
}: {
  initialSearchParams?: Record<string, string>;
} = {}) {
  const currUser = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Search");
  const isArabic = useIsArabic();
  const marketType = pathname.includes("futures") ? "futures" : "forex";
  const urlSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  useEffect(() => {
    const storageKey = "ffy_marketType_offers";
    const prev = typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;
    if (prev !== null && prev !== marketType) {
      handleSetSearchParams({ page: "1" }, searchParamsRef.current, router);
    }
    if (typeof window !== "undefined") sessionStorage.setItem(storageKey, marketType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketType, router]);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const applySearch = useCallback(
    (value: string) => {
      handleSetSearchParams({ search: value, page: "1" }, searchParams, router);
    },
    [searchParams, router]
  );

  const handleChange = useCallback(
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

  const handleSubmit = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    applySearch(searchInput);
  }, [applySearch, searchInput]);

  const isCurrentMonth = searchParams.get("isCurrentMonth") || "";
  const isExclusive = pathname.includes("exclusive-offers");
  const filterKey = `${isExclusive}-${isCurrentMonth}`;

  return (
    <div className="space-y-8 pb-10 md:pb-14">
      <div className="w-full flex flex-col lg:flex-row gap-5 items-end overflow-x-hidden">
        <div className="flex-1 flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-4 items-center order-2 lg:order-1">
          <OfferFilter />
          {currUser && currUser.role !== UserRole.USER && <AddNewOffer />}
        </div>
        <div className={cn("w-full lg:w-auto lg:shrink-0 flex items-center gap-2 order-1 lg:order-2", isArabic ? "ml-0 mr-auto" : "mr-0 ml-auto")}>
          <div className="flex-1 min-w-0 lg:w-[13rem]">
            <SearchInputField
              value={searchInput}
              onChange={handleChange}
              onSubmit={handleSubmit}
              placeholder={t("searchPlaceholder")}
            />
          </div>
        </div>
      </div>
      <OfferList key={filterKey} />
    </div>
  );
}
