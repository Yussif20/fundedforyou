"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useQueryBuilder } from "@/hooks/usePagination";

import {
  useCreatePaymentMethodMutation,
  useGetAllPaymentMethodQuery,
} from "@/redux/api/paymentMethodApi";
import { PaymentMethod } from "@/types/payment-method";
import { handleRTKMutation } from "@/utils/handleRTKMutation";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomSearch from "../search-input/CustomSearch";
import DropzoneUploader from "../ui/file-dropzone";

// --- Zod schema for payment method ---
const paymentMethodSchema = z.object({
  id: z.string().uuid("Invalid payment method ID").optional(),
  title: z.string().min(1, "Title is required"),
  paymentMethod: z
    .object({
      id: z.string().uuid("Invalid payment method ID").optional(),
      title: z.string().min(1, "Title is required"),
    })
    .optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export const AddEditPaymentMethodDialog = ({
  paymentMethod,
  onSelect,
}: {
  paymentMethod?: PaymentMethodFormValues;
  onSelect?: (method: PaymentMethod) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createPaymentMethod, { isLoading }] = useCreatePaymentMethodMutation();

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      id: paymentMethod?.id || undefined,
      title: paymentMethod?.title || "",
    },
  });

  // Show preview when file changes
  useEffect(() => {
    if (!logoFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(logoFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  const onSubmit = async (data: PaymentMethodFormValues) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: data.title,
      })
    );
    if (logoFile) formData.append("logo", logoFile as Blob);

    await handleRTKMutation(createPaymentMethod(formData));

    form.reset();
    setDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <PaymentMethodSearch
        setPaymentMethod={(method) => {
          form.setValue("id", method.id);
          form.setValue("paymentMethod", method);
          onSelect && onSelect(method);
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            {paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
            </DialogTitle>
          </DialogHeader>

          {/* Title */}
          <Field>
            <FieldLabel htmlFor="title">Payment Method Title</FieldLabel>
            <Input
              {...form.register("title")}
              id="title"
              placeholder="Enter payment method name"
            />
            <FieldError
              errors={
                form.formState.errors.title ? [form.formState.errors.title] : []
              }
            />
          </Field>

          {/* Logo Upload */}
          <Field>
            <FieldLabel>Payment Method Logo</FieldLabel>

            {previewUrl ? (
              <div className="mt-2 relative h-30 w-auto">
                <Image
                  unoptimized
                  src={previewUrl}
                  alt="Logo Preview"
                  fill
                  className="object-contain rounded-md border"
                />
                <Button
                  onClick={() => {
                    setLogoFile(null);
                    setPreviewUrl(null);
                  }}
                  variant={"destructive-outline"}
                  size={"icon"}
                  className="absolute top-1 right-1"
                >
                  <RiDeleteBin6Line />
                </Button>
              </div>
            ) : (
              <DropzoneUploader
                maxFiles={1}
                accept={{ "image/*": [] }}
                onFiles={(files) => setLogoFile(files[0])}
              />
            )}
          </Field>

          <DialogFooter className="gap-2 mt-4 grid grid-cols-2">
            <DialogClose asChild>
              <Button disabled={isLoading} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              isLoading={isLoading}
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {paymentMethod ? "Update Payment Method" : "Add Payment Method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Payment Method Search Component ---
const PaymentMethodSearch = ({
  setPaymentMethod,
}: {
  setPaymentMethod: (method: PaymentMethod) => void;
}) => {
  const { getParamsWithKey } = useQueryBuilder();
  const search = getParamsWithKey("searchTerm");
  const { data, isLoading, isFetching } = useGetAllPaymentMethodQuery([search]);

  const paymentMethods = (data?.data || []) as PaymentMethod[];

  return (
    <CustomSearch
      data={paymentMethods}
      isLoading={isLoading || isFetching}
      onClick={(method) => setPaymentMethod(method)}
      render={(method) => (
        <div className="flex gap-3 items-center">
          <Image
            src={method.logoUrl}
            alt={method.title}
            width={50}
            height={50}
            className="h-10 w-10 object-contain rounded-md border"
          />
          {method.title}
        </div>
      )}
    />
  );
};
