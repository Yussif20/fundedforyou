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
  useCreateBrokerMutation,
  useGetBrokersQuery,
} from "@/redux/api/brokerApi";
import { Broker } from "@/types/firm.types";
import { handleRTKMutation } from "@/utils/handleRTKMutation";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomSearch from "../search-input/CustomSearch";
import DropzoneUploader from "../ui/file-dropzone";

// --- Zod schema for broker ---
const brokerSchema = z.object({
  id: z.string().uuid("Invalid broker ID").optional(),
  title: z.string().min(1, "Title is required"),
  broker: z
    .object({
      id: z.string().uuid("Invalid broker ID").optional(),
      title: z.string().min(1, "Title is required"),
    })
    .optional(),
});

type BrokerFormValues = z.infer<typeof brokerSchema>;

export const AddEditBrokerDialog = ({
  broker,
  onSelect,
}: {
  broker?: BrokerFormValues;
  onSelect?: (broker: Broker) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createBroker, { isLoading }] = useCreateBrokerMutation();

  const form = useForm<BrokerFormValues>({
    resolver: zodResolver(brokerSchema),
    defaultValues: {
      id: broker?.id || undefined,
      title: broker?.title || "",
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

  const onSubmit = async (data: BrokerFormValues) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: data.title,
      })
    );
    formData.append("logo", logoFile as Blob);

    await handleRTKMutation(createBroker(formData));

    form.reset();
    setDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <BrokerSearch
        setBroker={(broker) => {
          form.setValue("id", broker.id);
          form.setValue("broker", broker);
          onSelect && onSelect(broker);
        }}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>{broker ? "Edit Broker" : "Add Broker"}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{broker ? "Edit Broker" : "Add Broker"}</DialogTitle>
          </DialogHeader>
          {/* Title */}
          <Field>
            <FieldLabel htmlFor="title">Broker Title</FieldLabel>
            <Input
              {...form.register("title")}
              id="title"
              placeholder="Enter broker name"
            />
            <FieldError
              errors={
                form.formState.errors.title ? [form.formState.errors.title] : []
              }
            />
          </Field>
          {/* Logo Upload */}
          <Field>
            <FieldLabel>Broker Logo</FieldLabel>

            {previewUrl ? (
              <div className="mt-2 relative h-30 w-auto">
                <Image
                  unoptimized
                  src={previewUrl}
                  alt="Logo Preview"
                  fill
                  className=" object-contain rounded-md border"
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
              onClick={() => form.handleSubmit(onSubmit)()} // MANUALLY triggering submit
            >
              {broker ? "Update Broker" : "Add Broker"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BrokerSearch = ({
  setBroker,
}: {
  setBroker: (broker: Broker) => void;
}) => {
  const { getParamsWithKey } = useQueryBuilder();
  const search = getParamsWithKey("searchTerm");
  const { data, isLoading, isFetching } = useGetBrokersQuery([search]);

  // Dropdown open state

  const brokers = (data?.data?.brokers || []) as Broker[];

  return (
    <CustomSearch
      onClick={(data) => setBroker(data)}
      isLoading={isLoading || isFetching}
      data={brokers}
      render={(data) => (
        <div className="flex gap-3">
          <Image
            src={data.logoUrl}
            alt={data.title}
            width={50}
            height={50}
            className="h-10 object-contain rounded-md border"
          />
          {data.title}
        </div>
      )}
    />
  );
};
