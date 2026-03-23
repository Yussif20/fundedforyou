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
  useCreatePlatformsMutation,
  useGetPlatformsQuery,
} from "@/redux/api/spreadApi";
import { Platform_T } from "@/types/spread.types";
import { handleRTKMutation } from "@/utils/handleRTKMutation";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";
import CustomSearch from "../search-input/CustomSearch";
import DropzoneUploader from "../ui/file-dropzone";

// --- Zod schema for platform ---
const platformSchema = z.object({
  id: z.string().uuid("Invalid platform ID").optional(),
  title: z.string().min(1, "Title is required"),
  platform: z
    .object({
      id: z.string().uuid("Invalid platform ID").optional(),
      title: z.string().min(1, "Title is required"),
    })
    .optional(),
});

type PlatformFormValues = z.infer<typeof platformSchema>;

export const AddEditPlatformDialog = ({
  platform,
  onSelect,
}: {
  platform?: PlatformFormValues;
  onSelect?: (platform: Platform_T) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [createPlatform, { isLoading }] = useCreatePlatformsMutation();

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformSchema),
    defaultValues: {
      id: platform?.id || undefined,
      title: platform?.title || "",
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

  const onSubmit = async (data: PlatformFormValues) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: data.title,
      })
    );
    if (logoFile) formData.append("logo", logoFile as Blob);

    await handleRTKMutation(createPlatform(formData));

    form.reset();
    setDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <PlatformSearch
        setPlatform={(platform) => {
          form.setValue("id", platform.id);
          form.setValue("platform", platform);
          onSelect && onSelect(platform);
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>{platform ? "Edit Platform" : "Add Platform"}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {platform ? "Edit Platform" : "Add Platform"}
            </DialogTitle>
          </DialogHeader>

          {/* Title */}
          <Field>
            <FieldLabel htmlFor="title">Platform Title</FieldLabel>
            <Input
              {...form.register("title")}
              id="title"
              placeholder="Enter platform name"
            />
            <FieldError
              errors={
                form.formState.errors.title ? [form.formState.errors.title] : []
              }
            />
          </Field>

          {/* Logo Upload */}
          <Field>
            <FieldLabel>Platform Logo</FieldLabel>

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
              {platform ? "Update Platform" : "Add Platform"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Platform Search Component ---
const PlatformSearch = ({
  setPlatform,
}: {
  setPlatform: (platform: Platform_T) => void;
}) => {
  const { getParamsWithKey } = useQueryBuilder();
  const search = getParamsWithKey("searchTerm");
  const { data, isLoading, isFetching } = useGetPlatformsQuery([search]);

  const platforms = (data?.data?.platforms || []) as Platform_T[];

  return (
    <CustomSearch<Platform_T>
      data={platforms}
      isLoading={isLoading || isFetching}
      onClick={(platform) => setPlatform(platform)}
      render={(platform) => (
        <div className="flex gap-3 items-center">
          <Image
            src={platform.logoUrl}
            alt={platform.title}
            width={50}
            height={50}
            className="h-10 w-10 object-contain rounded-md border"
          />
          {platform.title}
        </div>
      )}
    />
  );
};
