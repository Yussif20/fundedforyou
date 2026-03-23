"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useLocale } from "next-intl";

export default function GoogleProviderWrapper({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  // Google Identity Services uses BCP 47 / ISO 639 locale (e.g. "en", "ar") so the button text matches site language
  const googleLocale = locale === "ar" ? "ar" : "en";

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!} locale={googleLocale}>
      {children}
    </GoogleOAuthProvider>
  );
}
