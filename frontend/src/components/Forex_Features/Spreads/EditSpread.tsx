"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CustomForm from "@/components/Forms/CustomForm";
import CustomSelect from "@/components/Forms/CustomSelect";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetPlatformsQuery,
  useUpdateSpreadMutation,
} from "@/redux/api/spreadApi";
import CustomCombobox from "@/components/Forms/CustomCombobox";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import useIsFutures from "@/hooks/useIsFutures";
import { useTranslations } from "next-intl";
import { Spread } from "@/types";

export interface IEditSpreadModalProps {
  spread: Spread;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function EditSpread({
  spread,
  open,
  setOpen,
}: IEditSpreadModalProps) {
  const t = useTranslations("ManageSpread"); // i18n namespace
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const isFutures = useIsFutures();

  const { data: firmsData, isLoading: isFirmsLoading } = useGetAllFirmsQuery([
    { name: "limit", value: 10 },
    { name: "searchTerm", value: searchTerm },
    { name: "firmType", value: isFutures ? "FUTURES" : "FOREX" },
  ]);

  const { data: platformsData, isLoading: platformsLoading } =
    useGetPlatformsQuery([
      { name: "limit", value: 10 },
      { name: "searchTerm", value: searchTerm2 },
    ]);

  const [editSpread, { isLoading: updating }] = useUpdateSpreadMutation();

  const firmOptions = (firmsData?.firms || []).map((f: any) => ({
    label: f.name ?? f.title ?? f.companyName ?? f.id,
    value: f.id,
  }));

  const platformOptions = (platformsData?.data?.platforms || []).map(
    (p: any) => ({
      label: p.name ?? p.title ?? p.id,
      value: p.id,
    })
  );

  const typeOptions = [
    { label: t("popular"), value: "POPULAR" },
    { label: t("forex"), value: "FOREX" },
    { label: t("crypto"), value: "CRYPTO" },
    { label: t("indices"), value: "INDICES" },
    { label: t("metals"), value: "METALS" },
  ];

  const handleSubmit = async (data: any, _methods?: any) => {
    try {
      await editSpread({ id: spread.id, data }).unwrap();
      toast.success(t("spread_updated"));
      setOpen(false);
    } catch (err: any) {
      const msg = err?.data?.message ?? t("failed_to_update_spread");
      toast.error(msg);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("edit_spread")}</DialogTitle>
          </DialogHeader>

          <CustomForm
            onSubmit={handleSubmit}
            defaultValues={{
              firmId: spread.firm.id,
              platformId: spread.platform.id,
              type: spread.type,
            }}
          >
            <div className="space-y-4">
              <CustomCombobox
                name="firmId"
                label={t("select_firm")}
                placeholder={
                  isFirmsLoading ? t("loading_firms") : t("choose_firm")
                }
                searchPlaceholder={t("search_firms")}
                emptyMessage={t("no_firms_found")}
                options={firmOptions}
                required
                disabled={isFirmsLoading}
                buttonClassName="h-11"
                onSearchChange={setSearchTerm}
                isSearching={isFirmsLoading}
              />

              <CustomCombobox
                name="platformId"
                label={t("platform")}
                placeholder={
                  platformsLoading
                    ? t("loading_platforms")
                    : t("select_platform")
                }
                searchPlaceholder={t("search_platforms")}
                emptyMessage={t("no_platforms_found")}
                options={platformOptions}
                required
                buttonClassName="h-11"
                onSearchChange={setSearchTerm2}
                isSearching={platformsLoading}
              />

              <CustomSelect
                name="type"
                label={t("type")}
                options={typeOptions}
                placeholder={t("select_type")}
                required
              />

              <DialogFooter>
                <Button type="submit" disabled={updating}>
                  {updating ? t("updating") : t("update")}
                </Button>
              </DialogFooter>
            </div>
          </CustomForm>
        </DialogContent>
    </Dialog>
  );
}
