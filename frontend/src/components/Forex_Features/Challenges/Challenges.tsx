"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { handleSetSearchParams } from "@/lib/utils";
import { useColumnCustomization } from "@/hooks/useColumnCustomization";
import CustomizeColumnsDialog from "@/components/Global/CustomizeColumnsDialog";
import FirmAllFilters from "../Firms/FirmAllFilters";
import ChallengeFilter from "./ChallengeFilter";
import ChallengeTable, { CHALLENGE_COLUMNS, FUTURES_CHALLENGE_COLUMNS } from "./ChallengeTable";

export default function Challenges({
  locale,
  initialSearchParams,
}: {
  locale: string;
  initialSearchParams?: Record<string, string>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tChallenges = useTranslations("Challenges");
  const marketType = pathname.includes("futures") ? "futures" : "forex";
  const isFutures = marketType === "futures";
  const columnDefs = isFutures ? FUTURES_CHALLENGE_COLUMNS : CHALLENGE_COLUMNS;
  const storageKey = isFutures ? "challenge-table-columns-v2-futures-v2" : "challenge-table-columns-v2";

  const {
    visibility,
    order,
    toggleVisibility,
    reorder,
    resetToDefaults,
    setAllVisibility,
    orderedVisibleKeys,
    columns,
  } = useColumnCustomization(storageKey, columnDefs);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm] = useDebounce(searchInput, 300);
  const [showDiscount, setShowDiscount] = useState(true);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  useEffect(() => {
    const storageKey = "ffy_marketType_challenges";
    const prev = typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;
    if (prev !== null && prev !== marketType) {
      handleSetSearchParams({ page: "1" }, searchParamsRef.current, router);
    }
    if (typeof window !== "undefined") sessionStorage.setItem(storageKey, marketType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketType, router]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      handleSetSearchParams({ page: "1" }, searchParams, router);
    },
    [searchParams, router]
  );

  return (
    <div className="space-y-8 pb-10 md:pb-14">
      <div className="flex items-start gap-0 lg:gap-6 w-full">
        <div className="w-0 min-w-0 max-w-0 overflow-hidden lg:w-auto lg:max-w-sm lg:overflow-visible flex shrink-0">
          <FirmAllFilters showCompanyFilter />
        </div>
        <div className="flex-1 min-w-0 space-y-8">
          <ChallengeFilter
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            initialSearchParams={initialSearchParams}
            beforeFilter={
              <>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className={`text-sm font-medium transition-colors ${showDiscount ? "text-primary" : "text-muted-foreground"}`}>
                    {tChallenges("applyDiscount")}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showDiscount}
                    onClick={() => setShowDiscount((v) => !v)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      showDiscount
                        ? "bg-primary border-primary/30"
                        : "bg-muted border-border/60"
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                        showDiscount ? "ltr:translate-x-4 rtl:-translate-x-4" : "ltr:translate-x-0.5 rtl:-translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
              </>
            }
            customizeSlot={
              <CustomizeColumnsDialog
                columns={columns}
                visibility={visibility}
                order={order}
                orderedVisibleKeys={orderedVisibleKeys}
                toggleVisibility={toggleVisibility}
                setAllVisibility={setAllVisibility}
                reorder={reorder}
                resetToDefaults={resetToDefaults}
                t={tChallenges}
              />
            }
          />
          <div className="-ms-5 -me-5 px-2 md:ms-0 md:me-0 md:px-0">
            <ChallengeTable
              locale={locale}
              searchTermFromState={searchTerm}
              orderedVisibleKeys={orderedVisibleKeys}
              showDiscount={showDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
