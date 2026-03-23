"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useDeleteFirmMutation } from "@/redux/api/firms.api";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteModalProps {
  id: string;
}

const DeleteFirmDialog = ({ id }: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("FirmManagement");
  const [deleteFirm, { isLoading: isDeleting }] = useDeleteFirmMutation();

  const handleDelete = async () => {
    if (!id) return toast.error(t("no_id_found"));

    try {
      await deleteFirm(id).unwrap();
      toast.success(t("deleted_successfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete"));
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("delete_firm")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-2">
          {t("delete_warning")}
        </p>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
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

export default DeleteFirmDialog;
