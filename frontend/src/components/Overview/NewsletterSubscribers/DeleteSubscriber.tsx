"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDeleteNewsLetterSubscriberMutation } from "@/redux/api/newsLetter";
import { toast } from "sonner";

interface DeleteSubscriberProps {
  subscriber: { id: string; email: string };
}

export default function DeleteSubscriber({
  subscriber,
}: DeleteSubscriberProps) {
  const t = useTranslations("Overview.newsletterSubscribers");
  const [deleteSubscriber, { isLoading }] =
    useDeleteNewsLetterSubscriberMutation();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const toastId = toast.loading(t("deleting"));

    try {
      await deleteSubscriber(subscriber.id).unwrap();
      toast.success(t("deleteSuccess"), { id: toastId });
      setOpenDialog(false);
    } catch {
      toast.error(t("deleteError"), { id: toastId });
    }
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDescription")}{" "}
            <span className="font-semibold text-foreground">
              "{subscriber.email}"
            </span>{" "}
            {t("fromTheList")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
