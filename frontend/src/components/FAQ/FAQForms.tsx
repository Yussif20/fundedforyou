"use client";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FAQ } from "@/types";
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
import {
  createFaqAction,
  deleteFaqAction,
  updateFaqAction,
} from "../editor/plugins/actions/faq-actions";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import RichTextEditor2 from "../Forms/RichTextEditor2";

export function AddFaq() {
  const role = useAppSelector(useCurrentUser)?.role;
  const t = useTranslations("FAQ");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultValues = {
    question: "",
    questionArabic: "",
    answer: "",
    answerArabic: "",
    mobileFontSize: undefined as number | undefined,
  };

  const handleSubmit = async (data: FieldValues) => {
    if (role !== "SUPER_ADMIN") return;
    startTransition(async () => {
      const payload = {
        question: data.question,
        questionArabic: data.questionArabic,
        answer: data.answer,
        answerArabic: data.answerArabic,
        mobileFontSize: data.mobileFontSize
          ? parseInt(String(data.mobileFontSize))
          : undefined,
      };

      const result = await createFaqAction(payload);

      if (result.success) {
        toast.success(result.message);
        setIsDialogOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };
  if (role !== "SUPER_ADMIN") return null;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 z-10">
          <Plus className="w-4 h-4" />
          {t("addFaq")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]!">
        <DialogHeader>
          <DialogTitle>{t("addNewFaq")}</DialogTitle>
          <DialogDescription>{t("fillFaqDetails")}</DialogDescription>
        </DialogHeader>
        <CustomForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          className="space-y-4"
        >
          <Form />
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline2"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}

export function EditFaq({
  faq,
  children,
}: {
  faq: FAQ;
  children: React.ReactNode;
}) {
  const t = useTranslations("FAQ");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultValues = {
    question: faq.question,
    questionArabic: faq.questionArabic,
    answer: faq.answer,
    answerArabic: faq.answerArabic,
    mobileFontSize: faq.mobileFontSize ?? undefined,
  };

  const handleSubmit = async (data: FieldValues) => {
    if (!faq.id) return;

    startTransition(async () => {
      const payload = {
        question: data.question,
        questionArabic: data.questionArabic,
        answer: data.answer,
        answerArabic: data.answerArabic,
        mobileFontSize: data.mobileFontSize
          ? parseInt(String(data.mobileFontSize))
          : undefined,
      };

      const result = await updateFaqAction(faq.id!, payload);

      if (result.success) {
        toast.success(result.message);
        setIsDialogOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Pencil className="w-4 h-4" />
            {t("edit")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]! max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editFaq")}</DialogTitle>
          <DialogDescription>{t("fillFaqDetails")}</DialogDescription>
        </DialogHeader>
        <CustomForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          className="space-y-4"
        >
          <Form />
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline2"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? t("updating") : t("update")}
            </Button>
          </DialogFooter>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteFaq({
  faq,
  children,
}: {
  faq: FAQ;
  children: React.ReactNode;
}) {
  const t = useTranslations("FAQ");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteConfirm = async () => {
    if (!faq.id) return;

    const toastId = toast.loading("Deleting...");

    startTransition(async () => {
      const result = await deleteFaqAction(faq.id!);

      if (result.success) {
        toast.success(result.message, { id: toastId });
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.message, { id: toastId });
      }
    });
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Trash2 className="w-4 h-4" />
            {t("delete")}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteConfirm")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const Form = () => {
  const t = useTranslations("FAQ");
  return (
    <>
      <CustomInput
        type="text"
        name="question"
        label={t("question")}
        placeholder={t("questionPlaceholder")}
        required
        fieldClassName="h-11"
      />

      <CustomInput
        type="text"
        name="questionArabic"
        label={t("questionArabic")}
        placeholder={t("questionArabicPlaceholder")}
        required
        fieldClassName="h-11"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RichTextEditor2
          name="answer"
          label={t("answer")}
          placeholder={t("answerPlaceholder")}
          mobileFontSizeName="mobileFontSize"
          required
        />
        <RichTextEditor2
          name="answerArabic"
          label={t("answerArabic")}
          placeholder={t("answerArabicPlaceholder")}
          required
        />
      </div>
    </>
  );
};
