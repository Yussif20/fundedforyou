"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useGoogleLoginMutation, useSignUpMutation } from "@/redux/api/userApi";
import { setUser } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import { GoogleLogin } from "@react-oauth/google";
import cookie from "js-cookie";
import { Eye, EyeClosed, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import AuthContainer from "./AuthContainer";

const defaultValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUp() {
  const t = useTranslations("Auth.SignUp");
  const [signUp, { isLoading }] = useSignUpMutation();
  const [googleLoginMutation] = useGoogleLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [consentToMarketing, setConsentToMarketing] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    const toastId = toast.loading(t("toast.loading"));
    try {
      const result = await googleLoginMutation(
        credentialResponse.credential,
      ).unwrap();
      if (result?.data) {
        cookie.set("accessToken", result.data.accessToken);
        cookie.set("refreshToken", result.data.refreshToken);
        dispatch(
          setUser({ user: result.data.user, token: result.data.accessToken }),
        );
        router.push(result.data.user.hasTakenSurvey ? "/forex" : "/onboarding");
        toast.success(t("toast.success"), { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("toast.googleError"), {
        id: toastId,
      });
    }
  };

  const handleSubmit = async (data: FieldValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error(t("errors.passwordMismatch"));
      return;
    }

    if (!agreeToTerms) {
      toast.error(t("errors.agreeTerms"));
      return;
    }

    const formData = {
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      isAggradedToTermsAndPolicies: agreeToTerms,
    };

    const toastId = toast.loading(t("toast.loading"));
    try {
      await signUp(formData).unwrap();
      toast.success(t("toast.success"), { id: toastId });
      router.push(`/auth/check-email?email=${data.email}`);
    } catch (error: any) {
      toast.error(error?.data?.message || t("toast.error"), { id: toastId });
    }
  };

  return (
    <AuthContainer className="max-w-2xl" title={t("title")}>
      <CustomForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        className="space-y-6"
      >
        <div className="space-y-5">
          <CustomInput
            required
            name="fullName"
            type="text"
            label={t("fields.fullName.label")}
            Icon={<User size={16} />}
            disabled={isLoading}
          />

          <CustomInput
            required
            name="email"
            type="email"
            label={t("fields.email.label")}
            Icon={<Mail size={16} />}
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              required
              name="password"
              type={showPassword ? "text" : "password"}
              label={t("fields.password.label")}
              RightIcon={
                showPassword ? <Eye size={16} /> : <EyeClosed size={16} />
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            />
            <CustomInput
              required
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label={t("fields.confirmPassword.label")}
              RightIcon={
                showConfirmPassword ? (
                  <Eye size={16} />
                ) : (
                  <EyeClosed size={16} />
                )
              }
              onRightIconClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
            />
            <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground">
              {t("checkboxes.agreeTerms1")}{" "}
              <Link
                href="/terms-and-conditions"
                className="text-primary hover:underline font-semibold"
              >
                {t("checkboxes.terms")}
              </Link>{" "}
              {t("checkboxes.and")}{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline font-semibold"
              >
                {t("checkboxes.privacy")}
              </Link>
              .
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="marketing"
              checked={consentToMarketing}
              onChange={(e) => setConsentToMarketing(e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
            />
            <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground">
              {t("checkboxes.marketing")}
            </span>
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl h-11 font-semibold bg-primary hover:bg-primary-dark transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99]"
          disabled={isLoading}
        >
          {isLoading ? t("submit.loading") : t("submit.default")}
        </Button>

        {/* Google Sign Up */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-card px-3 text-muted-foreground font-medium">
              {t("orContinueWith")}
            </span>
          </div>
        </div>
        <div className="flex justify-center w-full [&>div]:w-full [&>div]:flex [&>div]:justify-center">
          <div className="w-full transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error(t("toast.googleError"))}
              theme="outline"
              shape="pill"
              size="large"
              text="signup_with"
            />
          </div>
        </div>

        <div className="text-center pt-6">
          <p className="text-sm font-medium text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary font-semibold hover:underline"
            >
              {t("signInLink")}
            </Link>
          </p>
        </div>
      </CustomForm>
    </AuthContainer>
  );
}
