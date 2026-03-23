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
import { useDeletePaymentMethodMutation } from "@/redux/api/paymentMethodApi";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  title: string;
}

interface DeletePayMethodProps {
  paymentMethod: PaymentMethod;
  children?: React.ReactNode;
}

export default function DeletePayMethod({
  paymentMethod,
  children,
}: DeletePayMethodProps) {
  const t = useTranslations("Overview.payMethodManagement");
  const [deletePaymentMethod, { isLoading: deleteLoading }] =
    useDeletePaymentMethodMutation();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = async () => {
    const toastId = toast.loading(t("deletingPaymentMethod"));

    try {
      await deletePaymentMethod(paymentMethod.id).unwrap();
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
              "{paymentMethod.title}"
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
