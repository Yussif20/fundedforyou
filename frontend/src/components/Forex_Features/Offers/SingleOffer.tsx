"use client";

import GiftBox from "@/components/Global/Icons/GiftBox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import useIsArabic from "@/hooks/useIsArabic";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { UserRole } from "@/types";
import { Check, ChevronDown, Copy, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import DeleteOfferModal from "./DeleteOfferModal";
import EditOfferModal from "./EditOfferModal";
import { FirmWithOffers, Offer } from "@/redux/api/offerApi";
import OfferIndexChange from "./OfferIndexChange";
import { Link } from "@/i18n/navigation";
import useIsFutures from "@/hooks/useIsFutures";
import DiscountText from "@/components/Global/DiscountText";
import { visibleText } from "@/utils/visibleText";
import { Separator } from "@/components/ui/separator";
import CountdownTimer from "./CountdownTimer";
import dynamic from "next/dynamic";

const OfferCoinClient = dynamic(() => import("./OfferCoinClient"), { ssr: false });

const OFFER_BADGE_KEYWORDS = ["off", "خصم", "استرداد", "Reward"];

/** Styled offer description with line-clamp and full-text tooltip */
function OfferDescription({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-start px-3 py-2 rounded-lg border-l-2 border-primary/60 bg-primary/5 cursor-default",
              className
            )}
          >
            <p className="text-sm md:text-base font-semibold text-foreground line-clamp-2 leading-relaxed">
              {text}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-72 text-sm leading-relaxed whitespace-normal"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Prominent percentage badge — two variants:
 *  "default" → large solid primary badge (used for the main total-sale in the left half)
 *  "subtle"  → smaller outlined badge (used for sub-offer badges in the right half)
 */
function OfferPercentageBadge({
  percentage,
  showGift,
  giftText,
  giftTextArabic,
  isArabic,
  variant = "default",
  className,
  discountType,
  discountText,
  discountTextArabic,
  glowIndex = 0,
  glowTotal = 1,
}: {
  percentage: number;
  showGift?: boolean;
  giftText?: string | null;
  giftTextArabic?: string | null;
  isArabic: boolean;
  variant?: "default" | "subtle";
  className?: string;
  discountType?: "PERCENTAGE" | "TEXT" | string;
  discountText?: string;
  discountTextArabic?: string;
  glowIndex?: number;
  glowTotal?: number;
}) {
  const gift = visibleText(isArabic, giftText ?? undefined, giftTextArabic ?? undefined);
  const isText = discountType === "TEXT";
  const customText = isText ? visibleText(isArabic, discountText, discountTextArabic) : "";

  // Hide if empty
  if (isText && !customText) return null;
  if (!isText && percentage === 0) return null;

  const isSubtle = variant === "subtle";

  return (
    <div
      className={cn(
        // Shape & layout
        "group/badge relative flex flex-col items-center justify-center overflow-hidden",
        isSubtle
          ? "rounded-xl w-[76px] min-w-[76px] py-3"
          : "rounded-2xl w-full min-w-0 py-5 sm:py-6 lg:min-w-[110px] lg:w-[110px] lg:h-[110px]",
        // Glassy white background
        "bg-gradient-to-br from-white/[0.22] via-white/[0.15] to-white/[0.10]",
        "backdrop-blur-2xl",
        // Border
        "border border-white/[0.25]",
        // Glow animation
        !isSubtle && "animate-discount-glow",
        // Hover lift
        "transition-all duration-300",
        "hover:border-white/[0.35] hover:scale-[1.04]",
        className
      )}
      style={!isSubtle ? { "--glow-delay": `${glowIndex * 0.5}s`, "--glow-duration": `${glowTotal * 0.5 + 1.5}s` } as React.CSSProperties : undefined}
    >
      {/* Inner ring — glass edge */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.12]",
          isSubtle ? "rounded-xl" : "rounded-2xl"
        )}
      />
      {/* Top highlight strip (glass reflection) */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 pointer-events-none bg-gradient-to-b from-white/[0.18] to-transparent",
          isSubtle ? "h-6 rounded-t-xl" : "h-10 rounded-t-2xl"
        )}
      />

      {/* Content */}
      {isText ? (
        (() => {
          const offMatch = customText?.match(new RegExp(`^(.*?)\\s*(${OFFER_BADGE_KEYWORDS.join("|")})\\s*$`, "i"));
          const mainText = offMatch?.[1]?.trim() ?? "";
          const mainLen = mainText.length;
          return offMatch ? (
            <>
              <span
                className={cn(
                  "relative font-extrabold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
                  isSubtle
                    ? "text-lg leading-tight"
                    : mainLen > 6
                      ? "text-xl sm:text-2xl"
                      : mainLen > 3
                        ? "text-2xl sm:text-3xl"
                        : "text-3xl sm:text-4xl"
                )}
              >
                {offMatch[1].trim()}
              </span>
              <span
                className={cn(
                  "relative font-semibold uppercase tracking-widest text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
                  isSubtle ? "text-[9px]" : "text-[11px] mt-0.5"
                )}
              >
                {offMatch[2]}
              </span>
            </>
          ) : (
            <span
              className={cn(
                "relative font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] text-center leading-tight px-2",
                isSubtle ? "text-xs" : "text-base sm:text-lg"
              )}
            >
              {customText}
            </span>
          );
        })()
      ) : (
        <>
          <span
            className={cn(
              "relative font-extrabold tabular-nums text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
              isSubtle ? "text-lg leading-tight" : "text-3xl sm:text-4xl"
            )}
          >
            {percentage}%
          </span>
          <span
            className={cn(
              "relative font-semibold uppercase tracking-widest text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
              isSubtle ? "text-[9px]" : "text-[11px] mt-0.5"
            )}
          >
            OFF
          </span>
        </>
      )}

      {/* Gift line */}
      {showGift && gift && (
        <div
          className={cn(
            "relative font-medium text-center text-white/90 backdrop-blur-sm rounded-md",
            isSubtle
              ? "mt-1.5 px-1.5 py-0.5 bg-primary/[0.08] text-[9px] leading-tight"
              : "mt-2.5 px-2.5 py-1 bg-primary/[0.10] text-[10px]"
          )}
        >
          <GiftBox size={isSubtle ? 8 : 11} className="inline-block align-middle text-success" />{" "}
          {gift}
        </div>
      )}
    </div>
  );
}

