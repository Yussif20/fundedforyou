"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useGoogleLoginMutation, useLoginMutation } from "@/redux/api/userApi";
import { GoogleLogin } from "@react-oauth/google";
import { setUser } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import cookie from "js-cookie";
import { Eye, EyeClosed, LockKeyhole, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import AuthContainer from "./AuthContainer";

const defaultValues = {
  email: "",
  password: "",
};

export default function SignIn() {
  const t = useTranslations("Auth.SignIn");
  const [login, { isLoading }] = useLoginMutation();
  const [googleLoginMutation] = useGoogleLoginMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

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
    const { email, password } = data;
    if (!email || !password) return;

    const toastId = toast.loading(t("toast.loading"));
    try {
      const result = await login({ email, password }).unwrap();
      if (result?.data) {
        cookie.set("accessToken", result.data.accessToken);
        cookie.set("refreshToken", result.data.refreshToken);
        dispatch(
          setUser({ user: result.data.user, token: result.data.accessToken }),
        );
        router.push(result.data.user.hasTakenSurvey ? "/forex" : "/onboarding");
        toast.success(t("toast.success"), { id: toastId });
      } else {
        router.push(`/auth/check-email?email=${email}`);
        toast.warning(t("toast.verifyEmail"), { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("toast.error"), { id: toastId });
    }
  };

  return (
    <AuthContainer title={t("title")} subtitle={t("subtitle")}>
      <CustomForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        className="space-y-5"
      >
        {/* Email Field */}
        <CustomInput
          required
          name="email"
          type="email"
          label={t("email.label")}
          placeholder={t("email.placeholder")}
          Icon={<Mail size={16} />}
          disabled={isLoading}
        />
        {/* Password Field */}
        <CustomInput
          required
          name="password"
          type={showPassword ? "text" : "password"}
          label={t("password.label")}
          placeholder={t("password.placeholder")}
          Icon={<LockKeyhole size={16} />}
          RightIcon={showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          disabled={isLoading}
        />
        {/* Forgot Password */}
        <div className="flex items-center justify-end -mt-1">
          <Link
            href="/auth/forget-password"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full rounded-xl h-11 font-semibold bg-primary hover:bg-primary-dark transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99]"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? t("submit.loading") : t("submit.default")}
        </Button>
      </CustomForm>
      {/* Google Sign In */}
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
            text="signin_with"
          />
        </div>
      </div>
      {/* Sign Up Link */}
      <div className="text-center pt-6">
        <p className="text-sm font-medium text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/auth/sign-up"
            className="text-primary font-semibold hover:underline"
          >
            {t("signUpLink")}
          </Link>
        </p>
      </div>
    </AuthContainer>
  );
}
