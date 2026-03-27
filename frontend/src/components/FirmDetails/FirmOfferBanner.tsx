"use client";

import GiftBox from "@/components/Global/Icons/GiftBox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import useIsArabic from "@/hooks/useIsArabic";
import useIsFutures from "@/hooks/useIsFutures";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { UserRole } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FirmWithOffers, Offer } from "@/redux/api/offerApi";
import { Link } from "@/i18n/navigation";
import { visibleText } from "@/utils/visibleText";
import { OfferCard } from "@/components/Forex_Features/Offers/SingleOffer";

const BANNER_BADGE_KEYWORDS = ["off", "خصم", "استرداد", "Reward"];

/** Banner-specific percentage badge */
function BannerPercentageBadge({
  percentage,
  showGift,
  giftText,
  giftTextArabic,
  isArabic,
  className,
  discountType,
  discountText,
  discountTextArabic,
}: {
  percentage: number;
  showGift?: boolean;
  giftText?: string | null;
  giftTextArabic?: string | null;
  isArabic: boolean;
  className?: string;
  discountType?: "PERCENTAGE" | "TEXT" | string;
  discountText?: string;
  discountTextArabic?: string;
}) {
  const gift = visibleText(isArabic, giftText ?? undefined, giftTextArabic ?? undefined);
  const hasGift = showGift && !!gift;
  const isText = discountType === "TEXT";
  const customText = isText ? visibleText(isArabic, discountText, discountTextArabic) : "";

  if (isText && !customText) return null;
  if (!isText && percentage === 0) return null;

  return (
    <div
      className={cn(
        "group/badge relative flex flex-col items-center justify-center overflow-hidden",
        "rounded-2xl w-[130px] min-w-0 h-[110px] lg:min-w-[90px] lg:w-[90px] lg:h-[90px]",
        "bg-gradient-to-br from-background/80 via-background/60 to-background/40",
        "backdrop-blur-2xl",
        "border border-white/[0.25]",
        "discount-led-border",
        "transition-all duration-300",
        "hover:border-white/[0.35] hover:scale-[1.04]",
        className
      )}
    >
      {/* Inner ring */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.12] rounded-2xl" />
      {/* Top highlight strip */}
      <div className="absolute top-0 inset-x-0 pointer-events-none bg-gradient-to-b from-white/[0.18] to-transparent h-10 rounded-t-2xl" />

      {/* Content */}
      {isText ? (
        (() => {
          const offMatch = customText?.match(new RegExp(`^(.*?)\\s*(${BANNER_BADGE_KEYWORDS.join("|")})\\s*$`, "i"));
          const mainText = offMatch?.[1]?.trim() ?? "";
          const mainLen = mainText.length;
          return offMatch ? (
            <>
              <span
                className={cn(
                  "relative font-extrabold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
                  hasGift
                    ? (mainLen > 6 ? "text-base sm:text-lg" : mainLen > 3 ? "text-lg sm:text-xl" : "text-xl sm:text-2xl")
                    : mainLen > 6
                      ? "text-lg sm:text-xl"
                      : mainLen > 3
                        ? "text-xl sm:text-2xl"
                        : "text-2xl sm:text-3xl"
                )}
              >
                {offMatch[1].trim()}
              </span>
              <span
                className={cn(
                  "relative font-semibold uppercase tracking-widest text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
                  hasGift ? "text-[10px]" : "text-[11px] mt-0.5"
                )}
              >
                {offMatch[2]}
              </span>
            </>
          ) : (
            <span className="relative font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] text-center leading-tight px-2 text-base sm:text-lg">
              {customText}
            </span>
          );
        })()
      ) : (
        <>
          <span
            className={cn(
              "relative font-extrabold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
              hasGift ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
            )}
          >
            {percentage}%
          </span>
          <span
            className={cn(
              "relative font-semibold uppercase tracking-widest text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
              hasGift ? "text-[10px]" : "text-[11px] mt-0.5"
            )}
          >
            OFF
          </span>
        </>
      )}

      {/* Gift line */}
      {showGift && gift && (
        <div className="relative font-medium text-center text-white/90 backdrop-blur-sm rounded-md mt-1 px-2 py-0.5 bg-primary/[0.10] text-[8px]">
          <GiftBox size={11} className="inline-block align-middle text-success" />{" "}
          {gift}
        </div>
      )}
    </div>
  );
}

