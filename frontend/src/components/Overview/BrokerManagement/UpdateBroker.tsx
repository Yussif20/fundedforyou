"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldValues } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomForm from "@/components/Forms/CustomForm";
import CustomInput from "@/components/Forms/CustomInput";
import { toast } from "sonner";
import BMImageUpload from "./BMImageUpload";
import { useUpdateBrokerMutation } from "@/redux/api/brokerApi";
import { Broker } from "@/types/broker.type";

interface UpdateBrokerProps {
  broker: Broker;
  children?: React.ReactNode;
}

export default function UpdateBroker({ broker, children }: UpdateBrokerProps) {
  const t = useTranslations("Overview.brokerManagement");
  const [update, { isLoading: updateLoading }] = useUpdateBrokerMutation();
  const [openDialog, setOpenDialog] = useState(false);

  const defaultValues = {
    title: broker.title,
    logoUrl: "",
  };

  const handleSubmit = async (data: FieldValues) => {
    if (!data.title) {
      toast.error(t("pleaseFillAll"));
      return;
    }

    const toastId = toast.loading(t("updatingBroker"));

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ title: data.title }));

      // Only append logo if it's a new file (not a URL string)
      if (data.logoUrl instanceof File) {
        formData.append("logo", data.logoUrl);
      }

      await update({ brokerId: broker.id, data: formData }).unwrap();
      toast.success(t("updateSuccess"), { id: toastId });
      setOpenDialog(false);
    } catch (error) {
      toast.error(t("updateError"), { id: toastId });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("updateBrokerTitle")}
          </DialogTitle>
        </DialogHeader>
        <CustomForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          className="space-y-5 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              {t("titleLabel")}
            </Label>
            <CustomInput
              type="text"
              name="title"
              fieldClassName="h-11"
              placeholder={t("titlePlaceholder")}
              required
            />
          </div>
          <BMImageUpload logoUrl={broker.logoUrl} />
          <DialogFooter className="space-x-2">
            <Button
              disabled={updateLoading}
              type="button"
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button disabled={updateLoading} type="submit">
              {updateLoading ? t("updating") : t("updateBrokerTitle")}
            </Button>
          </DialogFooter>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}
