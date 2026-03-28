"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  useGetNewsLetterSubscribersQuery,
  useLazyGetNewsLetterSubscribersQuery,
} from "@/redux/api/newsLetter";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Pagination } from "@/components/Global/Pagination";
import TableSkeleton from "@/components/Global/TableSkeleton";
import SearchInputField from "@/components/Forms/SearchInputField";
import { handleSetSearchParams } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import DeleteSubscriber from "./DeleteSubscriber";
// import SendBulkEmailDialog from "./SendBulkEmailDialog";

const DEBOUNCE_MS = 300;

export default function NewsletterSubscribers() {
  const t = useTranslations("Overview.newsletterSubscribers");
  const tSearch = useTranslations("Search");
  const params = useSearchParams();
  const router = useRouter();
  const page = Number(params.get("page")) || 1;
  const urlSearch = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [triggerGetAll] = useLazyGetNewsLetterSubscribersQuery();

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const applySearch = useCallback(
    (value: string) => {
      handleSetSearchParams({ search: value, page: "1" }, params, router);
    },
    [params, router]
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

  const searchTerm = params.get("search") || "";
  const { data, isLoading, isFetching } = useGetNewsLetterSubscribersQuery([
    { name: "page", value: page },
    { name: "limit", value: 100 },
    { name: "searchTerm", value: searchTerm },
  ]);

  const list =
    (data?.data?.subscribers as { id: string; email: string; createdAt: string }[]) ?? [];
  const totalPages = data?.data?.meta?.totalPage ?? data?.meta?.totalPage ?? 1;
  const total = data?.data?.meta?.total ?? data?.meta?.total ?? list.length;

  const handleExportExcel = async () => {
    const toastId = toast.loading(t("exporting"));
    try {
      const result = await triggerGetAll([
        { name: "limit", value: 10000 },
        { name: "searchTerm", value: searchTerm },
      ]).unwrap();

      const allSubscribers =
        (result?.data?.subscribers as { email: string; createdAt: string }[]) ?? list;

      const headers = [t("email"), t("date")];
      const rows = allSubscribers.map((s) => [
        s.email,
        s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-",
      ]);

      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Subscribers");
      XLSX.writeFile(
        wb,
        `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success(t("exportSuccess"), { id: toastId });
    } catch {
      toast.error(t("exportError"), { id: toastId });
    }
  };

  const handleCopyEmails = async () => {
    try {
      const result = await triggerGetAll([
        { name: "limit", value: 10000 },
        { name: "searchTerm", value: searchTerm },
      ]).unwrap();

      const allSubscribers =
        (result?.data?.subscribers as { email: string }[]) ?? list;

      const emails = allSubscribers.map((s) => s.email).join(", ");
      await navigator.clipboard.writeText(emails);
      toast.success(t("copiedToClipboard"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border/60">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          {t("title")}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <SearchInputField
          value={searchInput}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          placeholder={tSearch("searchPlaceholder")}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <Download className="h-4 w-4" />
            {t("exportExcel")}
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleCopyEmails}>
            <Copy className="h-4 w-4" />
            {t("copyEmails")}
          </Button>
          {/* <SendBulkEmailDialog /> */}
        </div>
      </div>

      {isLoading || isFetching ? (
        <TableSkeleton />
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="md:hidden space-y-3">
            {list.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm">
                {t("noSubscribers")}
              </p>
            ) : (
              list.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/60 bg-card p-4 shadow-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <DeleteSubscriber subscriber={item} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block w-full min-w-0">
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody colSpan={3} emptyMessage={t("noSubscribers")}>
                  {list.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.email}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DeleteSubscriber subscriber={item} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {list.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {list.length} of {total} subscribers
              </p>
              <Pagination totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
