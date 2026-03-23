"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
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
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";

import DropzoneUploader from "@/components/ui/file-dropzone";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/redux/api/announcementApi";
import { Announcement_T } from "@/types/announcement.types";
import { handleRTKMutation } from "@/utils/handleRTKMutation";
import { FaPen } from "react-icons/fa";

// Zod schema
const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().optional(),
  redirectUrl: z.string().optional(),
  firmId: z.string().optional(),
  mobileFontSize: z.coerce.number().int().min(10).max(24).optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export const AddEditAnnouncementDialog = ({
  announcement,
  onSaved,
  firmId,
}: {
  announcement?: Announcement_T;
  onSaved?: (announcement: Announcement_T) => void;
  firmId: string;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    announcement?.thumbnailUrl || null
  );

  const [createAnnouncement, { isLoading: isCreating }] =
    useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema) as Resolver<AnnouncementFormValues>,
    defaultValues: {
      id: announcement?.id,
      title: announcement?.title || "",
      description: announcement?.description || "",
      date: announcement?.date
        ? new Date(announcement.date).toISOString().split("T")[0]
        : "",
      redirectUrl: announcement?.redirectUrl || "",
      firmId: firmId,
      mobileFontSize: announcement?.mobileFontSize ?? undefined,
    },
  });

  // Thumbnail preview
  useEffect(() => {
    if (!thumbnailFile) return;
    const url = URL.createObjectURL(thumbnailFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const onSubmit = async (data: AnnouncementFormValues) => {
    const formData = new FormData();

    // Convert date string to ISO-8601 DateTime
    const date = data.date ? new Date(data.date) : undefined;

    const dataToBackend = {
      title: data.title,
      description: data.description,
      date, // ISO string
      redirectUrl: data.redirectUrl,
      firmId: firmId,
      ...(data.mobileFontSize ? { mobileFontSize: data.mobileFontSize } : {}),
    };

    formData.append("data", JSON.stringify(dataToBackend));

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    if (announcement) {
      await handleRTKMutation(
        updateAnnouncement({ id: announcement.id, data: formData }),
        {
          onSuccess: () => {
            form.reset();
            setThumbnailFile(null);
            setDialogOpen(false);
          },
        }
      );
    } else {
      await handleRTKMutation(createAnnouncement(formData), {
        onSuccess: () => {
          form.reset();
          setThumbnailFile(null);
          setDialogOpen(false);
        },
      });
    }

    if (onSaved)
      onSaved({ ...data, id: announcement?.id || "" } as Announcement_T);
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>{announcement ? <FaPen /> : "Add Announcement"}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? "Edit Announcement" : "Add Announcement"}
          </DialogTitle>
        </DialogHeader>

        {/* Title */}
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            {...form.register("title")}
            id="title"
            placeholder="Enter announcement title"
          />
          <FieldError
            errors={
              form.formState.errors.title ? [form.formState.errors.title] : []
            }
          />
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            {...form.register("description")}
            id="description"
            className="min-h-32"
            placeholder="Enter description"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="date">Date</FieldLabel>
          <Input
            {...form.register("date")}
            id="date"
            type="date"
            placeholder="Select date"
          />
        </Field>

        {/* Redirect URL */}
        <Field>
          <FieldLabel htmlFor="redirectUrl">Redirect URL</FieldLabel>
          <Input
            {...form.register("redirectUrl")}
            id="redirectUrl"
            type="url"
            placeholder="Enter redirect URL"
          />
        </Field>

        {/* Mobile Font Size */}
        <Field>
          <FieldLabel htmlFor="mobileFontSize">
            Mobile Font Size (px)
          </FieldLabel>
          <Input
            {...form.register("mobileFontSize")}
            id="mobileFontSize"
            type="number"
            min={10}
            max={24}
            placeholder="e.g. 14 (10–24)"
            className="w-40"
          />
        </Field>

        {/* Thumbnail */}
        <Field>
          <FieldLabel>Thumbnail</FieldLabel>
          {previewUrl ? (
            <div className="mt-2 relative h-32 w-full">
              <Image
                unoptimized
                src={previewUrl}
                alt="Thumbnail Preview"
                fill
                className="object-contain rounded-md border"
              />
              <Button
                onClick={() => {
                  setThumbnailFile(null);
                  setPreviewUrl(null);
                }}
                variant="destructive-outline"
                size="icon"
                className="absolute top-1 right-1"
              >
                <RiDeleteBin6Line />
              </Button>
            </div>
          ) : (
            <DropzoneUploader
              maxFiles={1}
              accept={{ "image/*": [] }}
              onFiles={(files) => setThumbnailFile(files[0])}
            />
          )}
        </Field>

        <DialogFooter className="gap-2 mt-4 grid grid-cols-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>

          <Button isLoading={isLoading} onClick={form.handleSubmit(onSubmit)}>
            {announcement ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
