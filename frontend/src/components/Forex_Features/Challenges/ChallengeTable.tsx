"use client";
import { Pagination } from "@/components/Global/Pagination";
import SortTableHeader from "@/components/Global/SortTableHeader";
import { Table, TableBody } from "@/components/ui/table";
import ChallengeRow from "./ChallengeRow";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGetAllChallengesQuery } from "@/redux/api/challenge";
import { TChallenge } from "@/types/Challenge ";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import useGetParams from "@/hooks/useGetParams";
import { TQueryParam } from "@/types";
import useIsFutures from "@/hooks/useIsFutures";
import { type ColumnDef } from "@/hooks/useColumnCustomization";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useQueryBuilder } from "@/hooks/usePagination";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

export const CHALLENGE_COLUMNS: ColumnDef[] = [
  { key: "accountSize", labelKey: "accountSize" },
  { key: "steps", labelKey: "steps" },
  { key: "challengeName", labelKey: "challengeName" },
  { key: "profitTarget", labelKey: "profitTarget" },
  { key: "dailyLoss", labelKey: "dailyLoss" },
  { key: "maxLoss", labelKey: "maxLoss" },
  { key: "consistencyRule", labelKey: "consistencyRule" },
  { key: "profitSplit", labelKey: "profitSplit" },
  { key: "payoutFrequency", labelKey: "payoutFrequency" },
  { key: "price", labelKey: "price" },
];

export const FUTURES_CHALLENGE_COLUMNS: ColumnDef[] = [
  { key: "accountSize", labelKey: "accountSize" },
  { key: "steps", labelKey: "steps" },
  { key: "challengeName", labelKey: "challengeName" },
  { key: "profitTarget", labelKey: "profitTarget" },
  { key: "dailyLoss", labelKey: "dailyLoss" },
  { key: "maxLoss", labelKey: "maxLoss" },
  { key: "activationFees", labelKey: "activationFees" },
  { key: "maxContractSize", labelKey: "maxContractSize" },
  { key: "consistencyRule", labelKey: "consistencyRule" },
  { key: "profitSplit", labelKey: "profitSplit" },
  { key: "payoutFrequency", labelKey: "payoutFrequency" },
  { key: "price", labelKey: "price" },
];

function SortIcon({ field }: { field: string }) {
  const { getParam, setParam } = useQueryBuilder();
  const sortBy = getParam("sort") || "";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    let next = field;
    if (sortBy === field) next = `-${field}`;
    else if (sortBy === `-${field}`) next = "";
    setParam("sort", next);
  };

  return (
    <button type="button" onClick={handleClick} className="inline-flex cursor-pointer hover:text-primary">
      {sortBy === field && <ChevronUp className="size-3.5 md:size-4" />}
      {sortBy === `-${field}` && <ChevronDown className="size-3.5 md:size-4" />}
      {sortBy !== field && sortBy !== `-${field}` && <ChevronsUpDown className="size-3.5 md:size-4" />}
    </button>
  );
}

function ContractSizeSortHeader({ t }: { t: (key: string) => string }) {
  const parts = t("maxContractSize").split("\n");
  const [miniLabel, microLabel] = (parts[1] || "").split("|").map((s) => s.trim());
  return (
    <div className="flex flex-col items-center leading-tight whitespace-nowrap">
      <span>{parts[0]}</span>
      <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground font-normal">
        <SortIcon field="contractSizeMini" />
        <span>{miniLabel}</span>
        <span>|</span>
        <span>{microLabel}</span>
        <SortIcon field="contractSizeMicro" />
      </div>
    </div>
  );
}

function ConsistencyRuleSortHeader({ t }: { t: (key: string) => string }) {
  const parts = t("consistencyRule").split("\n");
  const [challengeLabel, fundedLabel] = (parts[1] || "").split("|").map((s) => s.trim());
  return (
    <div className="flex flex-col items-center leading-tight whitespace-nowrap">
      <span>{parts[0]}</span>
      <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground font-normal">
        <SortIcon field="consistencyRuleChallenge" />
        <span>{challengeLabel}</span>
        <span>|</span>
        <span>{fundedLabel}</span>
        <SortIcon field="consistencyRuleFunded" />
      </div>
    </div>
  );
}

