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
import { Badge } from "@/components/ui/badge";
import {
  useGetContactUsListQuery,
  useUpdateContactUsStatusMutation,
} from "@/redux/api/contactUs";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Pagination } from "@/components/Global/Pagination";
import TableSkeleton from "@/components/Global/TableSkeleton";
import SearchInputField from "@/components/Forms/SearchInputField";
import { handleSetSearchParams } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ContactUsItem } from "@/redux/api/contactUs";
import { Mail } from "lucide-react";

const DEBOUNCE_MS = 300;

function getReplyMailtoUrl(
  item: ContactUsItem,
  subject: string,
  replyIntro: string
): string {
  const fromLine = `From: ${item.fullName} <${item.email}>`;
  const dateLine = `Date: ${item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}`;
  const body = [
    replyIntro,
    "",
    fromLine,
    dateLine,
    "",
    item.message,
  ].join("\n");
  return `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildMailtoSubject(
  item: ContactUsItem,
  t: (key: string) => string
): string {
  const typeKey =
    item.contactType === "SUGGESTION" ? "typeSuggestion" : "typeQuestion";
  const inquiryKeyMap: Record<string, string> = {
    general: "inquiryGeneral",
    technical: "inquiryTechnical",
    other: "inquiryOther",
    billing: "inquiryBilling",
    feature: "inquiryFeature",
  };
  const inquiryKey =
    inquiryKeyMap[item.inquiry?.toLowerCase()] ?? "inquiryOther";
  const typeLabel = t(typeKey);
  const inquiryLabel = t(inquiryKey);
  return `${t("mailtoSubjectRe")}: ${typeLabel} - ${inquiryLabel} for FundedForYou.com`;
}

const STATUS_OPTIONS = [
  "PENDING",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;

function statusLabel(key: string, t: (k: string) => string) {
  switch (key) {
    case "PENDING":
      return t("statusPending");
    case "IN_PROGRESS":
      return t("statusInProgress");
    case "RESOLVED":
      return t("statusResolved");
    case "CLOSED":
      return t("statusClosed");
    default:
      return key;
  }
}

export default function ContactMessagesManagement() {
  const t = useTranslations("Overview.contactMessages");
  const tSearch = useTranslations("Search");
  const params = useSearchParams();
  const router = useRouter();
  const page = Number(params.get("page")) || 1;
  const urlSearch = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [viewingMessage, setViewingMessage] = useState<ContactUsItem | null>(
    null
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const { data, isLoading, isFetching } = useGetContactUsListQuery([
    { name: "page", value: page },
    { name: "limit", value: 10 },
    { name: "searchTerm", value: searchTerm },
  ]);

  const list: ContactUsItem[] =
    (data?.data?.contactUs as ContactUsItem[] | undefined) ?? [];
  const totalPages = data?.data?.meta?.totalPage ?? data?.meta?.totalPage ?? 1;

  const [updateStatus, { isLoading: isStatusUpdating }] =
    useUpdateContactUsStatusMutation();

  const handleStatusChange = async (
    contactUsId: string,
    newStatus: string
  ) => {
    try {
      await updateStatus({ contactUsId, status: newStatus }).unwrap();
      toast.success(t("statusUpdated"));
      router.refresh();
    } catch {
      toast.error("Failed to update status");
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
      </div>

      {isLoading || isFetching ? (
        <TableSkeleton />
      ) : (
        <>
          {/* Mobile: card list (no horizontal scroll) */}
          <div className="md:hidden space-y-3">
            {list.length === 0 ? (
              <p className="text-center text-muted-foreground py-10 text-sm">
                {t("noMessages")}
              </p>
            ) : (
              list.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/60 bg-card p-4 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {item.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.email}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 line-clamp-2">
                    {item.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={item.status}
                      onValueChange={(value) =>
                        handleStatusChange(item.id, value)
                      }
                      disabled={isStatusUpdating}
                    >
                      <SelectTrigger className="w-full min-w-0 sm:w-[130px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {statusLabel(opt, t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-initial"
                      onClick={() => setViewingMessage(item)}
                    >
                      {t("viewMessage")}
                    </Button>
                    <a
                      href={getReplyMailtoUrl(
                        item,
                        buildMailtoSubject(item, t),
                        t("mailtoReplyIntro")
                      )}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium border border-input bg-background px-3 py-2 h-8 hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {t("replyByEmail")}
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop: table (hidden on mobile to avoid x-scroll) */}
          <div className="hidden md:block w-full min-w-0">
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead>{t("inquiry")}</TableHead>
                    <TableHead className="max-w-[200px]">{t("message")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody colSpan={8} emptyMessage={t("noMessages")}>
                  {list.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium min-w-0">
                        {item.fullName}
                      </TableCell>
                      <TableCell className="text-sm min-w-0">{item.email}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {item.contactType}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {item.inquiry}
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] min-w-0 truncate">
                        {item.message}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(value) =>
                            handleStatusChange(item.id, value)
                          }
                          disabled={isStatusUpdating}
                        >
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {statusLabel(opt, t)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingMessage(item)}
                          >
                            {t("viewMessage")}
                          </Button>
                          <a
                            href={getReplyMailtoUrl(
                              item,
                              buildMailtoSubject(item, t),
                              t("mailtoReplyIntro")
                            )}
                            className="inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium border border-input bg-background px-3 py-2 h-8 hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {t("replyByEmail")}
                          </a>
                        </div>
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
                {list.length} {t("title").toLowerCase()}
              </p>
              <Pagination totalPages={totalPages} />
            </div>
          )}
        </>
      )}

      <Dialog
        open={!!viewingMessage}
        onOpenChange={(open) => !open && setViewingMessage(null)}
      >
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("viewMessage")}</DialogTitle>
          </DialogHeader>
          {viewingMessage && (
            <>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold">{t("name")}:</span>{" "}
                  {viewingMessage.fullName}
                </p>
                <p>
                  <span className="font-semibold">{t("email")}:</span>{" "}
                  {viewingMessage.email}
                </p>
                <p>
                  <span className="font-semibold">{t("type")}:</span>{" "}
                  {viewingMessage.contactType}
                </p>
                <p>
                  <span className="font-semibold">{t("inquiry")}:</span>{" "}
                  {viewingMessage.inquiry}
                </p>
                <p>
                  <span className="font-semibold">{t("status")}:</span>{" "}
                  <Badge variant="secondary">
                    {statusLabel(viewingMessage.status, t)}
                  </Badge>
                </p>
                <p>
                  <span className="font-semibold">{t("message")}:</span>
                </p>
                <p className="rounded-md bg-muted/50 p-3 whitespace-pre-wrap">
                  {viewingMessage.message}
                </p>
              </div>
              <div className="pt-4 border-t border-border/60 flex justify-end">
                <a
                  href={getReplyMailtoUrl(
                    viewingMessage,
                    buildMailtoSubject(viewingMessage, t),
                    t("mailtoReplyIntro")
                  )}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {t("replyByEmail")}
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