function CompanyHeader({
  companyData,
  isTopOffer,
  offer,
  badge,
}: {
  companyData: { title: string; logoUrl: string; slug: string };
  isTopOffer?: boolean;
  offer: Offer;
  badge?: React.ReactNode;
}) {
  const isFutures = useIsFutures();
  return (
    <div className="shrink-0 lg:w-1/2 lg:pr-6 lg:border-r lg:border-border flex flex-col lg:flex-row lg:self-stretch">
      {/* Company logo + name — centered on small screens, left-aligned on desktop */}
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
              {isTopOffer && (
                <span className="items-center gap-1 md:flex hidden text-primary">
                  (
                  <DiscountText
                    className="text-primary"
                    mainClassName="px-0! py-0"
                    percentage={offer.timerOfferPercentage ?? offer.offerPercentage}
                    discountType={offer.timerDiscountType ?? offer.discountType}
                    discountText={offer.timerDiscountText ?? offer.discountText}
                    discountTextArabic={offer.timerDiscountTextArabic ?? offer.discountTextArabic}
                  />
                  )
                </span>
              )}
            </h2>
          </div>
        </Link>
      </div>
      {/* Total sale badge — half width centered on small screens, right of divider on desktop */}
      {badge && (
        <div className="flex w-1/2 lg:w-auto mx-auto lg:mx-0 flex-1 items-center justify-center mt-4 lg:mt-0">
          {badge}
        </div>
      )}
    </div>
  );
}

