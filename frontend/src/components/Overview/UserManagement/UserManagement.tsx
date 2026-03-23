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
  useGetAllUserAdminQuery,
  useLazyGetAllUserAdminQuery,
  useUpdateUserAdminMutation,
  useUpdateUserRoleMutation,
} from "@/redux/api/userApi";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Pagination } from "@/components/Global/Pagination";
import TableSkeleton from "@/components/Global/TableSkeleton";
import SearchInputField from "@/components/Forms/SearchInputField";
import { handleSetSearchParams } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";

export type TUser = {
  id: string;
  fullName: string;
  email: string;
  status: "ACTIVE" | "BLOCKED" | "INACTIVE" | "DELETED";
  profile: string | null;
  location: string | null;
  authType: "EMAIL" | "GOOGLE" | "FACEBOOK";
  role: "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  phoneNumber: string | null;
  createdAt?: string;
  hasTakenSurvey: boolean;
  country: string | null;
  tradingExperience: string | null;
  assetsTraded: string[];
  tookChallenge: string | null;
};

type ColumnKey = "name" | "email" | "role" | "status" | "joinDate" | "survey" | "country" | "experience" | "assets" | "challenges" | "actions";

type ColumnConfig = {
  key: ColumnKey;
  labelKey: string;
  defaultVisible: boolean;
};

const COLUMNS: ColumnConfig[] = [
  { key: "name", labelKey: "name", defaultVisible: true },
  { key: "email", labelKey: "email", defaultVisible: true },
  { key: "role", labelKey: "role", defaultVisible: true },
  { key: "status", labelKey: "status", defaultVisible: true },
  { key: "joinDate", labelKey: "joinDate", defaultVisible: true },
  { key: "survey", labelKey: "survey", defaultVisible: false },
  { key: "country", labelKey: "country", defaultVisible: false },
  { key: "experience", labelKey: "experience", defaultVisible: false },
  { key: "assets", labelKey: "assets", defaultVisible: false },
  { key: "challenges", labelKey: "challenges", defaultVisible: false },
  { key: "actions", labelKey: "actions", defaultVisible: true },
];

const STORAGE_KEY = "user-management-columns";

function getDefaultVisibility(): Record<ColumnKey, boolean> {
  const defaults: Record<string, boolean> = {};
  for (const col of COLUMNS) {
    defaults[col.key] = col.defaultVisible;
  }
  return defaults as Record<ColumnKey, boolean>;
}

function loadVisibility(): Record<ColumnKey, boolean> {
  if (typeof window === "undefined") return getDefaultVisibility();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle new columns
      const defaults = getDefaultVisibility();
      return { ...defaults, ...parsed };
    }
  } catch {}
  return getDefaultVisibility();
}

const DEBOUNCE_MS = 300;

