"use client";

import { AddFirmDialog } from "@/components/FirmDetails/AddFirmDialog";
import SearchInputField from "@/components/Forms/SearchInputField";
import CustomizeColumnsDialog from "@/components/Global/CustomizeColumnsDialog";
import { useQueryBuilder } from "@/hooks/usePagination";
import useIsArabic from "@/hooks/useIsArabic";
import { useColumnCustomization } from "@/hooks/useColumnCustomization";
import { handleSetSearchParams, cn } from "@/lib/utils";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useAppSelector } from "@/redux/store";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import FirmAllFilters from "./FirmAllFilters";
import FirmsFilter from "./FirmsFilter";
import FirmTable, { ALL_FIRM_COLUMNS } from "./FirmTable";

export default function Firms({
  initialSearchParams: _initialSearchParams,
}: {
  initialSearchParams?: Record<string, string>;
} = {}) {
  const { getParamsWithKey } = useQueryBuilder();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const isFuturesPage = pathname.includes("futures");
  const marketType = pathname.includes("futures") ? "futures" : "forex";
  const isArabic = useIsArabic();
  const t = useTranslations("Search");
  const tFirms = useTranslations("Firms");
  const router = useRouter();

  const {
    visibility,
    order,
    toggleVisibility,
    reorder,
    resetToDefaults,
    setAllVisibility,
    orderedVisibleKeys,
    columns,
  } = useColumnCustomization("firm-table-columns", ALL_FIRM_COLUMNS);
  const page = getParamsWithKey("page", 1);
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  useEffect(() => {
    const storageKey = "ffy_marketType_firms";
    const prev =
      typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;
    if (prev !== null && prev !== marketType) {
      handleSetSearchParams({ page: "1" }, searchParamsRef.current, router);
    }
    if (typeof window !== "undefined")
      sessionStorage.setItem(storageKey, marketType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketType, router]);

  const limit = getParamsWithKey("limit", 10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm] = useDebounce(searchInput, 300);
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      handleSetSearchParams({ page: "1" }, searchParams, router);
    },
    [searchParams, router],
  );
  const assets = searchParams.get("assets") || "";
  const countries = searchParams.get("countries") || "";
  const range_maxAllocation = searchParams.get("range_maxAllocation") || "";
  const paymentMethodsArray_id = searchParams.get("paymentMethods") || "";
  const payoutMethodsArray_id = searchParams.get("payoutMethods") || "";
  const array_typeOfInstruments =
    searchParams.get("array_typeOfInstruments") || "";
  const brokersArray_id = searchParams.get("brokers") || "";
  const platformsArray_id = searchParams.get("platforms") || "";
  const sort = searchParams.get("sort") || "";
  const category = getParamsWithKey("category");
  const drawdown = searchParams.get("drawdown") || "";
  const otherFeatures = searchParams.get("otherFeatures") || "";
  const programType = searchParams.get("programType") || "";
  const query = [
    page,
    limit,
    { name: "searchTerm", value: searchTerm },
    { name: "leverages.array_assets", value: assets },
    { name: "arraySome_countries", value: countries },
    { name: "range_maxAllocation", value: range_maxAllocation },
    { name: "paymentMethods.array_id", value: paymentMethodsArray_id },
    { name: "payoutMethods.array_id", value: payoutMethodsArray_id },
    { name: "array_typeOfInstruments", value: array_typeOfInstruments },
    { name: "brokers.array_id", value: brokersArray_id },
    { name: "platforms.array_id", value: platformsArray_id },
    category,
    {
      name: "firmType",
      value: isFuturesPage ? "FUTURES" : "FOREX",
    },
  ];
  if (drawdown) {
    query.push({ name: "array_drawDowns", value: drawdown });
  }
  if (otherFeatures) {
    query.push({ name: "array_otherFeatures", value: otherFeatures });
  }
  if (programType) {
    query.push({ name: "oneItemArray_programTypes", value: programType });
  }
  if (sort) {
    let value = sort[0] === "-" ? sort.slice(1) : sort;
    const valuePrefix = sort[0] === "-" ? "-" : "";
    if (value === "assets") value = "leverages._count";
    if (value === "platforms") value = "platforms._count";
    if (value === "discount") return;
    query.push({ name: "sort", value: valuePrefix + value });
  }

  const { data: dataRaw, isLoading, isFetching } = useGetAllFirmsQuery(query);

  const firms = dataRaw?.firms || [];
  const firmsMeta = dataRaw?.meta || {};

  return (
    <div className="space-y-8 pb-10 md:pb-14">
      <div className="flex items-start gap-0 lg:gap-6 w-full">
        <div className="w-0 min-w-0 max-w-0 overflow-hidden lg:w-auto lg:max-w-sm lg:overflow-visible flex shrink-0">
          <FirmAllFilters />
        </div>

        <div className="flex-1 min-w-0 space-y-8">
          <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 items-end overflow-x-clip">
            {/* Mobile: Search + Customize + Filter in one row, centered */}
            <div className="w-full flex flex-row items-center justify-center gap-2 lg:hidden">
              <FirmsFilter />
              <CustomizeColumnsDialog
                columns={columns}
                visibility={visibility}
                order={order}
                orderedVisibleKeys={orderedVisibleKeys}
                toggleVisibility={toggleVisibility}
                setAllVisibility={setAllVisibility}
                reorder={reorder}
                resetToDefaults={resetToDefaults}
                t={tFirms}
              />
              <div className="w-[6.5rem] sm:w-auto">
                <SearchInputField
                  value={searchInput}
                  onChange={(v) => handleSearchChange(v)}
                  onSubmit={() => handleSearchChange(searchInput)}
                  placeholder={t("searchPlaceholder")}
                />
              </div>
            </div>
            {user?.role === "SUPER_ADMIN" && (
              <div className="w-full flex justify-center lg:hidden">
                <AddFirmDialog />
              </div>
            )}
            {/* Desktop: original layout */}
            <div className="hidden lg:flex w-full lg:flex-1 flex-wrap justify-start gap-2 md:gap-4 items-center order-2 lg:order-1">
              <FirmsFilter />
              <div className="w-px h-6 bg-border" />
              {user?.role === "SUPER_ADMIN" && <AddFirmDialog />}
            </div>
            <div
              className={cn(
                "hidden lg:flex w-full lg:w-auto lg:shrink-0 items-center gap-2 order-1 lg:order-2",
                isArabic ? "ml-0 mr-auto" : "mr-0 ml-auto",
              )}
            >
              <CustomizeColumnsDialog
                columns={columns}
                visibility={visibility}
                order={order}
                orderedVisibleKeys={orderedVisibleKeys}
                toggleVisibility={toggleVisibility}
                setAllVisibility={setAllVisibility}
                reorder={reorder}
                resetToDefaults={resetToDefaults}
                t={tFirms}
              />
              <div className="flex-1 min-w-0 lg:w-[13rem]">
                <SearchInputField
                  value={searchInput}
                  onChange={(v) => handleSearchChange(v)}
                  onSubmit={() => handleSearchChange(searchInput)}
                  placeholder={t("searchPlaceholder")}
                />
              </div>
            </div>
          </div>

          <div className="-ms-5 -me-5 px-2 md:ms-0 md:me-0 md:px-0">
            <FirmTable
              firms={firms}
              // @ts-ignore
              meta={firmsMeta}
              isFuturesPage={isFuturesPage}
              isLoading={isLoading || isFetching}
              orderedVisibleKeys={orderedVisibleKeys}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