/** Banner-specific company header */
function BannerCompanyHeader({
  companyData,
  badge,
}: {
  companyData: { title: string; logoUrl: string; slug: string };
  badge?: React.ReactNode;
}) {
  const isFutures = useIsFutures();
  return (
    <div className="shrink-0 lg:w-1/3 lg:pr-6 lg:border-r lg:border-border flex flex-col lg:flex-row lg:self-stretch">
      <div className="w-full lg:w-[17.25rem] shrink-0 flex items-center justify-center lg:justify-start">
        <Link
          href={`${isFutures ? "/futures/" : "/"}firms/${companyData.slug}`}
          className="flex items-center gap-3 w-fit rounded-lg p-2 -m-2 hover:bg-muted/50 transition-colors"
        >
          <div className="rounded-lg overflow-hidden border border-border bg-card shrink-0">
            <div className="w-10 sm:w-12 xl:w-14 aspect-square relative">
              <Image
                src={companyData.logoUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-sm md:text-base xl:text-lg font-semibold text-foreground flex flex-wrap items-center gap-1">
              {companyData.title}
            </h2>
          </div>
        </Link>
      </div>
      {badge && (
        <div className="flex w-1/2 lg:w-auto mx-auto lg:mx-0 flex-1 items-center justify-center mt-4 lg:mt-0">
          {badge}
        </div>
      )}
    </div>
  );
}

export default function FirmOfferBanner({ data }: { data: FirmWithOffers }) {
  const offer = data?.offers ?? [];
  const companyData = {
    id: data.id,
    title: data.title,
    logoUrl: data.logoUrl,
    slug: data.slug,
    affiliateLink: data.affiliateLink,
  };
  const t = useTranslations("Offers");
  const isArabic = useIsArabic();
  const offerFirstData = offer[0];
  const offersOtherData = offer?.slice(1) as Offer[];
  const currUser = useAppSelector((state) => state.auth.user);
  const isAdmin = currUser ? currUser.role !== UserRole.USER : false;

  if (!offerFirstData) return null;

  return (
    <Card className="border border-border rounded-xl p-4 sm:p-5 lg:px-6 lg:py-2 bg-card flex flex-col gap-4 lg:gap-6 justify-center lg:justify-center relative overflow-hidden h-[385px] lg:h-auto">
      <div className="flex flex-col lg:flex-row lg:gap-6 w-full">
        <BannerCompanyHeader
          companyData={companyData}
          badge={
            <BannerPercentageBadge
              percentage={
                offerFirstData.timerOfferPercentage ??
                offerFirstData.offerPercentage
              }
              showGift={offerFirstData.showGift}
              giftText={offerFirstData.giftText}
              giftTextArabic={offerFirstData.giftTextArabic}
              isArabic={isArabic}
              discountType={
                offerFirstData.timerDiscountType ??
                offerFirstData.discountType
              }
              discountText={
                offerFirstData.timerDiscountText ??
                offerFirstData.discountText
              }
              discountTextArabic={
                offerFirstData.timerDiscountTextArabic ??
                offerFirstData.discountTextArabic
              }
            />
          }
        />
        <div className="flex-1 min-w-0 mt-4 lg:mt-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <OfferCard
                companyData={companyData}
                offer={offerFirstData}
                showTag
                showingNumber={offersOtherData?.length}
                t={t}
                isAdmin={isAdmin}
                hideCompany
                hideBadge
              />
              <AccordionContent>
                <div className="flex flex-col gap-4 lg:gap-6 pt-2">
                  {offersOtherData?.map((item, idx) => (
                    <OfferCard
                      key={idx}
                      offer={item}
                      companyData={companyData}
                      t={t}
                      isAdmin={isAdmin}
                      hideCompany
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Card>
  );
}
