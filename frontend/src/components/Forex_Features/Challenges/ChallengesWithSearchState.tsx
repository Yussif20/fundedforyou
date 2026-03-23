"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { handleSetSearchParams } from "@/lib/utils";
import { useColumnCustomization } from "@/hooks/useColumnCustomization";
import CustomizeColumnsDialog from "@/components/Global/CustomizeColumnsDialog";
import ChallengeFilter from "./ChallengeFilter";
import ChallengeTable, { CHALLENGE_COLUMNS, FUTURES_CHALLENGE_COLUMNS } from "./ChallengeTable";
import SelectOptions from "./SelectOptions";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import useIsFutures from "@/hooks/useIsFutures";

type Props = {
  locale: string;
  companySlug?: string;
};

export default function ChallengesWithSearchState({
  locale,
  companySlug,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tChallenges = useTranslations("Challenges");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm] = useDebounce(searchInput, 300);
  const [showDiscount, setShowDiscount] = useState(true);
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      handleSetSearchParams({ page: "1" }, searchParams, router);
    },
    [searchParams, router]
  );

  // Fetch firm data to get challengeNames for the filter (only when on a firm's challenges page)
  const { data: firmsData } = useGetAllFirmsQuery(
    [{ name: "slug", value: companySlug! }],
    { skip: !companySlug }
  );
  const firm = companySlug ? firmsData?.firms?.[0] ?? null : null;
  const challengeNameRecords: Array<{id: string; name: string}> = firm?.challengeNameRecords || [];

  const isFutures = useIsFutures();
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

  return (
    <div className="space-y-8 pb-20 md:pb-30">
      <ChallengeFilter
        hideAllFilter
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        beforeFilter={
          <>
            {companySlug && challengeNameRecords.length > 0 && (
              <SelectOptions
                name="in_challengeNameId"
                title={tChallenges("challengeName")}
                options={challengeNameRecords.map((cn) => ({
                  name: cn.name,
                  value: cn.id,
                }))}
                cols={2}
                forceDir="ltr"
              />
            )}
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
      <div className="flex">
        <ChallengeTable
          companySlug={companySlug}
          locale={locale}
          searchTermFromState={searchTerm}
          orderedVisibleKeys={orderedVisibleKeys}
          showDiscount={showDiscount}
        />
      </div>
    </div>
  );
}
