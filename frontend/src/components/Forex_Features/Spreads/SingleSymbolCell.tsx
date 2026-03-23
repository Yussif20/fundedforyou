import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import LoadingSpin from "./LoadingSpin";
import { Trash2, Pencil, AlertTriangle } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { useDeleteSymbolMutation } from "@/redux/api/spreadApi";
import EditSymbolModal from "./EditSymbolModal";
import { useTranslations } from "next-intl";

export default function SingleSymbolCell({
  item,
  symbol,
}: {
  item: {
    id: string;
    countries: {
      flag: string | StaticImageData;
      currency: string;
      country?: string;
      code?: string;
    }[];
  };
  symbol: {
    id: string;
    countries: string[];
  };
}) {
  const t = useTranslations("ManageSpread");
  const currentUser = useAppSelector(useCurrentUser);
  const userRole = currentUser?.role;
  const [deleteSymbol, { isLoading: isSymbolDeleting }] =
    useDeleteSymbolMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await deleteSymbol(item.id).unwrap();
      toast.success(response?.message || t("symbolDeletedSuccessfully"));
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failedToDeleteSymbol"));
    }
  };

  return (
    <>
      <div className="flex gap-3 items-center justify-between w-full">
        {/* Symbol Display */}
        <div className="flex flex-col justify-center gap-1.5">
          <div className="flex gap-1.5">
            {item.countries.map((country, index) => (
              <div
                key={`${country.currency}-${index}`}
                className="w-6 h-6 rounded-full overflow-hidden relative border border-border"
              >
                <Image
                  src={country.flag}
                  alt={country.currency}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {item.countries.map((i) => i.currency).join("/")}
          </p>
        </div>

        {/* Actions Menu - Only for SUPER_ADMIN */}
        {userRole === "SUPER_ADMIN" && (
          <div className="flex items-center gap-1 absolute top-1 right-1">
            <EditSymbolModal symbol={symbol}>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Pencil className="h-4 w-4" />
              </Button>
            </EditSymbolModal>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>{t("deleteSymbol")}</DialogTitle>
            </div>
            <DialogDescription className="pt-3">
              {t("delWarning")} (
              <span className="font-semibold">
                {item.countries.map((i) => i.currency).join("/")}
              </span>
              )? {t("delWarningDes")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <Button
              variant="outline2"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSymbolDeleting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSymbolDeleting}
            >
              {isSymbolDeleting ? (
                <>
                  <LoadingSpin />
                  <span className="ml-2">{t("deleting")}</span>
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("delete")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
