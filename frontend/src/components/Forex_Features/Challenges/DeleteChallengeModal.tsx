"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteChallengeMutation } from "@/redux/api/challenge";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const DeleteModal = ({ isOpen, onClose, id }: DeleteModalProps) => {
  const t = useTranslations("CHALLENGEMANAGEMENT");
  const [deleteChallange, { isLoading: isDeleting }] =
    useDeleteChallengeMutation();

  const handleDelete = async () => {
    if (!id) return toast.error("No ID found!");

    try {
      await deleteChallange(id).unwrap();
      toast.success(t("challengeDeletedSuccessfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("failedToDeleteChallenge"));
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("deleteChallenge")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-2">
          {t("areYouSureYouWantToDeleteThisChallenge")}
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

export default DeleteModal;
