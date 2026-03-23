import SetTheme from "@/components/Global/SetTheme";
import { ThemeProvider } from "@/components/Global/them-provider";
import TopGradient from "@/components/Global/TopGradient";
import JsonLd, {
  organizationJsonLd,
  websiteJsonLd,
} from "@/components/SEO/JsonLd";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { Cairo, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";

const BASE_URL = "https://fundedforyou.com";

const cairo = Cairo({
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin", "arabic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const enKeywords = [
  "prop firms",
  "funded accounts",
  "forex",
  "futures",
  "crypto",
  "trading",
  "prop firm challenge",
  "funded trading",
  "risk management",
  "consistency rule",
  "instant funding",
  "MT5",
  "MT4",
  "TradingView",
  "copy trade",
  "day trade",
  "CFD",
  "prop trading firms",
  "compare prop firms",
  "best prop firms",
  "funded account comparison",
  "trading challenges",
  "prop firm spreads",
  "FTMO",
  "Funded Next",
  "E8 Funding",
  "TopStep",
  "Apex Trader Funding",
  "The Funded Trader",
  "My Funded FX",
  "True Forex Funds",
];

const arKeywords = [
  "حساب ممول",
  "شركات ممولة",
  "تداول",
  "فوركس",
  "العملات الرقمية",
  "التداول بالعربية",
  "حسابات ممولة",
  "شركات البروب فيرم",
  "إدارة رأس المال",
  "تحديات ممولة",
  "إدارة مخاطر",
  "شركات التداول الممولة",
  "تحدي التداول",
  "مقارنة شركات التداول",
  "أفضل شركات التداول الممولة",
  "فروقات الأسعار",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "Funded For You — قارن شركات التداول الممولة والتحديات والفروقات"
    : "Funded For You — Compare Prop Trading Firms, Challenges & Spreads";

  const description = isArabic
    ? "قارن بين أفضل شركات التداول الممولة (بروب فيرم) من حيث التحديات، الفروقات، الأسعار والعروض الحصرية. اعثر على الحساب الممول المثالي للفوركس والعقود الآجلة."
    : "Compare the best prop trading firms by challenges, spreads, pricing & exclusive offers. Find your ideal funded account for Forex and Futures trading.";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: "%s | Funded For You",
      default: title,
    },
    description,
    keywords: [...enKeywords, ...arKeywords],
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: "Funded For You",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Funded For You" }],
      locale: isArabic ? "ar_SA" : "en_US",
      alternateLocale: isArabic ? "en_US" : "ar_SA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        ar: `${BASE_URL}/ar`,
      },
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className={`${cairo.variable} ${spaceGrotesk.variable} relative`}>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <TopGradient className="absolute top-0 left-0 w-full flex justify-center items-center z-10" />
        <ThemeProvider>
          <Providers>
            {/* Provide locale and messages */}
            <NextIntlClientProvider locale={locale} messages={messages}>
              <NextTopLoader color="var(--primary)" />
              {children}
            </NextIntlClientProvider>
            <SetTheme />
          </Providers>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-76FY8LG50Y" />
      <Script id="ga-second-id" strategy="afterInteractive">
        {`gtag('config', 'G-K2HX57Q0WY');`}
      </Script>
    </html>
  );
}
