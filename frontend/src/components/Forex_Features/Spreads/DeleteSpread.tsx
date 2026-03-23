"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteSpreadMutation } from "@/redux/api/spreadApi";
import { useTranslations } from "next-intl";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const DeleteSpread = ({ isOpen, onClose, id }: DeleteModalProps) => {
  const t = useTranslations("ManageSpread");
  const [deleteSpread, { isLoading: isDeleting }] = useDeleteSpreadMutation();

  const handleDelete = async () => {
    if (!id) return toast.error(t("no_id_found"));

    try {
      await deleteSpread(id).unwrap();
      toast.success(t("deleted_successfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete"));
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("delete_spread")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-2">
          {t("delete_warning")}
        </p>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSpread;
