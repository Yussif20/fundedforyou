"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import useIsFutures from "@/hooks/useIsFutures";
import useIsActive from "@/hooks/useIsActive";
import useIsArabic from "@/hooks/useIsArabic";
import { cn } from "@/lib/utils";
import { Building2, Gift, Trophy } from "lucide-react";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useGetAllChallengesQuery } from "@/redux/api/challenge";
import { useGetAllOffersQuery } from "@/redux/api/offerApi";

const tabIcons: Record<string, React.ReactNode> = {
  "/": <Building2 size={16} />,
  "/offers": <Gift size={16} />,
  "/challenges": <Trophy size={16} />,
};

export default function HomeNavItems() {
  const t = useTranslations("Navbar");
  const isFutures = useIsFutures();
  const isArabic = useIsArabic();
  const comingPathname = usePathname();
  const pathName = `/${comingPathname.split("/").slice(2).join("/")}`;
  const checkActive = useIsActive();

  // Lightweight count-only queries (limit=1 just to get meta.total)
  const firmType = isFutures ? "FUTURES" : "FOREX";
  const { data: firmsData } = useGetAllFirmsQuery([
    { name: "limit", value: 1 },
    { name: "firmType", value: firmType },
  ]);
  const { data: challengesData } = useGetAllChallengesQuery([
    { name: "limit", value: 1 },
    { name: "firmType", value: firmType },
  ]);
  const { data: offersData } = useGetAllOffersQuery({ limit: 1, firmType });

  const counts: Record<string, number | undefined> = {
    "/": firmsData?.meta?.total,
    "/offers": offersData?.meta?.total,
    "/challenges": challengesData?.meta?.total,
  };

  let pages: { name: string; value: string; baseValue: string }[] = [
    { name: t("firms"), value: "/", baseValue: "/" },
    { name: t("offers"), value: "/offers", baseValue: "/offers" },
    { name: t("challenges"), value: "/challenges?size=100000&in_steps=STEP1", baseValue: "/challenges" },
  ];

  // ---- APPLY TYPE PREFIX ----
  pages = pages.map((item) => ({
    ...item,
    value: isFutures
      ? "/futures" + (item.value === "/" ? "" : item.value)
      : "/forex" + (item.value === "/" ? "" : item.value),
  }));


  // ----- MATCH CHECK WITH TYPE ----
  const isNotMatchPathName =
    pathName === (isFutures ? "/futures" : "/forex")
      ? false
      : !pathName.startsWith(isFutures ? "/futures/offers" : "/forex/offers") &&
        !pathName.startsWith(
          isFutures ? "/futures/exclusive-offers" : "/forex/exclusive-offers",
        ) &&
        !pathName.startsWith(isFutures ? "/futures/challenges" : "/forex/challenges");

  if (isNotMatchPathName) return "";

  return (
    <div id="tabs-section" className="space-y-5 pb-5 md:pb-8 scroll-mt-40">
      <div className="flex flex-nowrap justify-center items-center gap-1.5 sm:gap-2 md:gap-4 overflow-x-auto">
        {pages.map((item) => {
          const isActive =
            (item.baseValue === "/offers" &&
              (pathName.includes("exclusive-offers") || pathName.endsWith("/offers") || pathName === "/offers")) ||
            checkActive(
              item.value,
              isFutures ? ["/futures"] : ["/forex"],
            );
          const count = counts[item.baseValue];
          return (
            <Link key={item.value} href={item.value} scroll={false} className="shrink-0">
              <Button
                size={"default"}
                variant={isActive ? "default" : "outline"}
                linearClassName="shadow-none"
                className={cn(
                  "flex items-center gap-1 sm:gap-1.5 md:gap-2",
                  "min-w-0 px-2 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs md:h-12 md:px-7 md:text-base",
                  isArabic && "md:text-lg md:font-semibold"
                )}
              >
                {tabIcons[item.baseValue]}
                <span className="truncate">{item.name}</span>
                {count !== undefined && (
                  <span
                    className={cn(
                      "shrink-0 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium tabular-nums",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-foreground/10 text-foreground/50"
                    )}
                  >
                    {count > 999 ? "999+" : count}
                  </span>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
