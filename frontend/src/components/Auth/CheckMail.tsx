"use client";

import { Button } from "@/components/ui/button";
import { useResendVerificationEmailMutation } from "@/redux/api/userApi";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthContainer from "./AuthContainer";

export default function CheckMail() {
  const t = useTranslations("Auth.CheckMail");
  const params = useSearchParams();
  const email = params.get("email");
  const [resend, { isLoading }] = useResendVerificationEmailMutation();

  const handleRedirect = () => {
    const gmailSearchUrl =
      `https://mail.google.com/mail/u/0/#inbox`;
    window.open(gmailSearchUrl, "_blank");
  };

  const resendVerificationMail = async () => {
    if (email) {
      const toastId = toast.loading(t("toast.resending"));
      try {
        const result = await resend({ email }).unwrap();
        toast.success(result?.message || t("toast.success"), { id: toastId });
      } catch (error: any) {
        toast.error(error?.data?.message || t("toast.error"), { id: toastId });
      }
    } else {
      toast.error(t("errors.noEmail"));
    }
  };

  return (
    <AuthContainer
      title={t("title")}
      subtitle={t("subtitle", { email: email ?? "" })}
    >
      <div className="mt-6 w-full">
        <Button
          onClick={handleRedirect}
          size="lg"
          className="flex items-center justify-center gap-2 w-full">
          <Mail className="w-5 h-5" /> {t("openGmail")}
        </Button>
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-foreground/80">
          {t("didntReceive")}{" "}
          <Button
            disabled={isLoading}
            onClick={resendVerificationMail}
            variant="link"
            className="px-0 text-sm">
            {t("resendLink")}
          </Button>
        </p>
      </div>
    </AuthContainer>
  );
}
