"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Info, Mail, User } from "lucide-react";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import CustomSelect from "../Forms/CustomSelect";
import CustomTextarea from "../Forms/CustomTextarea";
import CustomTabToggler from "../Forms/CustomTabToggler";
import { Link } from "@/i18n/navigation";
import { useCreateContactUsMutation } from "@/redux/api/contactUs";
import { toast } from "sonner";

const defaultValues = {
  contactType: "question",
  inquiry: "",
  fullName: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const t = useTranslations("ContactForm");

  const [createContact] = useCreateContactUsMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Convert tab toggler lowercase to uppercase
      const payload = {
        ...data,
        contactType: data?.contactType?.toUpperCase(),
      };



      await createContact(payload).unwrap();

      toast.success(t("messageSentSuccessfully"));
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          t("somethingWentWrong")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      className="space-y-6"
    >
      {/* Inquiry Type Tabs */}
      <CustomTabToggler
        name="contactType"
        options={[
          { label: t("tabs.question"), value: "question" },
          { label: t("tabs.suggestion"), value: "suggestion" },
        ]}
      />

      {/* Inquiry Select */}
      <CustomSelect
        required
        name="inquiry"
        label={t("inquiry.label")}
        placeholder={t("inquiry.placeholder")}
        options={[
          { value: "general", label: t("inquiry.options.general") },
          { value: "technical", label: t("inquiry.options.technical") },
          { value: "other", label: t("inquiry.options.other") },
        ]}
        disabled={isSubmitting}
      />

      {/* Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          required
          name="fullName"
          type="text"
          label={t("fullName.label")}
          placeholder={t("fullName.placeholder")}
          Icon={<User size={16} />}
          disabled={isSubmitting}
        />

        <CustomInput
          required
          name="email"
          type="email"
          label={t("email.label")}
          placeholder={t("email.placeholder")}
          Icon={<Mail size={16} />}
          disabled={isSubmitting}
        />
      </div>

      {/* Message */}
      <CustomTextarea
        required
        name="message"
        label={t("message.label")}
        placeholder={t("message.placeholder")}
        rows={6}
        disabled={isSubmitting}
      />

      {/* reCAPTCHA */}
      <div className="flex gap-2 text-sm font-medium text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          {t("recaptcha.text")}{" "}
          <Link
            href="/privacy-policy"
            className="underline text-success hover:text-foreground"
          >
            {t("recaptcha.privacy")}
          </Link>{" "}
          {t("recaptcha.and")}{" "}
          <Link
            href="/terms-and-conditions"
            className="underline text-success hover:text-foreground"
          >
            {t("recaptcha.terms")}
          </Link>{" "}
          {t("recaptcha.apply")}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("submit.submitting") : t("submit.default")}
      </Button>
    </CustomForm>
  );
}