export default function UserManagement() {
  const t = useTranslations("Overview.userManagement");
  const tSearch = useTranslations("Search");
  const params = useSearchParams();
  const router = useRouter();
  const page = Number(params.get("page")) || 1;
  const urlSearch = params.get("search") || "";
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [triggerGetAllUsers] = useLazyGetAllUserAdminQuery();
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(loadVisibility);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleCount = Object.values(visibleColumns).filter(Boolean).length;

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
  // Get all users
  const queryParams: { name: string; value: string | number }[] = [
    { name: "page", value: page },
    { name: "limit", value: 100 },
    { name: "searchTerm", value: searchTerm },
  ];
  if (roleFilter !== "ALL") {
    queryParams.push({ name: "role", value: roleFilter });
  }
  const { data, isLoading, isFetching } = useGetAllUserAdminQuery(queryParams);

  const users: TUser[] = (data?.data?.users as TUser[] | undefined) ?? [];

  const currentUser = useAppSelector(useCurrentUser);

  // Mutation for updating user status
  const [updateUserStatus, { isLoading: isStatusUpdating }] =
    useUpdateUserAdminMutation();

  const [updateUserRole, { isLoading: isRoleUpdating }] =
    useUpdateUserRoleMutation();

  const totalPages = data?.meta?.totalPage || 1;

  const handleStatusUpdate = async (user: TUser) => {
    const newStatus = user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

    await updateUserStatus({
      id: user.id,
      data: { status: newStatus },
    });
    toast.success(t("userStatusUpdated"));
    // Refresh page after update
    router.refresh();
  };

  const handleRoleUpdate = async (user: TUser, newRole: string) => {
    if (newRole === user.role) return;
    const confirmed = window.confirm(
      `Are you sure you want to change ${user.fullName}'s role to ${newRole}?`
    );
    if (!confirmed) return;

    await updateUserRole({ id: user.id, data: { role: newRole } });
    toast.success("User role updated successfully");
    router.refresh();
  };

  const handleDeleteUser = async (user: TUser) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${user.fullName}?`,
    );
    if (!confirmed) return;

    await updateUserStatus({
      id: user.id,
      data: { status: "DELETED" },
    });
    toast.success("User removed successfully");
    router.refresh();
  };

  const handleExportExcel = async () => {
    const exportColumns = COLUMNS.filter((col) => col.key !== "actions" && visibleColumns[col.key]);
    const headers = exportColumns.map((col) => t(col.labelKey));

    let exportUsers = users;
    try {
      const exportParams: { name: string; value: string | number }[] = [
        { name: "page", value: 1 },
        { name: "limit", value: 10000 },
        { name: "searchTerm", value: searchTerm },
      ];
      if (roleFilter !== "ALL") {
        exportParams.push({ name: "role", value: roleFilter });
      }
      const result = await triggerGetAllUsers(exportParams).unwrap();
      exportUsers = (result?.data?.users as TUser[] | undefined) ?? [];
    } catch {
      toast.error("Failed to fetch all users for export, exporting current page only.");
    }

    const rows = exportUsers.map((user) => {
      return exportColumns.map((col) => {
        switch (col.key) {
          case "name": return user.fullName;
          case "email": return user.email;
          case "role": return user.role;
          case "status": return user.status;
          case "joinDate": return user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-";
          case "survey": return user.hasTakenSurvey ? "Yes" : "No";
          case "country": return user.country || "-";
          case "experience": return user.tradingExperience || "-";
          case "assets": return user.assetsTraded?.length ? user.assetsTraded.join(", ") : "-";
          case "challenges": return user.tookChallenge || "-";
          default: return "";
        }
      });
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `users-export-${date}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border/60">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          {t("title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <SearchInputField
            value={searchInput}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            placeholder={tSearch("searchPlaceholder")}
          />
          <Select value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value);
              handleSetSearchParams({ page: "1" }, params, router);
            }}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("allRoles")}</SelectItem>
              <SelectItem value="SUPER_ADMIN">{t("adminRole")}</SelectItem>
              <SelectItem value="MODERATOR">{t("moderatorRole")}</SelectItem>
              <SelectItem value="USER">{t("userRole")}</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t("columns")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t("toggleColumns")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {COLUMNS.filter((col) => col.key !== "actions").map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns[col.key]}
                  onCheckedChange={() => toggleColumn(col.key)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {t(col.labelKey)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="w-full" onClick={handleExportExcel}>
            <Download className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t("exportExcel")}
          </Button>
      </div>

      {isLoading || isFetching ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.name && <TableHead>{t("name")}</TableHead>}
                    {visibleColumns.email && <TableHead>{t("email")}</TableHead>}
                    {visibleColumns.role && <TableHead>{t("role")}</TableHead>}
                    {visibleColumns.status && <TableHead>{t("status")}</TableHead>}
                    {visibleColumns.joinDate && <TableHead>{t("joinDate")}</TableHead>}
                    {visibleColumns.survey && <TableHead>{t("survey")}</TableHead>}
                    {visibleColumns.country && <TableHead>{t("country")}</TableHead>}
                    {visibleColumns.experience && <TableHead>{t("experience")}</TableHead>}
                    {visibleColumns.assets && <TableHead>{t("assets")}</TableHead>}
                    {visibleColumns.challenges && <TableHead>{t("challenges")}</TableHead>}
                    {visibleColumns.actions && (
                      <TableHead className="text-right">
                        {t("actions")}
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody colSpan={visibleCount}>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      {visibleColumns.name && (
                        <TableCell className="font-medium">
                          {user.fullName}
                        </TableCell>
                      )}

                      {visibleColumns.email && (
                        <TableCell className="text-sm">{user.email}</TableCell>
                      )}

                      {visibleColumns.role && (
                        <TableCell className="text-sm">{user.role}</TableCell>
                      )}

                      {visibleColumns.status && (
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "ACTIVE"
                                ? "default"
                                : user.status === "BLOCKED"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                      )}

                      {visibleColumns.joinDate && (
                        <TableCell className="text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      )}

                      {visibleColumns.survey && (
                        <TableCell className="text-sm">
                          <Badge variant={user.hasTakenSurvey ? "default" : "outline"}>
                            {user.hasTakenSurvey ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                      )}

                      {visibleColumns.country && (
                        <TableCell className="text-sm">
                          {user.country || "-"}
                        </TableCell>
                      )}

                      {visibleColumns.experience && (
                        <TableCell className="text-sm">
                          {user.tradingExperience || "-"}
                        </TableCell>
                      )}

                      {visibleColumns.assets && (
                        <TableCell className="text-sm">
                          {user.assetsTraded?.length ? user.assetsTraded.join(", ") : "-"}
                        </TableCell>
                      )}

                      {visibleColumns.challenges && (
                        <TableCell className="text-sm">
                          {user.tookChallenge || "-"}
                        </TableCell>
                      )}

                      {visibleColumns.actions && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={
                                user.status === "BLOCKED"
                                  ? "default"
                                  : "destructive"
                              }
                              disabled={isStatusUpdating}
                              onClick={() => handleStatusUpdate(user)}
                            >
                              {user.status === "BLOCKED" ? t("unban") : t("ban")}
                            </Button>

                            {currentUser?.id !== user.id && (
                              <Select
                                value={user.role}
                                onValueChange={(value) => handleRoleUpdate(user, value)}
                                disabled={isRoleUpdating}
                              >
                                <SelectTrigger className="h-8 w-[130px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USER">{t("userRole")}</SelectItem>
                                  <SelectItem value="MODERATOR">{t("moderatorRole")}</SelectItem>
                                  <SelectItem value="SUPER_ADMIN">{t("adminRole")}</SelectItem>
                                </SelectContent>
                              </Select>
                            )}

                            {user.role !== "SUPER_ADMIN" && user.status !== "BLOCKED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isStatusUpdating}
                                onClick={() => handleDeleteUser(user)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} of {data?.meta?.total ?? users.length} users
            </p>
            <Pagination totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
}
