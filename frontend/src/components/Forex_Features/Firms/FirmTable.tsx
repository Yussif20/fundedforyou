"use client";

import { Pagination } from "@/components/Global/Pagination";
import SortTableHeader from "@/components/Global/SortTableHeader";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { Table, TableBody } from "@/components/ui/table";
import { TMeta } from "@/types";
import { SinglePropFirm } from "@/types/firm.types";
import { useTranslations } from "next-intl";
import FirmRow from "./FirmRow";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import { type ColumnDef } from "@/hooks/useColumnCustomization";
import useIsArabic from "@/hooks/useIsArabic";
import { useMemo } from "react";

export const ALL_FIRM_COLUMNS: ColumnDef[] = [
  { key: "country", labelKey: "country" },
  { key: "yearsInOperation", labelKey: "yearsInOperation" },
  { key: "platforms", labelKey: "platforms" },
  { key: "maxAllocation", labelKey: "maxAllocation" },
  { key: "discount", labelKey: "discount" },
  { key: "visitFirm", labelKey: "visitFirm" },
];

export const SHORT_FIRM_COLUMNS: ColumnDef[] = [
  { key: "country", labelKey: "country" },
  { key: "yearsInOperation", labelKey: "yearsInOperation" },
];

export default function FirmTable({
  firms = [],
  meta,
  isLoading,
  shortVersion,
  orderedVisibleKeys,
}: {
  firms: SinglePropFirm[];
  meta: TMeta;
  isFuturesPage: boolean;
  isLoading: boolean;
  shortVersion?: boolean;
  orderedVisibleKeys?: string[];
}) {
  const t = useTranslations("Firms");
  const user = useAppSelector(useCurrentUser);
  const isAdmin = user?.role === "SUPER_ADMIN";
  const isArabic = useIsArabic();

  // Fallback when no customization is passed (e.g. shortVersion on other pages)
  const visibleKeys = orderedVisibleKeys ?? (shortVersion
    ? SHORT_FIRM_COLUMNS.map((c) => c.key)
    : ALL_FIRM_COLUMNS.map((c) => c.key));

  const headers = useMemo(() => {
    const firmIdentityHeaders = [
      {
        label: t("firm"),
        field: "title",
        hideSort: !!shortVersion,
        className: `hidden md:table-cell md:sticky md:z-20 md:bg-background ${isArabic ? "md:right-0 md:shadow-[-2px_0_4px_rgba(0,0,0,0.1)]" : "md:left-0 md:shadow-[2px_0_4px_rgba(0,0,0,0.1)]"}`,
      },
      {
        label: t("firmLogo"),
        id: "titleLogo",
        field: "title",
        hideSort: true,
        className: "table-cell md:hidden",
      },
      {
        label: t("firmName"),
        id: "titleName",
        field: "title",
        hideSort: !!shortVersion,
        className: "table-cell md:hidden",
      },
    ];

    const columnHeaderMap: Record<string, { label: string; field: string; hideSort: boolean; center: boolean }> = {
      country: { label: t("country"), field: "country", hideSort: !!shortVersion, center: true },
      yearsInOperation: { label: t("yearsInOperation"), field: "yearsInOperation", hideSort: !!shortVersion, center: true },
      platforms: { label: t("platforms"), field: "platforms", hideSort: !!shortVersion, center: true },
      maxAllocation: { label: t("maxAllocation"), field: "maxAllocation", hideSort: !!shortVersion, center: true },
      discount: { label: t("discount"), field: "discount", hideSort: !!shortVersion, center: true },
      visitFirm: { label: t("visitFirm"), field: "visitFirm", hideSort: true, center: true },
    };

    const visibleHeaders = visibleKeys
      .map((key) => columnHeaderMap[key])
      .filter(Boolean);

    const actionHeader = isAdmin
      ? [{ label: t("action"), field: "action", hideSort: true, center: true }]
      : [];

    return [...firmIdentityHeaders, ...visibleHeaders, ...actionHeader];
  }, [t, shortVersion, visibleKeys, isAdmin, isArabic]);

  const colSpan = 3 + visibleKeys.length + (isAdmin ? 1 : 0);

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="max-w-full w-full space-y-8 overflow-hidden">
      <Table>
        <SortTableHeader headers={headers} />
        <TableBody colSpan={colSpan}>
          {firms.map((item, index) => (
            <FirmRow
              visibleColumns={visibleKeys}
              key={item.id}
              company={item}
              prevCompany={firms[index - 1]}
              nextCompany={firms[index + 1]}
              userRole={user?.role}
            />
          ))}
        </TableBody>
      </Table>
      <Pagination totalPages={meta?.totalPage ?? 0} />
    </div>
  );
}
