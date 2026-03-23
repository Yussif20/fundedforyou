"use client";

import CustomForm from "@/components/Forms/CustomForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateOfferMutation } from "@/redux/api/offerApi";
import { useCurrentUser } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import OfferForm from "./OfferForm";

export default function AddNewOffer() {
  const user = useAppSelector(useCurrentUser);
  const role = user?.role;
  const t = useTranslations("Offers");
  const [open, setOpen] = useState(false);

  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();

  // Fetch firms with search support

  const handleSubmit = async (data: FieldValues) => {
    try {
      const payload = {
        firmId: data.firmId,
        code: data.code,
        offerPercentage: Number(data.offerPercentage) || 0,
        discountType: data.discountType || "PERCENTAGE",
        discountText: data.discountType === "TEXT" ? data.discountText || "" : "",
        discountTextArabic: data.discountType === "TEXT" ? data.discountTextArabic || "" : "",
        isExclusive: data.isExclusive === true || data.isExclusive === "true",
        showGift: data.showGift === true || data.showGift === "true",
        hidden: data.hidden === true || data.hidden === "true",
        showInBanner: data.showInBanner === true || data.showInBanner === "true",
        giftText: data.showGift ? data.giftText : "",
        giftTextArabic: data.showGift ? data.giftTextArabic : "",
        text: data.text,
        endDate: data?.endDate ? new Date(data?.endDate).toISOString() : null,
        timerCode: data.endDate ? data.timerCode || null : null,
        timerOfferPercentage: data.endDate ? Number(data.timerOfferPercentage) || null : null,
        timerDiscountType: data.endDate ? data.timerDiscountType || null : null,
        timerDiscountText: data.endDate && data.timerDiscountType === "TEXT" ? data.timerDiscountText || null : null,
        timerDiscountTextArabic: data.endDate && data.timerDiscountType === "TEXT" ? data.timerDiscountTextArabic || null : null,
        timerText: data.endDate ? data.timerText || null : null,
        timerTextArabic: data.endDate ? data.timerTextArabic || null : null,
        textArabic: data.textArabic,
      };

      const response = await createOffer(payload).unwrap();

      if (response.success) {
        toast.success(response.message || t("offerCreated"));
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("offerCreateFailed"));
    }
  };

  const defaultValues = {
    firmId: "",
    code: "",
    offerPercentage: "",
    discountType: "PERCENTAGE",
    discountText: "",
    discountTextArabic: "",
    giftText: "",
    giftTextArabic: "",
    isExclusive: false,
    showGift: false,
    hidden: false,
    showInBanner: false,
    text: "",
    textArabic: "",
    endDate: "",
    timerCode: "",
    timerOfferPercentage: "",
    timerDiscountType: "PERCENTAGE",
    timerDiscountText: "",
    timerDiscountTextArabic: "",
    timerText: "",
    timerTextArabic: "",
  };

  if (role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {t("addOffer")}
        <Plus />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:!max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addNewOffer")}</DialogTitle>
            <DialogDescription>{t("createNewOffer")}</DialogDescription>
          </DialogHeader>

          <CustomForm
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            className="space-y-4"
          >
            <OfferForm />

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isCreating}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCreating ? t("creating") : t("create")}
              </Button>
            </DialogFooter>
          </CustomForm>
        </DialogContent>
      </Dialog>
    </>
  );
}
