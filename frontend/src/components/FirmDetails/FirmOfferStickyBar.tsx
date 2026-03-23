"use client";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import useIsFutures from "@/hooks/useIsFutures";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SinglePropFirm } from "@/types/firm.types";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";

const LG_BREAKPOINT = 1024;

export default function FirmOfferStickyBar({ firm }: { firm: SinglePropFirm }) {
  const t = useTranslations("Offers");
  const isFutures = useIsFutures();
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    successMessage: t("codeCopied") ?? "Code copied!",
    errorMessage: t("copyFailed") ?? "Failed to copy",
  });

  const firstOffer = firm?.offers?.[0];
  const hasCode = Boolean(firstOffer?.code);
  const hasPercent = firstOffer?.offerPercentage != null && firstOffer.offerPercentage > 0;
  const hasTextDiscount = firstOffer?.discountType === "TEXT";
  const hasAffiliate = Boolean(firm?.affiliateLink);

  useEffect(() => {
    const check = () => setIsSmallScreen(typeof window !== "undefined" && (window.innerWidth < LG_BREAKPOINT || window.innerHeight < 500));
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isSmallScreen) return null;
  if (!hasCode && !hasPercent && !hasTextDiscount && !hasAffiliate) return null;

  const codeBorderCls = isFutures
    ? "border-yellow-400/70 hover:bg-yellow-400/10"
    : "border-primary/70 hover:bg-primary/10";

  const firmHref = isFutures ? `/futures/firms/${firm.slug}` : `/firms/${firm.slug}`;

  return (
    <div className={cn(
      "sticky z-30 w-full border-b border-border bg-background/95 backdrop-blur-sm shadow-sm lg:hidden",
      (hasCode || hasPercent) ? "top-[3.75rem] tablet:top-[7rem]" : "top-(--navbar-height,3.5rem)"
    )}>
      <div className="flex items-center gap-3 landscape-phone:gap-2 px-3 py-2.5 sm:px-4 sm:py-3 landscape-phone:py-1.5 landscape-phone:px-3">
        {/* Logo */}
        <Link href={firmHref} className="shrink-0 self-center rounded-md hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 sm:w-12 sm:h-12 landscape-phone:w-8 landscape-phone:h-8 rounded-md overflow-hidden border border-border bg-card relative">
            <Image
              src={firm.logoUrl || "/placeholder.png"}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Name + Code + Percent: stacked on portrait, single row on landscape */}
        <div className="flex flex-col gap-1.5 landscape-phone:flex-row landscape-phone:items-center landscape-phone:gap-3 min-w-0 flex-1">
          <Link href={firmHref} className="min-w-0 hover:underline shrink-0">
            <span className="font-semibold text-sm sm:text-base landscape-phone:text-sm text-foreground line-clamp-1">
              {firm.title}
            </span>
          </Link>

          <div className="flex items-center gap-2 landscape-phone:gap-1.5 flex-wrap landscape-phone:flex-nowrap">
            {hasCode && (
              <button
                type="button"
                onClick={() => copyToClipboard(firstOffer!.code)}
                className={cn(
                  "inline-flex items-center gap-1.5 landscape-phone:gap-1 rounded-lg border-2 border-dashed px-2.5 py-1 sm:px-3 sm:py-1.5 landscape-phone:px-2 landscape-phone:py-0.5 text-xs sm:text-sm landscape-phone:text-xs transition-colors",
                  codeBorderCls
                )}
              >
                <span className="font-semibold uppercase tracking-wide">{firstOffer!.code}</span>
                {isCopied ? (
                  <Check className="size-3.5 sm:size-4 landscape-phone:size-3 text-green-500 shrink-0" />
                ) : (
                  <Copy className={cn("size-3.5 sm:size-4 landscape-phone:size-3 shrink-0", isFutures ? "text-yellow-500" : "text-primary")} />
                )}
              </button>
            )}

            {hasPercent && (
              <div className="inline-flex items-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1 sm:px-3 sm:py-1.5 landscape-phone:px-2 landscape-phone:py-0.5 border border-primary/30">
                <span className="text-xs sm:text-sm landscape-phone:text-xs font-bold tabular-nums text-primary">{firstOffer!.offerPercentage}%</span>
                <span className="text-[10px] sm:text-xs landscape-phone:text-[10px] font-semibold uppercase tracking-wider text-primary/80">OFF</span>
              </div>
            )}
          </div>
        </div>

        {/* Buy button */}
        {hasAffiliate && (
          <NextLink href={firm.affiliateLink} target="_blank" rel="noopener noreferrer" className="shrink-0 self-center">
            <Button size="sm" className="h-9 sm:h-10 landscape-phone:h-7 rounded-lg gap-1.5 sm:gap-2 landscape-phone:gap-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base landscape-phone:text-xs px-4 sm:px-5 landscape-phone:px-3">
              {t("buy")}
              <ArrowUpRight className="size-4 sm:size-5 landscape-phone:size-3.5 shrink-0" />
            </Button>
          </NextLink>
        )}
      </div>
    </div>
  );
}
