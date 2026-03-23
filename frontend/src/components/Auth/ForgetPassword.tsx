"use client";

import { FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Title from "../Global/Title";
import Subtitle from "../Global/Subtitle";
import { useRouter } from "@/i18n/navigation";
import { useForgetPasswordMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ForgetPassword() {
  const t = useTranslations("Auth.ForgetPassword");
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    if (!email) return;

    const toastId = toast.loading(t("toast.sending"));

    try {
      const result = await forgetPassword({ email }).unwrap();

      form.reset();

      if (result?.success) {
        router.push(`/auth/check-email?email=${email}`);
        toast.success(t("toast.success"), { id: toastId });
      } else {
        toast.error(result?.message || t("toast.error"), { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("toast.error"), { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="pl-10 md:h-11"
              placeholder={t("fields.emailPlaceholder")}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? t("submit.sending") : t("submit.default")}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {t("backToSignIn")}{" "}
          <Link href="/auth/sign-in">
            <Button
              variant="link"
              className="px-0 text-sm"
              disabled={isLoading}
            >
              {t("signInLink")}
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
