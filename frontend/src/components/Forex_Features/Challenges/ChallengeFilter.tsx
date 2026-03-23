"use client";

import SearchInputField from "@/components/Forms/SearchInputField";
import { Button } from "@/components/ui/button";
import { cn, handleSetSearchParams } from "@/lib/utils";
import { Filter, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SelectOptions from "./SelectOptions";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import CreateChallengeModal from "./CreateChallengeModal";
import { useCurrentUser } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import useIsArabic from "@/hooks/useIsArabic";

type ChallengeFilterProps = {
  hideAllFilter?: boolean;
  /** When provided, search is controlled (no URL); parent holds state */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Server-resolved search params — used to skip the defaults useEffect when defaults are already in the URL */
  initialSearchParams?: Record<string, string>;
  /** Optional slot rendered before the Filter button */
  beforeFilter?: React.ReactNode;
  /** Optional slot rendered next to the search bar on the right side */
  customizeSlot?: React.ReactNode;
};

export default function ChallengeFilter({
  hideAllFilter,
  searchValue,
  onSearchChange,
  initialSearchParams,
  beforeFilter,
  customizeSlot,
}: ChallengeFilterProps) {
  const t = useTranslations("Challenges");
  const tSearch = useTranslations("Search");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterOpen = searchParams.get("filterOpen") === "true";
  const isArabic = useIsArabic();

  const [openModal, setOpenModal] = useState(false);
  // Pre-mark defaults as applied when the server already passed them in initialSearchParams
  const serverHasDefaults = Boolean(
    initialSearchParams?.size || initialSearchParams?.size_range || initialSearchParams?.in_steps
  );
  const hasAppliedChallengeDefaults = useRef(serverHasDefaults);
  const prevPathnameRef = useRef(pathname);

  const user = useAppSelector(useCurrentUser);
  const role = user?.role;

  // Firm challenges page: never apply default filters (no 100k / STEP1)
  const isFirmChallengesPage = pathname.includes("/firms/") && pathname.includes("/challenges");
  // Futures features page: /en/futures/challenges
  const isFeaturesPage = pathname.includes("/futures/") && !isFirmChallengesPage;

  // When switching Forex <-> Futures, reset so we re-apply defaults on the new tab
  if (pathname !== prevPathnameRef.current) {
    prevPathnameRef.current = pathname;
    hasAppliedChallengeDefaults.current = false;
  }

  // Set default size (100K) and steps (STEP1) on first load only.
  // Once defaults have been applied, never re-apply — the user may intentionally clear them.
  // Tab re-clicks are handled by the tab Link itself (its href includes default params).
  // Skip defaults on firm info challenges tab so all challenges show without pre-selected filters.
  useEffect(() => {
    if (isFirmChallengesPage) return;
    if (hasAppliedChallengeDefaults.current) return;

    const hasSize = searchParams.get("size") || searchParams.get("size_range");
    const hasSteps = searchParams.get("in_steps");

    if (hasSize && hasSteps) {
      hasAppliedChallengeDefaults.current = true;
      return;
    }
    const next: Record<string, string> = {};
    if (!hasSize) next.size = "100000";
    if (!hasSteps) next.in_steps = "STEP1";
    if (Object.keys(next).length > 0) {
      hasAppliedChallengeDefaults.current = true;
      handleSetSearchParams({ ...next, page: "1" }, searchParams, router);
    }
  }, [pathname, searchParams, router, isFirmChallengesPage]);

  const handleSetCategory = (value: Record<string, string>) => {
    handleSetSearchParams(value, searchParams, router);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 items-center lg:items-end">
      <div className="w-full lg:flex-1 flex flex-col lg:flex-row lg:flex-wrap justify-center lg:justify-start gap-3 md:gap-4 lg:gap-4 items-center order-2 lg:order-1">
        <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-4 items-center">
          <SelectOptions
            name="size"
            title={t("size")}
            options={
              isFeaturesPage
                ? [
                    { name: "$25K", value: "25000" },
                    { name: "$50K", value: "50000" },
                    { name: "$75K", value: "75000" },
                    { name: "$100K", value: "100000" },
                    { name: "$150K", value: "150000" },
                    { name: "$200K", value: "200000" },
                  ]
                : [
                    { name: "$5K", value: "5000" },
                    { name: "$10K", value: "10000" },
                    { name: "$25K", value: "25000" },
                    { name: "$50K", value: "50000" },
                    { name: "$100K", value: "100000" },
                    { name: "$200K", value: "200000" },
                    { name: "$300K", value: "300000" },
                    { name: "$500K", value: "500000" },
                  ]
            }
            {...(!isFeaturesPage && {
              custom: {
                show: true,
                max: 300000,
                min: 500,
              },
            })}
          />

          <SelectOptions
            name="in_steps"
            title={t("steps")}
            options={[
              { name: t("INSTANT"), value: "INSTANT" },
              { name: t("STEP1"), value: "STEP1" },
              { name: t("STEP2"), value: "STEP2" },
              { name: t("STEP3"), value: "STEP3" },
              { name: t("STEP4"), value: "STEP4" },
            ]}
            cols={2}
          />
        </div>
        <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-4 items-center">
          {!hideAllFilter && (
            <Button
              className={cn(
                "h-8 px-2 text-[11px] sm:h-9 sm:px-3 sm:text-xs md:text-sm",
                isArabic && "font-semibold"
              )}
              onClick={() => {
                handleSetCategory({ filterOpen: filterOpen ? "" : "true" });
              }}
              variant={filterOpen ? "defaultBH" : "outline2"}
            >
              <Filter className="size-3.5 sm:size-4" /> {t("filter")}
            </Button>
          )}
          <div className="hidden sm:block w-px h-6 bg-border" />
          {beforeFilter}
          {role === "SUPER_ADMIN" && (
            <Button variant="default" onClick={() => setOpenModal(true)}>
              <Plus />
            </Button>
          )}
        </div>
      </div>
      <div className={cn("w-full lg:w-auto lg:shrink-0 flex items-center gap-2 order-1 lg:order-2", isFirmChallengesPage ? "justify-center" : "justify-center lg:justify-end", isArabic ? "ml-0 mr-auto" : "mr-0 ml-auto")}>
        {customizeSlot}
        {!isFirmChallengesPage && (
          <div className="flex-1 min-w-0 max-w-[8rem] sm:max-w-none lg:w-[13rem]">
            <SearchInputField
              value={searchValue ?? ""}
              onChange={(v) => onSearchChange?.(v)}
              onSubmit={() => onSearchChange?.(searchValue ?? "")}
              placeholder={tSearch("searchPlaceholder")}
            />
          </div>
        )}
      </div>

      <CreateChallengeModal
        open={openModal}
        setOpen={setOpenModal}
        firmOptions={[]}
        firmsLoading={false}
      />
    </div>
  );
}
