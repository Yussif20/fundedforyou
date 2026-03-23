"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CustomForm from "@/components/Forms/CustomForm";
import CustomInput from "@/components/Forms/CustomInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreateSymbolValueMutation,
  useUpdateSymbolValueMutation,
} from "@/redux/api/spreadApi";
import { useTranslations } from "next-intl";

export interface IAddEditSymbolValueModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  symbolId: string;
  spreadId: string;
  initialValue?: {
    minValue?: number;
    maxValue?: number;
    min?: number;
    max?: number;
    id?: string;
  } | null;
}

export default function AddEditSymbolValueModal({
  open,
  setOpen,
  symbolId,
  spreadId,
  initialValue = null,
}: IAddEditSymbolValueModalProps) {
  const t = useTranslations("ManageSpread"); // namespace for translations

  const [createSymbolValue, { isLoading: creating }] =
    useCreateSymbolValueMutation();
  const [updateSymbolValue, { isLoading: updating }] =
    useUpdateSymbolValueMutation();

  const isEdit = Boolean(initialValue);

  const handleSubmit = async (data: any, methods?: any) => {
    const payload = {
      minValue: Number(data.minValue),
      maxValue: Number(data.maxValue),
      spreadId,
      symbolId,
    };

    try {
      if (isEdit) {
        await updateSymbolValue({ payload, id: initialValue?.id }).unwrap();
        toast.success(t("spread_value_updated"));
      } else {
        await createSymbolValue(payload).unwrap();
        toast.success(t("spread_value_created"));
      }
      methods?.reset();
      setOpen(false);
    } catch (err: any) {
      const msg = err?.data?.message ?? t("failed_to_save_value");
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("edit_spread_value") : t("add_spread_value")}
          </DialogTitle>
        </DialogHeader>

        <CustomForm
          onSubmit={handleSubmit}
          defaultValues={{
            minValue: initialValue?.minValue ?? initialValue?.min ?? "",
            maxValue: initialValue?.maxValue ?? initialValue?.max ?? "",
          }}
        >
          <div className="space-y-4">
            <CustomInput
              type="number"
              name="minValue"
              label={t("min_value")}
              required
            />
            <CustomInput
              type="number"
              name="maxValue"
              label={t("max_value")}
              required
            />

            <DialogFooter>
              <Button type="submit" disabled={creating || updating}>
                {creating || updating
                  ? t("saving")
                  : isEdit
                  ? t("update")
                  : t("create")}
              </Button>
            </DialogFooter>
          </div>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}
