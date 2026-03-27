import FDTabs from "@/components/FirmDetails/FDTabs";
import FirmDetails from "@/components/FirmDetails/FirmDetails";
import FirmOfferStickyBar from "@/components/FirmDetails/FirmOfferStickyBar";
import FirmNavigate from "@/components/Forex_Features/Firms/FirmNavigate";
import ScrollToTopOnOpen from "@/components/FirmDetails/ScrollToTopOnOpen";
import FirmOfferBanner from "@/components/FirmDetails/FirmOfferBanner";
import { serverApi } from "@/lib/serverAxios";
import "@/styles/globals.css";
import { SinglePropFirm } from "@/types/firm.types";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}>;

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const isArabic = locale === "ar";

  try {
    const { data } = await serverApi.get<{ data: SinglePropFirm }>(
      `/firms/${slug}?header=true`
    );
    const firm = data.data;
    const title = firm.title;
    const description = isArabic
      ? `قارن تحديات وعروض ${title} — حسابات ممولة، فروقات الأسعار والمزيد على Funded For You`
      : `Compare ${title} challenges, offers, spreads & rules — Funded For You`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: firm.logoUrl ? [{ url: firm.logoUrl }] : ["/og.png"],
      },
    };
  } catch {
    return { title: "Firm Details" };
  }
}

export const revalidate = 5;
export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let data: { data: SinglePropFirm };
  try {
    const res = await serverApi.get<{ data: SinglePropFirm }>(
      `/firms/${slug}?header=true`,
      {
        headers: {
          ...(accessToken && {
            Authorization: `${accessToken}`,
            "x-client-type": "MOBILE",
          }),
        },
      }
    );
    data = res.data;
  } catch {
    notFound();
  }
  return (
    <div className="overflow-x-clip">
      <ScrollToTopOnOpen />
      <FirmNavigate firmType={data.data.firmType} />
      <div className="space-y-12 relative">
        <FirmDetails data={data.data} />

        <div className="hidden lg:block lg:sticky lg:top-(--navbar-height,5.5rem) bg-background z-30">
          <FirmOfferBanner data={data.data} />
        </div>
        <FDTabs slug={slug} count={data?.data?.count} />
        <FirmOfferStickyBar firm={data.data} />
        <div>{children}</div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
