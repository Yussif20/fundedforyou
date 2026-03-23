"use client";
import useIsArabic from "@/hooks/useIsArabic";
import useIsFutures from "@/hooks/useIsFutures";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export default function FO_Sidebar() {
  const t = useTranslations("FOSidebar");
  const isFutures = useIsFutures();
  const isArabic = useIsArabic();
  const sidebarItems = [
    { label: t("items.firmOverview"), value: "firm-overview" },
    { label: t("items.leverage"), value: "leverages" },
    { label: t("items.commissions"), value: "commissions" },
    { label: t("items.accountSizes"), value: "account-sizes" },
    { label: t("items.maxAllocation"), value: "max-allocation" },
    { label: t("items.dailyMaximumLoss"), value: "daily-maximum-loss" },
    { label: t("items.drawdown"), value: "drawdown" },
    ...(!isFutures
      ? [{ label: t("items.riskManagement"), value: "risk-management" }]
      : []), //hide on futures
    { label: t("items.consistencyRules"), value: "consistency-rules" },
    ...(!isFutures
      ? [
          {
            label: t("items.minimumTradingDays"),
            value: "minimum-trading-days",
          },
        ]
      : []), //hide on futures
    { label: t("items.newsTrading"), value: "news-trading" },
    {
      label: t("items.overnightWeekendsHolding"),
      value: "overnight-weekends-holding",
    },
    { label: t("items.copyTrading"), value: "copy-trading" },
    { label: t("items.experts"), value: "experts" },
    { label: t("items.vpnVps"), value: "vpn-vps" },
    ...(!isFutures
      ? [{ label: t("items.profitShare"), value: "profit-share" }]
      : []), //hide on futures
    { label: t("items.payoutPolicy"), value: "payout-policy" },
    ...(!isFutures
      ? [{ label: t("items.scaleUpPlan"), value: "scale-up-plan" }]
      : []), //hide on futures
    { label: t("items.inactivityRules"), value: "inactivity-rules" },
    { label: t("items.prohibitedStrategies"), value: "prohibited-strategies" },
    { label: t("items.restrictedCountries"), value: "restricted-countries" },
  ];

  const [activeId, setActiveId] = useState(sidebarItems[0].value);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const containerRef = useRef<HTMLElement | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const triggerPoint = 300;
      let currentSection = sidebarItems[0]?.value;

      for (let item of sidebarItems) {
        const section = document.getElementById(item.value);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top;

          if (sectionTop <= triggerPoint) {
            currentSection = item.value;
          }
        }
      }
      setActiveId(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sidebarItems]);

  // On small screens (horizontal sidebar): scroll the container so the active link is centered.
  // Uses container.scrollLeft instead of scrollIntoView to avoid pushing the page up.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    const isHorizontal = window.innerWidth < 768 || window.innerHeight < 500; // md breakpoint + landscape phone check
    if (!isHorizontal) return;
    const activeEl = activeId ? itemRefs.current[activeId] : null;
    const container = containerRef.current;
    if (!activeEl || !container) return;
    const scrollLeft =
      activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [activeId]);

  return (
    <aside ref={containerRef} className="w-full tablet:w-48 lg:w-64 space-y-1 flex flex-row tablet:flex-col overflow-auto border-b-0 scrollbar-hide">
      {sidebarItems.map((item, index) => (
        <a
          key={index}
          ref={(el) => {
            itemRefs.current[item.value] = el;
          }}
          href={`#${item.value}`}
          className={cn(
            "w-full block font-medium text-[11px] tablet:text-[13px] text-start px-3 tablet:px-4 py-2 tablet:py-1 tablet:rounded-sm transition-all duration-200 hover:bg-accent text-muted-foreground min-w-max",
            activeId === item.value &&
              "border-b-2 tablet:border-b-0 tablet:bg-primary/20 tablet:border-l-4 border-primary hover:bg-primary/20 text-foreground py-2! font-bold",
            isArabic && "font-semibold",
          )}
        >
          {item.label}
        </a>
      ))}
    </aside>
  );
}