type ChallengeTableProps = {
  companySlug?: string;
  locale: string;
  /** When provided, search is controlled (no URL); overrides params */
  searchTermFromState?: string;
  orderedVisibleKeys?: string[];
  showDiscount?: boolean;
};

export default function ChallengeTable({
  companySlug,
  locale,
  searchTermFromState,
  orderedVisibleKeys,
  showDiscount,
}: ChallengeTableProps) {
  const t = useTranslations("Challenges");
  const params = useSearchParams();
  const isArabic = locale === "ar";
  const user = useAppSelector(useCurrentUser);
  const role = user?.role;
  const isAdmin = role === "SUPER_ADMIN";
  const {
    countries,
    paymentMethods,
    payoutMethods,
    assets,
    platforms,
    programType,
    range_maxAllocation,
    drawdowns,
    otherFeatures,
  } = useGetParams();
  const isFutures = useIsFutures();
  const page = Number(params.get("page")) || 1;
  const accounsSize = params.get("size") || "";
  const accountSizeRange = params.get("size_range") || "";
  const in_steps = params.get("in_steps") || "";
  const in_firmId = params.get("in_firmId") || "";
  const in_challengeName = params.get("in_challengeName") || "";
  const in_challengeNameId = params.get("in_challengeNameId") || "";
  const searchTerm =
    searchTermFromState !== undefined
      ? searchTermFromState
      : params.get("search") || "";

  const sort = params.get("sort") || "";
  const queries: TQueryParam[] = [
    { name: "page", value: page },
    { name: "limit", value: 10 },
  ];

  // Only filter by firmType when not on a specific firm's page
  if (!companySlug) {
    queries.push({
      name: "firmType",
      value: isFutures ? "FUTURES" : "FOREX",
    });
  }

  if (searchTerm) {
    queries.push({ name: "searchTerm", value: searchTerm });
  }

  if (sort) {
    let value = sort[0] === "-" ? sort.slice(1) : sort;
    const valuePrefix = sort[0] === "-" ? "-" : "";
    if (value === "firm") value = "firm.title";

    queries.push({ name: "sort", value: valuePrefix + value });
  }

  if (countries) {
    queries.push({ name: "firm.oneItemArray_countries", value: countries });
  }

  if (paymentMethods) {
    queries.push({
      name: "firm.paymentMethods.oneItemArray_id",
      value: paymentMethods,
    });
  }

  if (companySlug) {
    queries.push({ name: "firm.slug", value: companySlug });
  }

  if (in_firmId) {
    queries.push({ name: "in_firmId", value: in_firmId });
  }

  if (payoutMethods) {
    queries.push({
      name: "firm.payoutMethods.oneItemArray_id",
      value: payoutMethods,
    });
  }

  if (in_steps) {
    queries.push({ name: "in_steps", value: in_steps });
  }

  if (in_challengeName) {
    queries.push({ name: "in_challengeName", value: in_challengeName });
  }

  if (in_challengeNameId) {
    queries.push({ name: "in_challengeNameId", value: in_challengeNameId });
  }

  if (assets) {
    queries.push({ name: "firm.leverages.oneItemArray_assets", value: assets });
  }

  if (platforms) {
    queries.push({ name: "firm.platforms.oneItemArray_id", value: platforms });
  }

  if (programType) {
    queries.push({
      name: "firm.oneItemArray_programTypes",
      value: programType,
    });
  }

  if (drawdowns) {
    queries.push({ name: "firm.oneItemArray_drawDowns", value: drawdowns });
  }

  if (otherFeatures) {
    queries.push({
      name: "firm.oneItemArray_otherFeatures",
      value: otherFeatures,
    });
  }

  if (range_maxAllocation) {
    queries.push({
      name: "firm.range_maxAllocation",
      value: range_maxAllocation,
    });
  }

  if (accounsSize) {
    queries.push({ name: "inNumber_accountSize", value: accounsSize });
  } else {
    if (accountSizeRange) {
      queries.push({ name: "range_accountSize", value: accountSizeRange });
    }
  }

  const {
    data: totallBookings,
    isLoading,
    isFetching,
  } = useGetAllChallengesQuery(queries);

  const totalPages = totallBookings?.meta?.totalPage || 1;
  const challenges = totallBookings?.data || [];

  // Fallback when no customization is passed
  const defaultColumns = isFutures ? FUTURES_CHALLENGE_COLUMNS : CHALLENGE_COLUMNS;
  const baseKeys = orderedVisibleKeys ?? defaultColumns.map((c) => c.key);

  const adminOnlyColumns = new Set(["maxContractSize", "consistencyRule"]);
  const visibleKeys = baseKeys.filter((key) => key !== "buy" && (!adminOnlyColumns.has(key) || isAdmin));

  const headers = useMemo(() => {
    const firmIdentityHeaders = [
      {
        label: t("firm"),
        field: "title",
        className: `hidden md:table-cell md:sticky md:z-20 md:bg-background ${isArabic ? "md:right-0 md:shadow-[-2px_0_4px_rgba(0,0,0,0.1)]" : "md:left-0 md:shadow-[2px_0_4px_rgba(0,0,0,0.1)]"}`,
      },
      {
        label: t("firmLogo"),
        id: "titleLogo",
        field: "title",
        hideSort: true,
        className: cn(
          "table-cell md:hidden sticky z-20 bg-background",
          isArabic ? "right-0" : "left-0",
        ),
      },
      {
        label: t("firmName"),
        id: "titleName",
        field: "title",
        className: "table-cell md:hidden",
      },
    ];

    const tooltips: Record<string, string> = {
      challengeName: "The challenge type or program name",
      accountSize: "The funded trading capital provided by the firm",
      steps: "Number of evaluation phases required before getting funded",
      profitTarget: "% gain required to pass each evaluation phase",
      dailyLoss: "Maximum % loss allowed in a single trading day",
      maxLoss: "Maximum total % drawdown allowed across the account",
      activationFees: "One-time fee required to activate the funded account",
      maxContractSize: "Maximum contract sizes for Mini and Micro lots",
      consistencyRule: "Consistency rule values for challenge and funded phases",
      profitSplit: "% of profits you keep after passing evaluation",
      payoutFrequency: "How often you can request profit withdrawals",
      price: "Cost to enter the challenge",
    };

    const stickyClasses: Record<string, string> = {
      price: `md:sticky md:z-20 md:bg-background group-hover:md:bg-background ${isArabic ? "md:left-0 md:shadow-[2px_0_4px_rgba(0,0,0,0.1)]" : "md:right-0 md:shadow-[-2px_0_4px_rgba(0,0,0,0.1)]"}`,
    };

    const visibleHeaders = visibleKeys.map((key) => {
      if (key === "maxContractSize") {
        return {
          label: <ContractSizeSortHeader t={t} />,
          field: key,
          tooltip: tooltips[key],
          center: true,
          hideSort: true,
        };
      }
      if (key === "consistencyRule") {
        return {
          label: <ConsistencyRuleSortHeader t={t} />,
          field: key,
          tooltip: tooltips[key],
          center: true,
          hideSort: true,
        };
      }
      return {
        label: t(key),
        field: key,
        tooltip: tooltips[key],
        center: true,
        ...(stickyClasses[key] ? { className: stickyClasses[key] } : {}),
      };
    });

    const actionHeader = isAdmin
      ? [{ label: t("action"), field: "action", hideSort: true, center: true }]
      : [];

    return [...firmIdentityHeaders, ...visibleHeaders, ...actionHeader];
  }, [t, visibleKeys, isAdmin, isArabic]);

  const colSpan = 3 + visibleKeys.length + (isAdmin ? 1 : 0);

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="max-w-full w-full space-y-8">
      <Table className={cn("min-w-[1100px]", isFetching && "opacity-50 pointer-events-none transition-opacity")}>
        <SortTableHeader headers={headers} />
        <TableBody colSpan={colSpan}>
          {challenges.map((item: TChallenge, index: number) => (
            <ChallengeRow
              isArabic={isArabic}
              key={item.id}
              challenge={item}
              visibleColumns={visibleKeys}
              showDiscount={showDiscount}
              prevChallenge={challenges[index - 1]}
              nextChallenge={challenges[index + 1]}
            />
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </div>
  );
}
