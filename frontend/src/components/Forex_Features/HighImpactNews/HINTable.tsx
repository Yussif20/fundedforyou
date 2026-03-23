"use client";
import { Table, TableBody } from "@/components/ui/table";
import SortTableHeader from "@/components/Global/SortTableHeader";
import HINRow from "./HINRow";
import { useGetAllNewsQuery } from "@/redux/api/newsApi";
import TableSkeleton from "@/components/Global/TableSkeleton";
import { useTranslations } from "next-intl";
import { Calendar, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { changeGmt, useCurrentGmt } from "@/redux/gmtSlice";

export default function HINTable() {
  const searchparams = useSearchParams();
  const userRole = useAppSelector(useCurrentUser)?.role;
  const gmt = useAppSelector(useCurrentGmt);
  const dispatch = useAppDispatch();
  const week = searchparams.get("week") || "current";
  const { data, isLoading } = useGetAllNewsQuery([
    { name: "tab", value: week },
  ]);
  const t = useTranslations("HighImpactNews");
  // Earliest date at top, newest at bottom (ascending by date)
  const newsData = (data?.data || []).slice().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const options: { label: string; value: string }[] = Array.from(
    { length: 27 },
    (_, i) => {
      const offset = i - 12;
      return {
        label: `GMT${offset >= 0 ? "+" + offset : offset}`,
        value: `${offset}`,
      };
    },
  );

  const handleGmtChange = (value: string) => {
    dispatch(changeGmt(value));
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="max-w-full w-full space-y-10">
      {/* GMT Selector */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 bg-gradient-to-r from-primary/8 to-primary/4 dark:from-primary/15 dark:to-primary/8 rounded-xl px-4 py-2 ring-1 ring-primary/15 shadow-sm">
          <Globe className="size-4 text-primary" />
          <Select value={gmt} onValueChange={handleGmtChange}>
            <SelectTrigger className="px-3 w-full max-w-[140px] h-8 border-none bg-transparent shadow-none text-sm font-semibold" withoutLinearBorder>
              <SelectValue placeholder={t("gmt")} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {newsData.map((item) => {
        return (
          <div className="space-y-0" key={item.date}>
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-0">
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary/15 to-primary/5 dark:from-primary/20 dark:to-primary/8 text-primary px-5 py-2.5 rounded-t-xl border border-b-0 border-primary/20 backdrop-blur-sm">
                <Calendar className="size-4" />
                <span className="text-sm font-semibold tracking-tight">{item.date}</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
            </div>

            <Table
              className="text-xs md:text-sm [&_tr:nth-child(even)]:bg-muted/20 dark:[&_tr:nth-child(even)]:bg-muted/10 [&_tr:last-child]:border-b-0"
              containerClassName="rounded-ss-none border-primary/20 shadow-md shadow-primary/5 bg-gradient-to-b from-card/80 to-card/50 backdrop-blur-sm"
            >
              <SortTableHeader
                headers={[
                  { label: t("gmtz"), field: "gmtz", center: true },
                  { label: t("currency"), field: "currency", center: true },
                  { label: t("eventTitle"), field: "eventTitle", center: true },
                  ...(userRole === "SUPER_ADMIN"
                    ? [{ label: t("actions"), field: "actions", center: true }]
                    : []),
                ]}
                skipSort
                headerClassName="bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8 dark:from-primary/15 dark:via-primary/10 dark:to-primary/15 [&_tr]:border-primary/20"
                rowClassName="hover:bg-transparent!"
              />
              <TableBody colSpan={userRole === "SUPER_ADMIN" ? 4 : 3}>
                {item.news.map((newsItem, newsIndex) => (
                  <HINRow
                    key={newsItem.id}
                    news={newsItem}
                    prevNews={item.news[newsIndex - 1]}
                    nextNews={item.news[newsIndex + 1]}
                    index={newsIndex}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}
