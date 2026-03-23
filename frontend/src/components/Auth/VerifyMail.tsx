"use client";

import { useVerifyEmailMutation } from "@/redux/api/userApi";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import AuthContainer from "./AuthContainer";
import { Link } from "@/i18n/navigation";

export default function VerifyMail() {
  const t = useTranslations("Auth.VerifyMail");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verify, { isLoading }] = useVerifyEmailMutation();
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatusMessage(t("errors.noToken"));
      setError(true);
      return;
    }

    const verifyEmail = async () => {
      try {
        await verify({ token }).unwrap();
        toast.success(t("toast.success"));
        router.push("/forex");
      } catch {
        setStatusMessage(t("errors.verificationFailed"));
        setError(true);
      }
    };

    verifyEmail();
  }, [token, verify, router, t]);

  return (
    <AuthContainer title={t("title")} subtitle={statusMessage && statusMessage}>
      {isLoading && (
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              {t("verifying")}
            </span>
          </div>
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        </div>
      )}

      {error && (
        <Link className="block w-full" href="/">
          <Button className="mt-6 w-full">{t("goHome")}</Button>
        </Link>
      )}
    </AuthContainer>
  );
}
