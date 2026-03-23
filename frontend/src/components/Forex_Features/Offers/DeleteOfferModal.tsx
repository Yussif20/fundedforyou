"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteOfferMutation } from "@/redux/api/offerApi";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface DeleteOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerId: string;
  offerCode?: string;
}

export default function DeleteOfferModal({
  open,
  onOpenChange,
  offerId,
  offerCode,
}: DeleteOfferModalProps) {
  const t = useTranslations("Offers");
  const [deleteOffer, { isLoading }] = useDeleteOfferMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteOffer(offerId).unwrap();

      if (response.success) {
        toast.success(response.message || t("offerDeleted"));
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("offerDeleteFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">{t("deleteOffer")}</DialogTitle>
          <DialogDescription className="text-center">
            {t("deleteOfferConfirmation")}
            {offerCode && (
              <span className="block mt-2 font-semibold text-foreground">
                {offerCode}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
