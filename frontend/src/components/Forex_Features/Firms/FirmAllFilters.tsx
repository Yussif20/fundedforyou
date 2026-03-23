"use client";

import CustomSlider from "@/components/Global/CustomSlider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGetAllPaymentMethodQuery } from "@/redux/api/paymentMethodApi";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useGetPlatformsQuery } from "@/redux/api/spreadApi";
import { PaymentMethod } from "@/types/payment-method";
import { Platform_T } from "@/types/spread.types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useIsFutures from "@/hooks/useIsFutures";

const handleSetSearchParams = (
  params: Record<string, string>,
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>,
) => {
  const newParams = new URLSearchParams(searchParams.toString());

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, JSON.stringify(value));
    } else {
      newParams.set(key, String(value));
    }
  });

  router.push(`?${newParams.toString()}`, { scroll: false });
};

const COMPANIES_PER_PAGE = 8;

export default function FirmAllFilters({
  showCompanyFilter = false,
}: {
  showCompanyFilter?: boolean;
}) {
  const t = useTranslations("Filters");
  const [isMobile, setIsMobile] = useState(false);
  const [companyPage, setCompanyPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFutures = useIsFutures();
  const filterOpen = searchParams.get("filterOpen") === "true" ? true : false;
  const { data: dataRaw } = useGetAllPaymentMethodQuery([
    {
      name: "limit",
      value: "100",
    },
  ]);

  const { data: dataRawPlatforms } = useGetPlatformsQuery([
    {
      name: "limit",
      value: "100",
    },
  ]);

  const firmType = isFutures ? "FUTURES" : "FOREX";
  const { data: firmsData } = useGetAllFirmsQuery(
    [
      { name: "limit", value: 500 },
      { name: "firmType", value: firmType },
    ],
    { skip: !showCompanyFilter },
  );

  const paymentMethods = dataRaw?.data || [];
  const platforms = dataRawPlatforms?.data?.platforms || [];
  const firms = showCompanyFilter ? (firmsData?.firms || []) : [];

  const countryList = [
    { name: t("afghanistan"), value: "Afghanistan" },
    { name: t("algeria"), value: "Algeria" },
    { name: t("argentina"), value: "Argentina" },
    { name: t("australia"), value: "Australia" },
    { name: t("bahrain"), value: "Bahrain" },
    { name: t("brazil"), value: "Brazil" },
    { name: t("canada"), value: "Canada" },
    { name: t("chad"), value: "Chad" },
    { name: t("china"), value: "China" },
    { name: t("comoros"), value: "Comoros" },
    { name: t("djibouti"), value: "Djibouti" },
    { name: t("egypt"), value: "Egypt" },
    { name: t("france"), value: "France" },
    { name: t("germany"), value: "Germany" },
    { name: t("ghana"), value: "Ghana" },
    { name: t("hongKong"), value: "Hong Kong" },
    { name: t("india"), value: "India" },
    { name: t("indonesia"), value: "Indonesia" },
    { name: t("iran"), value: "Iran" },
    { name: t("iraq"), value: "Iraq" },
    { name: t("italy"), value: "Italy" },
    { name: t("jordan"), value: "Jordan" },
    { name: t("kenya"), value: "Kenya" },
    { name: t("kuwait"), value: "Kuwait" },
    { name: t("lebanon"), value: "Lebanon" },
    { name: t("libya"), value: "Libya" },
    { name: t("malaysia"), value: "Malaysia" },
    { name: t("mauritania"), value: "Mauritania" },
    { name: t("morocco"), value: "Morocco" },
    { name: t("netherlands"), value: "Netherlands" },
    { name: t("nigeria"), value: "Nigeria" },
    { name: t("oman"), value: "Oman" },
    { name: t("pakistan"), value: "Pakistan" },
    { name: t("palestine"), value: "Palestine" },
    { name: t("philippines"), value: "Philippines" },
    { name: t("poland"), value: "Poland" },
    { name: t("qatar"), value: "Qatar" },
    { name: t("russia"), value: "Russia" },
    { name: t("saudiArabia"), value: "Saudi Arabia" },
    { name: t("singapore"), value: "Singapore" },
    { name: t("somalia"), value: "Somalia" },
    { name: t("southAfrica"), value: "South Africa" },
    { name: t("southSudan"), value: "South Sudan" },
    { name: t("spain"), value: "Spain" },
    { name: t("sudan"), value: "Sudan" },
    { name: t("syria"), value: "Syria" },
    { name: t("thailand"), value: "Thailand" },
    { name: t("turkey"), value: "Turkey" },
    { name: t("tunisia"), value: "Tunisia" },
    { name: t("ukraine"), value: "Ukraine" },
    { name: t("uae"), value: "United Arab Emirates" },
    { name: t("uk"), value: "United Kingdom" },
    { name: t("us"), value: "United States" },
    { name: t("vietnam"), value: "Vietnam" },
    { name: t("yemen"), value: "Yemen" },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1040);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCompanyPage(1);
  }, [firms.length]);

  const getMaxAllocation = () => {
    const allocation = searchParams.get("range_maxAllocation");
    return allocation
      ? (allocation.split(",") || []).map((item: string) => Number(item))
      : [100000, 6000000];
  };

  const getArrayParam = (key: string) => {
    const value = searchParams.get(key);
    return value?.split(",") || [];
  };

  const filters = {
    in_firmId: getArrayParam("in_firmId"),
    paymentMethods: getArrayParam("paymentMethods"),
    payoutMethods: getArrayParam("payoutMethods"),
    platforms: getArrayParam("platforms"),
    drawdown: getArrayParam("drawdown"),
    otherFeatures: getArrayParam("otherFeatures"),
    programType: getArrayParam("programType"),
    range_maxAllocation: getMaxAllocation(),
    countries: getArrayParam("countries"),
  };

  const toggleMultiSelect = (key: string, value: string) => {
    const current = (filters[key as keyof typeof filters] as string[]) ?? [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    handleSetSearchParams(
      {
        [key]: updated.length ? updated.join(",") : "",
        page: "1",
      },
      searchParams,
      router,
    );
  };

  const resetFilters = () => {
    const params = new URLSearchParams();
    params.set("filterOpen", "true");
    const expanded = searchParams.get("expanded");
    if (expanded) params.set("expanded", expanded);
    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const getExpandedItems = () => {
    const expanded = searchParams.get("expanded");
    return expanded ? expanded.split(",") || [] : [];
  };

  const handleAccordionChange = (values: string[]) => {
    handleSetSearchParams({ expanded: values.join() }, searchParams, router);
  };

  const handleSetCategory = () => {
    handleSetSearchParams({ filterOpen: "" }, searchParams, router);
  };

  const items = (
    <>
      <Accordion
        type="multiple"
        value={getExpandedItems()}
        onValueChange={handleAccordionChange}
        className="w-full"
      >
        {/* Company - first filter (Challenges only) */}
        {showCompanyFilter && (
        <AccordionItem value="in_firmId" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("company")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            {(() => {
              const totalCompanyPages = Math.ceil(
                firms.length / COMPANIES_PER_PAGE,
              );
              const paginatedFirms = firms.slice(
                (companyPage - 1) * COMPANIES_PER_PAGE,
                companyPage * COMPANIES_PER_PAGE,
              );
              return (
                <>
                  <div className="flex flex-col gap-2">
                    {paginatedFirms.map((firm) => (
                      <button
                        type="button"
                        key={firm.id}
                        onClick={() => toggleMultiSelect("in_firmId", firm.id)}
                        className={cn(
                          "flex items-center gap-3 w-full rounded-lg border-2 p-2.5 text-left transition-colors",
                          filters["in_firmId"].includes(firm.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground/50",
                        )}
                      >
                        <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted">
                          {firm.logoUrl ? (
                            <Image
                              src={firm.logoUrl}
                              alt={firm.title}
                              fill
                              className="object-contain"
                              sizes="36px"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                              {firm.title.slice(0, 1)}
                            </span>
                          )}
                        </span>
                        <span className="truncate text-sm font-medium">
                          {firm.title}
                        </span>
                      </button>
                    ))}
                  </div>
                  {totalCompanyPages > 1 && (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        disabled={companyPage <= 1}
                        onClick={() =>
                          setCompanyPage((p) => Math.max(1, p - 1))
                        }
                      >
                        {t("previous")}
                      </Button>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {companyPage} / {totalCompanyPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        disabled={companyPage >= totalCompanyPages}
                        onClick={() =>
                          setCompanyPage((p) =>
                            Math.min(totalCompanyPages, p + 1),
                          )
                        }
                      >
                        {t("next")}
                      </Button>
                    </div>
                  )}
                </>
              );
            })()}
          </AccordionContent>
        </AccordionItem>
        )}

        <AccordionItem value="countries" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("countries")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <p className="text-xs text-gray-400 mb-3">
              {t("countriesDescription")}
            </p>
            <div className="flex flex-wrap gap-2">
              {countryList.map((country) => (
                <Badge
                  className="cursor-pointer font-bold"
                  key={country.value}
                  variant={
                    (filters["countries"] ?? []).includes(country.value)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() => toggleMultiSelect("countries", country.value)}
                >
                  {country.name}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Payment methods  */}
        <AccordionItem value="paymentMethods" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("paymentMethods")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {paymentMethods?.map((method: PaymentMethod) => (
                <Badge
                  className="cursor-pointer font-bold"
                  key={method.id}
                  variant={
                    filters["paymentMethods"].includes(method.id)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() => toggleMultiSelect("paymentMethods", method.id)}
                >
                  {method.title}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Payout methods  */}
        <AccordionItem value="payoutMethods" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("payoutMethods")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {paymentMethods?.map((method: PaymentMethod) => (
                <Badge
                  className="cursor-pointer font-bold"
                  key={method.id}
                  variant={
                    filters["payoutMethods"].includes(method.id)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() => toggleMultiSelect("payoutMethods", method.id)}
                >
                  {method.title}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* drawdown  */}
        <AccordionItem value="drawdown" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("drawdown")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {[
                { name: t("balanceBased"), value: "balanceBased" },
                { name: t("equityBased"), value: "equityBased" },
                { name: t("trailingEod"), value: "trailingEod" },
                { name: t("trailingIntraday"), value: "trailingIntraday" },
                { name: t("smartDd"), value: "smartDd" },
              ].map((method) => (
                <Badge
                  className="cursor-pointer font-bold"
                  key={method.value}
                  variant={
                    filters.drawdown.includes(method.value)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() => toggleMultiSelect("drawdown", method.value)}
                >
                  {method.name}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* otherFeatures  */}
        <AccordionItem value="otherFeatures" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("otherFeatures")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {[
                { name: t("expertAdvisor"), value: "expertAdvisor" },
                { name: t("newsTrading"), value: "newsTrading" },
                { name: t("overnightHolding"), value: "overnightHolding" },
                { name: t("tradeCopying"), value: "tradeCopying" },
              ].map((method) => (
                <Badge
                  className="cursor-pointer font-bold"
                  key={method.value}
                  variant={
                    filters.otherFeatures.includes(method.value)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() =>
                    toggleMultiSelect("otherFeatures", method.value)
                  }
                >
                  {method.name}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Assets */}
        {/* <AccordionItem value="assets" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("assets")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {[
                { name: t("fx"), value: "fx" },
                { name: t("energy"), value: "energy" },
                { name: t("stocks"), value: "stocks" },
                { name: t("crypto"), value: "crypto" },
                { name: t("indices"), value: "indices" },
                { name: t("otherCommodities"), value: "otherCommodities" },
                { name: t("metals"), value: "metals" },
              ].map((asset) => (
                <Badge
                  className="cursor-pointer"
                  key={asset.value}
                  variant={
                    filters["assets"].includes(asset.value)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() => toggleMultiSelect("assets", asset.value)}
                >
                  {asset.name}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}

        {/* Platforms */}
        <AccordionItem value="platforms" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("platforms")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform: Platform_T) => (
                <Badge
                  key={platform.id}
                  variant={
                    filters["platforms"].includes(platform.id)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() => toggleMultiSelect("platforms", platform.id)}
                  className="cursor-pointer font-bold"
                >
                  {platform.title}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Program Type */}
        <AccordionItem value="programType" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("programType")}
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {[
                { name: t("INSTANT"), value: "INSTANT" },
                { name: t("oneStep"), value: "STEP1" },
                { name: t("twoStep"), value: "STEP2" },
                { name: t("threeStep"), value: "STEP3" },
                { name: t("fourStep"), value: "STEP4" },
              ].map((type) => (
                <Badge
                  className="cursor-pointer font-bold"
                  key={type.value}
                  variant={
                    filters.programType.includes(type.value)
                      ? "defaultBH"
                      : "outline"
                  }
                  onClick={() => {
                    // Single-select: clicking the same value deselects, otherwise set to just that value
                    const current = filters.programType;
                    const newValue = current.includes(type.value) ? "" : type.value;
                    handleSetSearchParams(
                      { programType: newValue, page: "1" },
                      searchParams,
                      router,
                    );
                  }}
                >
                  {type.name}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Max Allocation */}
        <AccordionItem value="range_maxAllocation" className="border-gray-800">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            {t("maxAllocation")}
          </AccordionTrigger>
          <AccordionContent>
            <CustomSlider
              max={6000000}
              min={100000}
              name="range_maxAllocation"
              extraQuery={{ page: "1" }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
        <Button
          variant="default"
          size="lg"
          className="w-full text-base font-semibold"
          onClick={handleSetCategory}
        >
          {t("confirmFilters")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full text-base font-semibold"
          onClick={resetFilters}
        >
          {t("resetFilter")}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div
        className={cn(
          "w-sm hidden lg:block transition-all duration-300 space-y-4 rounded-lg bg-background text-foreground overflow-hidden border-2 p-4",
          !filterOpen && "w-0 border-0 p-0",
          isFutures ? "border-yellow-500/50" : "border-green-500/50",
        )}
      >
        {items}
      </div>
      {isMobile && (
        <Dialog open={filterOpen} onOpenChange={handleSetCategory}>
          <DialogContent className="max-w-full! h-full p-4 overflow-auto bg-background text-foreground lg:hidden flex justify-center items-center">
            <div className="w-full max-w-md max-h-[90vh] overflow-auto">
              {items}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