export default function SingleOffer(props: {
  onlyShowMatch?: boolean;
  hideBlackHoles?: boolean;
  isTopOffer?: boolean;
  data: FirmWithOffers;
  index?: number;
  totalCount?: number;
  prevFirm?: FirmWithOffers;
  nextFirm?: FirmWithOffers;
}) {
  const { onlyShowMatch, hideBlackHoles, isTopOffer, data } = props;
  const glowIndex = props.index ?? 0;
  const glowTotal = props.totalCount ?? 1;
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
    <Card
      className={cn(
        "border border-border rounded-xl p-4 sm:p-5 lg:p-6 bg-card flex flex-col gap-4 lg:gap-6 justify-center lg:justify-center relative overflow-hidden h-[385px] lg:h-[210px]",
        onlyShowMatch && "border-none rounded-none bg-background px-0!"
      )}
    >
      {/* EXCLUSIVE ribbon for top offers */}
      {isTopOffer && !onlyShowMatch && (
        <>
          <div className="absolute top-4 right-[-28px] rotate-45 bg-primary text-white text-[10px] font-bold px-8 py-0.5 uppercase tracking-widest z-20 shadow-sm">
            Exclusive
          </div>
          <OfferCoinClient />
        </>
      )}
      {!hideBlackHoles && (
        <div
          className={cn(
            "absolute border-r-2 top-0 min-h-full border-foreground/20 border-dashed left-75 hidden lg:block w-0",
            isArabic && "right-75"
          )}
        >
          <div className="absolute -top-6 w-9 h-12 rounded-full bg-background -left-4"></div>
          <div className="absolute -bottom-6 w-9 h-12 rounded-full bg-background -left-4"></div>
        </div>
      )}
      {/* Admin reorder controls */}
      {isAdmin && (
        <div className="flex gap-2 items-center">
          <OfferIndexChange
            firm={data}
            prevFirm={props.prevFirm}
            nextFirm={props.nextFirm}
          />
        </div>
      )}
      {/* Left: company once. Right: all offers (no repeated company) */}
      {!onlyShowMatch ? (
        <div className="flex flex-col lg:flex-row lg:gap-6 w-full">
          <CompanyHeader
            companyData={companyData}
            isTopOffer={isTopOffer}
            offer={offerFirstData}
            badge={
              <OfferPercentageBadge
                percentage={offerFirstData.timerOfferPercentage ?? offerFirstData.offerPercentage}
                showGift={offerFirstData.showGift}
                giftText={offerFirstData.giftText}
                giftTextArabic={offerFirstData.giftTextArabic}
                isArabic={isArabic}
                discountType={offerFirstData.timerDiscountType ?? offerFirstData.discountType}
                discountText={offerFirstData.timerDiscountText ?? offerFirstData.discountText}
                discountTextArabic={offerFirstData.timerDiscountTextArabic ?? offerFirstData.discountTextArabic}
                glowIndex={glowIndex}
                glowTotal={glowTotal}
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
                  onlyShowMatch={onlyShowMatch}
                  isAdmin={isAdmin}
                  isTopOffer={isTopOffer}
                  hideCompany
                  hideBadge
                  glowIndex={glowIndex}
                  glowTotal={glowTotal}
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
                        isTopOffer={isTopOffer}
                        hideCompany
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="">
            <OfferCard
              companyData={companyData}
              offer={offerFirstData}
              showTag
              showingNumber={offersOtherData?.length}
              t={t}
              onlyShowMatch={onlyShowMatch}
              isAdmin={isAdmin}
              isTopOffer={isTopOffer}
              glowIndex={glowIndex}
              glowTotal={glowTotal}
            />
            <AccordionContent>
              <div className="flex flex-col gap-4 lg:gap-6 mt-4 lg:mt-6">
                {offersOtherData?.map((item, idx) => (
                  <OfferCard
                    key={idx}
                    offer={item}
                    companyData={companyData}
                    t={t}
                    isAdmin={isAdmin}
                    isTopOffer={isTopOffer}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}

const OfferCard = ({
  offer,
  companyData,
  isTopOffer,
  showTag = false,
  showingNumber = 1,
  t,
  onlyShowMatch,
  isAdmin,
  hideCompany = false,
  hideBadge = false,
  glowIndex = 0,
  glowTotal = 1,
}: {
  isTopOffer?: boolean;
  offer: Offer;
  companyData: {
    id: string;
    title: string;
    logoUrl: string;
    slug: string;
    affiliateLink: string;
  };
  showTag?: boolean;
  showingNumber?: number;
  t: any;
  onlyShowMatch?: boolean;
  isAdmin?: boolean;
  glowIndex?: number;
  glowTotal?: number;
  hideCompany?: boolean;
  hideBadge?: boolean;
}) => {
  const isArabic = useIsArabic();
  const isFutures = useIsFutures();
  const codeBorderCls = isFutures ? "border-yellow-400 hover:bg-yellow-400/10" : "border-green-400 hover:bg-green-400/10";
  const codeLabelCls = isFutures ? "text-yellow-500" : "text-green-500";
  const copyIconHoverCls = isFutures ? "hover:text-yellow-500" : "hover:text-green-500";
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    successMessage: t("codeCopied") || "Code copied to clipboard!",
    errorMessage: t("copyFailed") || "Failed to copy code",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Use timer override fields when active, fall back to normal fields
  const displayCode = offer.timerCode ?? offer.code;
  const displayPercentage = offer.timerOfferPercentage ?? offer.offerPercentage;
  const displayDiscountType = offer.timerDiscountType ?? offer.discountType;
  const displayDiscountText = offer.timerDiscountText ?? offer.discountText;
  const displayDiscountTextArabic = offer.timerDiscountTextArabic ?? offer.discountTextArabic;
  const displayText = offer.timerText ?? offer.text;
  const displayTextArabic = offer.timerTextArabic ?? offer.textArabic;

  const endTime = offer.endDate && (
    <CountdownTimer endDate={offer.endDate} startDate={offer.createdAt} />
  );
  const percentageBadge = (
    <OfferPercentageBadge
      percentage={displayPercentage}
      showGift={offer.showGift}
      giftText={offer.giftText}
      giftTextArabic={offer.giftTextArabic}
      isArabic={isArabic}
      variant={hideCompany ? "subtle" : "default"}
      discountType={displayDiscountType}
      discountText={displayDiscountText}
      discountTextArabic={displayDiscountTextArabic}
    />
  );
  const showPercantCard = displayDiscountType === "TEXT"
    ? !!visibleText(isArabic, displayDiscountText, displayDiscountTextArabic)
    : displayPercentage !== 0;
  const percantCard = showPercantCard ? (
    <Card
      className="discount-sweep-trigger animate-discount-glow relative py-6 lg:py-10 lg:h-25 w-full lg:w-auto lg:aspect-5/2 flex flex-col justify-center items-center gap-y-2 lg:gap-y-4 rounded-2xl overflow-hidden bg-gradient-to-br from-white/[0.22] via-white/[0.15] to-white/[0.10] backdrop-blur-2xl border border-white/[0.25] hover:border-white/[0.35] transition-all duration-300 group hover:scale-[1.03]"
      style={{ "--glow-delay": `${glowIndex * 0.5}s`, "--glow-duration": `${glowTotal * 0.5 + 1.5}s` } as React.CSSProperties}
    >
      {/* Top glass reflection strip */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-white/[0.18] to-transparent rounded-t-2xl pointer-events-none" />
      {/* Inner glass ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.12] pointer-events-none" />
      {/* Hover shimmer sweep */}
      <div className="discount-sweep-bar absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" style={{ transform: "translateX(-100%)" }} />

      <h1 className="relative text-4xl md:text-5xl font-bold uppercase py-0 leading-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <DiscountText
          className="text-white"
          percentage={displayPercentage}
          discountType={displayDiscountType}
          discountText={displayDiscountText}
          discountTextArabic={displayDiscountTextArabic}
        />
      </h1>
      {offer.showGift && (
        <div className="relative flex items-center gap-1 md:gap-1.5 px-3 py-1 bg-white/[0.12] backdrop-blur-sm max-w-max rounded-full text-xs text-white/90 text-center border border-white/[0.15]">
          <GiftBox size={14} className="text-yellow-500 inline-block" /> +{" "}
          {visibleText(isArabic, offer.giftText, offer.giftTextArabic)}
        </div>
      )}
    </Card>
  ) : null;

  const moreBtn = showTag && showingNumber > 0 && (
    <AccordionTrigger hideArrow className="p-0 [&[data-state=open]_svg]:rotate-180">
      <div className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-semibold border border-border bg-muted hover:bg-accent hover:text-accent-foreground h-9 px-3 transition-colors">
        {showingNumber} {t("more")}
        <ChevronDown className="size-3.5 transition-transform duration-200" />
      </div>
    </AccordionTrigger>
  );

  const companyDataUi = (
    <div className="space-y-2 lg:space-y-4">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center w-full">
          <Link
            href={`${isFutures ? "/futures/" : "/"}firms/${
              companyData.slug
            }`}
            className="flex items-center gap-2"
          >
            <div className="bg-primary3 max-w-max rounded-lg overflow-hidden border border-border">
              <div className="w-8 xl:w-12 aspect-square relative">
                <Image
                  src={companyData.logoUrl}
                  alt="image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h2 className="text-sm md:text-base xl:text-lg font-semibold flex gap-1">
              {companyData.title}{" "}
              {isTopOffer && (
                <span className=" items-center gap-1 md:flex hidden">
                  (
                  <DiscountText
                    className="text-primary"
                    mainClassName="px-0! py-0"
                    percentage={displayPercentage}
                    discountType={displayDiscountType}
                    discountText={displayDiscountText}
                    discountTextArabic={displayDiscountTextArabic}
                  />
                  )
                </span>
              )}
            </h2>
          </Link>
        </div>
        <div className="lg:hidden w-full flex justify-center">{moreBtn}</div>
      </div>
      <div className={cn("lg:hidden", onlyShowMatch && "hidden")}>
        {onlyShowMatch ? (
          displayCode ? (
            <button
              onClick={() => copyToClipboard(displayCode)}
              className={cn("flex justify-center items-center gap-2 border-2 border-dashed px-2 md:px-2.5 py-1 md:py-1.5 rounded-full text-[11px] sm:text-sm transition-colors", codeBorderCls)}
            >
              <span className={cn("font-normal", codeLabelCls)}>{t("code")}</span>
              {/* <span className={cn("font-normal", codeLabelCls)}>{t("code")}</span> */}
              <p className="h-6 border-r border-foreground/20"></p>
              <span className="font-semibold uppercase">{displayCode}</span>
              {isCopied ? (
                <Check size={14} className="text-green-500 transition-colors" />
              ) : (
                <Copy
                  size={14}
                  className={cn("cursor-pointer transition-colors", copyIconHoverCls)}
                />
              )}
            </button>
          ) : null
        ) : (
          <>
            <div className="">{percantCard}</div>
            {endTime && <div className="flex justify-center items-center mt-3">{endTime}</div>}
          </>
        )}
      </div>
      {displayText || displayTextArabic ? (
        <>
          <Separator
            className={cn("my-2 w-full ", !onlyShowMatch && "lg:block hidden")}
          />
          <OfferDescription
            text={visibleText(isArabic, displayText, displayTextArabic)}
          />
        </>
      ) : null}
    </div>
  );

  const offerOnlyContent = (
    <div className="space-y-2 lg:space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
        <div className="min-w-0 flex-1 w-full sm:w-auto">{percantCard}</div>
        <div className="lg:hidden w-full flex justify-center sm:justify-end sm:w-auto">{moreBtn}</div>
      </div>
      {endTime && <div className="flex justify-center items-center">{endTime}</div>}
      {displayText || displayTextArabic ? (
        <OfferDescription
          text={visibleText(isArabic, displayText, displayTextArabic)}
        />
      ) : null}
    </div>
  );

  const leftContent = hideCompany ? offerOnlyContent : companyDataUi;

  // Right-half-only layout: one offer row like the reference image — [Badge] [Description] [Code + Apply + More]
  if (hideCompany) {
    return (
      <CardContent
        className={cn(
          "px-0 flex flex-col sm:flex-row sm:items-center gap-4 py-4",
          !showTag && "border-t border-border pt-6"
        )}
      >
        {/* Badge: only shown when not moved to the company column — centered */}
        {!hideBadge && <div className="shrink-0 flex justify-center">{percentageBadge}</div>}

        {/* Middle: offer description + countdown */}
        <div className="min-w-0 flex-1 space-y-2">
          {displayText || displayTextArabic ? (
            <OfferDescription
              text={visibleText(isArabic, displayText, displayTextArabic)}
            />
          ) : null}
          {endTime && <div className="flex items-center">{endTime}</div>}
        </div>

        {/* Right: Code + Buy 50-50 on small screens, then More */}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 shrink-0 w-full sm:w-auto">
          <div className={cn("grid gap-2 sm:contents min-w-0", displayCode ? "grid-cols-2" : "grid-cols-1")}>
            {displayCode && (
              <button
                onClick={() => copyToClipboard(displayCode)}
                className={cn("flex justify-center items-center gap-2 border-2 border-dashed px-2.5 md:px-3 h-11 min-h-11 sm:h-auto sm:min-h-0 py-1.5 md:py-2 rounded-full text-sm w-full min-w-0 sm:w-auto transition-colors", codeBorderCls)}
              >
                <span className={cn("font-normal", codeLabelCls)}>{t("code")}</span>
                <p className="h-5 border-r border-foreground/20"></p>
                <span className="font-semibold uppercase truncate">{displayCode}</span>
                {isCopied ? (
                  <Check size={14} className="text-green-500 transition-colors shrink-0" />
                ) : (
                  <Copy size={14} className={cn("cursor-pointer transition-colors shrink-0", copyIconHoverCls)} />
                )}
              </button>
            )}
            <Link href={companyData.affiliateLink} target="_blank" className="block w-full min-w-0 sm:w-auto">
              <Button
                size="lg"
                className="w-full !h-12 !min-h-12 sm:h-auto sm:min-h-0 rounded-full text-sm sm:text-base font-semibold px-5 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200"
              >
                {t("buy")}
              </Button>
            </Link>
          </div>
          {moreBtn && <div className="w-full sm:w-auto">{moreBtn}</div>}
        </div>

        {isAdmin && (
          <div className="flex gap-2 justify-end items-center sm:col-span-full border-t border-border pt-3">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)} className="gap-1.5">
              <Pencil size={14} />
              <span className="hidden sm:inline">{t("edit")}</span>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteModalOpen(true)} className="gap-1.5">
              <Trash2 size={14} />
              <span className="hidden sm:inline">{t("delete")}</span>
            </Button>
          </div>
        )}
        <EditOfferModal open={editModalOpen} onOpenChange={setEditModalOpen} offer={offer} />
        <DeleteOfferModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} offerId={offer.id} offerCode={offer.code} />
      </CardContent>
    );
  }

  return (
    <CardContent
      className={cn(
        "px-0 flex gap-y-3 gap-x-12 flex-col lg:flex-row ",
        !showTag && "border-t border-foreground/20 pt-8"
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center gap-x-3",
          isTopOffer && "w-full"
        )}
      >
        <div
          className={cn("block lg:hidden w-full", isTopOffer && "lg:block!")}
        >
          {leftContent}
        </div>
        <div>
          {onlyShowMatch ? (
            displayCode ? (
              <button
                onClick={() => copyToClipboard(displayCode)}
                className={cn("flex justify-center items-center gap-2 border-2 border-dashed px-2 md:px-2.5 py-1 md:py-1.5 rounded-full text-[11px] sm:text-sm transition-colors", codeBorderCls)}
              >
                <span className={cn("font-normal", codeLabelCls)}>{t("code")}</span>
                <p className="h-6 border-r border-foreground/20"></p>
                <span className="font-semibold uppercase">{displayCode}</span>
                {isCopied ? (
                  <Check
                    size={14}
                    className="text-green-500 transition-colors"
                  />
                ) : (
                  <Copy
                    size={14}
                    className="cursor-pointer hover:text-primary transition-colors"
                  />
                )}
              </button>
            ) : null
          ) : (
            <div className="hidden lg:block">{percantCard}</div>
          )}
        </div>
      </div>
      {!onlyShowMatch && (
        <>
          <div
            className={cn(
              "w-full border-b border-foreground/20 block lg:hidden",
              isTopOffer && "lg:block!"
            )}
          ></div>
          <div className="flex justify-between items-center w-full h-max  gap-x-3  my-auto">
            <div className="hidden lg:block w-full">{leftContent}</div>
            <div className="flex items-center gap-2.5 justify-end ml-auto lg:ml-0 w-full lg:w-auto">
              <div className="flex flex-col gap-4 lg:gap-5 ml-0 lg:ml-4 justify-center items-center w-full">
                <div className={cn("grid lg:flex items-center gap-3 lg:gap-4 w-full min-w-0", displayCode ? "grid-cols-2" : "grid-cols-1")}>
                  <div className="space-y-2.5 lg:space-y-3 h-full lg:h-auto min-w-0">
                    {displayCode && (
                      <button
                        onClick={() => copyToClipboard(displayCode)}
                        className={cn("flex justify-center items-center gap-2 border-2 border-dashed px-2.5 md:px-3 h-11 min-h-11 lg:h-auto lg:min-h-0 py-1.5 md:py-2 rounded-full text-sm w-full min-w-0 lg:w-auto transition-colors", codeBorderCls)}
                      >
                        <span className="text-primary font-normal">
                          {t("code")}
                        </span>
                        <p className="h-5 border-r border-foreground/20"></p>
                        <span className="font-semibold uppercase truncate">
                          {displayCode}
                        </span>
                        {isCopied ? (
                          <Check
                            size={14}
                            className="text-green-500 transition-colors shrink-0"
                          />
                        ) : (
                          <Copy
                            size={14}
                            className="cursor-pointer hover:text-primary transition-colors shrink-0"
                          />
                        )}
                      </button>
                    )}
                    <div className="hidden lg:flex justify-center items-center">
                      {endTime}
                    </div>
                  </div>
                  <div className="border-border border-r-3 h-6 hidden lg:block" />
                  <div className="space-y-2.5 lg:space-y-3 min-w-0">
                    <Link href={companyData.affiliateLink} target="_blank" className="block w-full min-w-0">
                      <Button className="w-full h-12 min-h-12 lg:h-auto lg:min-h-0 lg:w-28 rounded-full text-sm sm:text-base px-4 sm:px-5 font-semibold bg-gradient-to-r from-primary to-primary-dark text-primary-foreground shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200">
                        {t("buy")}
                      </Button>
                    </Link>
                    <div className="hidden lg:block"> {moreBtn}</div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-2 justify-end  items-center">
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      onClick={() => {
                        setEditModalOpen(true);
                      }}
                      className="gap-1.5"
                    >
                      <Pencil size={14} />
                      <span className="hidden sm:inline">{t("edit")}</span>
                    </Button>
                    <Button
                      variant={"destructive"}
                      size={"sm"}
                      onClick={() => {
                        setDeleteModalOpen(true);
                      }}
                      className="gap-1.5"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">{t("delete")}</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <EditOfferModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            offer={offer}
          />
          <DeleteOfferModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            offerId={offer.id}
            offerCode={offer.code}
          />
        </>
      )}
    </CardContent>
  );
};
