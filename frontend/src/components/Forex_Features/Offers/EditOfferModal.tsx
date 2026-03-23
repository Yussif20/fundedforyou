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
import { Offer, useUpdateOfferMutation } from "@/redux/api/offerApi";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import OfferForm from "./OfferForm";
import { formatISOToCustom } from "@/utils/formatISOToCustom";

interface EditOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer;
}

export default function EditOfferModal({
  open,
  onOpenChange,
  offer,
}: EditOfferModalProps) {
  const t = useTranslations("Offers");
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferMutation();

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
        textArabic: data.textArabic,
        endDate: data?.endDate ? new Date(data?.endDate).toISOString() : null,
        timerCode: data.endDate ? data.timerCode || null : null,
        timerOfferPercentage: data.endDate ? Number(data.timerOfferPercentage) || null : null,
        timerDiscountType: data.endDate ? data.timerDiscountType || null : null,
        timerDiscountText: data.endDate && data.timerDiscountType === "TEXT" ? data.timerDiscountText || null : null,
        timerDiscountTextArabic: data.endDate && data.timerDiscountType === "TEXT" ? data.timerDiscountTextArabic || null : null,
        timerText: data.endDate ? data.timerText || null : null,
        timerTextArabic: data.endDate ? data.timerTextArabic || null : null,
      };

      const response = await updateOffer({
        id: offer.id,
        data: payload,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || t("offerUpdated"));
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("offerUpdateFailed"));
    }
  };

  const defaultValues = {
    firmId: offer.firmId,
    code: offer.code,
    offerPercentage: offer.offerPercentage.toString(),
    discountType: offer.discountType || "PERCENTAGE",
    discountText: offer.discountText || "",
    discountTextArabic: offer.discountTextArabic || "",
    isExclusive: offer.isExclusive,
    hidden: (offer as any).hidden ?? false,
    showInBanner: (offer as any).showInBanner ?? false,
    text: offer.text,
    textArabic: offer.textArabic,
    showGift: offer.showGift,
    giftText: offer.giftText,
    giftTextArabic: offer.giftTextArabic,
    endDate: offer.endDate ? formatISOToCustom(offer.endDate) : "",
    timerCode: offer.timerCode || "",
    timerOfferPercentage: offer.timerOfferPercentage?.toString() || "",
    timerDiscountType: offer.timerDiscountType || "PERCENTAGE",
    timerDiscountText: offer.timerDiscountText || "",
    timerDiscountTextArabic: offer.timerDiscountTextArabic || "",
    timerText: offer.timerText || "",
    timerTextArabic: offer.timerTextArabic || "",
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:!max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editOffer")}</DialogTitle>
          <DialogDescription>{t("editOfferDescription")}</DialogDescription>
        </DialogHeader>

        <CustomForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          className="space-y-4"
        >
          {/* Firm Selection */}
          <OfferForm />

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUpdating ? t("updating") : t("update")}
            </Button>
          </DialogFooter>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}
