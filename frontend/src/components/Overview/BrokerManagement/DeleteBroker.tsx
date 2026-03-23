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
import { useDeleteBrokerMutation } from "@/redux/api/brokerApi";
import { toast } from "sonner";
import { Broker } from "@/types/broker.type";

interface DeleteBrokerProps {
  broker: Broker;
  children?: React.ReactNode;
}

export default function DeleteBroker({ broker, children }: DeleteBrokerProps) {
  const t = useTranslations("Overview.brokerManagement");
  const [deleteBroker, { isLoading: deleteLoading }] =
    useDeleteBrokerMutation();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const toastId = toast.loading(t("deletingBroker"));

    try {
      await deleteBroker(broker.id).unwrap();
      toast.success(t("deleteSuccess"), { id: toastId });
      setOpenDialog(false);
    } catch (error) {
      toast.error(t("deleteError"), { id: toastId });
    }
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDescription")}{" "}
            <span className="font-semibold text-foreground">
              "{broker.title}"
            </span>{" "}
            {t("fromTheSystem")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteLoading}>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteLoading}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteLoading ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
