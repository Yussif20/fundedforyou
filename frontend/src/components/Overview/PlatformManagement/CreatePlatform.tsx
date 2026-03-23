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
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomForm from "@/components/Forms/CustomForm";
import CustomInput from "@/components/Forms/CustomInput";
import { useCreatePlatformMutation } from "@/redux/api/platformApi";
import { toast } from "sonner";
import ImageUpload from "./PMImageUpload";

export default function CreatePlatform() {
  const t = useTranslations("Overview.platformManagement");
  const [create, { isLoading: createLoading }] = useCreatePlatformMutation();
  const [openDialog, setOpenDialog] = useState(false);

  const defaultValues = {
    title: "",
    logoUrl: "",
  };

  const handleSubmit = async (data: FieldValues) => {
    if (!data.title || !data.logoUrl) {
      toast.error(t("pleaseFillAll"));
      return;
    }
    const toastId = toast.loading(t("creatingPlatform"));
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ title: data.title }));
      formData.append("logo", data.logoUrl);
      await create(formData).unwrap();
      toast.success(t("createSuccess"), { id: toastId });
      setOpenDialog(false);
    } catch (error) {
      toast.error(t("createError"), { id: toastId });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> {t("addPlatform")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("addPlatformTitle")}
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

          <ImageUpload />
          <DialogFooter className="space-x-2">
            <Button
              disabled={createLoading}
              type="button"
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button disabled={createLoading} type="submit">
              {createLoading ? t("creating") : t("addPlatform")}
            </Button>
          </DialogFooter>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}
