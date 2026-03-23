"use client";
import { Button } from "../ui/button";
import useIsActive from "@/hooks/useIsActive";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import useIsFutures from "@/hooks/useIsFutures";
import { useEffect, useRef } from "react";

export default function FDTabs({
  slug,
  count,
}: {
  slug: string;
  count: { offers: number; challenges: number; announcements: number };
}) {
  const t = useTranslations("FDTabs");
  const isActive = useIsActive();
  const pathname = usePathname();
  const isFutures = useIsFutures();
  const prevPathRef = useRef<string | null>(null);

  const basePath =
    (isFutures ? "/futures/" : "/") +
    "firms/" +
    slug;

  const tabs = [
    {
      name: <div>{t("tabs.overview")}</div>,
      slugPath: basePath,
    },
    {
      name: (
        <div>
          {t("tabs.challenges")}{" "}
          {count.challenges > 0 && <>({count.challenges})</>}
        </div>
      ),
      slugPath: `${basePath}/challenges`,
    },

    {
      name: (
        <div>
          {t("tabs.offers")} {count.offers > 0 && <>({count.offers})</>}
        </div>
      ),
      slugPath: `${basePath}/offers`,
    },

    // {
    //   name: (
    //     <div>
    //       {t("tabs.announcements")}{" "}
    //       {count.announcements > 0 && <>({count.announcements})</>}
    //     </div>
    //   ),
    //   slugPath: `${basePath}/announcements`,
    // },
  ];

  const overviewPath = tabs[0].slugPath;

  const isOffersTabActive =
    pathname.includes(`firms/${slug}/`) &&
    (pathname.includes("exclusive-offers") || pathname.endsWith("/offers"));

  const scrollToTabs = () => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("firm-tabs");
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const styles = getComputedStyle(document.documentElement);
    const navVar = styles.getPropertyValue("--navbar-height").trim();
    const navHeight = parseInt(navVar || "0", 10) || 72;
    // Scroll a bit further up so more content shows below the tabs
    const offset = rect.top + window.scrollY - navHeight - 8 - 160;

    window.scrollTo({
      top: Math.max(offset, 0),
      behavior: "smooth",
    });
  };

  // Scroll to tabs only when pathname actually changes (tab click), not on first load
  useEffect(() => {
    // Skip scroll on first render — only scroll when user navigates between tabs
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      return;
    }
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    const isFirmTabPath =
      pathname === basePath ||
      pathname === `${basePath}/` ||
      pathname.startsWith(`${basePath}/challenges`) ||
      pathname.includes("exclusive-offers") ||
      pathname.endsWith("/offers");

    if (!isFirmTabPath) return;

    const id = setTimeout(scrollToTabs, 120);
    return () => clearTimeout(id);
  }, [pathname, basePath]);

  return (
    <div
      id="firm-tabs"
      className="flex flex-wrap justify-center items-center gap-2 sm:gap-5 w-full overflow-auto"
    >
      {tabs.map((item, index) => {
        const isOffersTab = item.slugPath.endsWith("/offers");
        const active = isOffersTab
          ? isOffersTabActive
          : item.slugPath === overviewPath
          ? pathname === overviewPath || pathname === `${overviewPath}/`
          : isActive(item.slugPath);

        const href = item.slugPath;

        return (
          <Link key={index} href={href} scroll={false}>
            <Button
              size="2xl"
              variant={active ? "defaultBH" : "outline2"}
              className="rounded font-semibold h-9 px-3 text-xs sm:h-12 sm:px-6 sm:text-base"
            >
              {item.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
