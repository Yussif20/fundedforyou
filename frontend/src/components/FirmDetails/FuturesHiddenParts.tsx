"use client";

import { SinglePropFirm } from "@/types/firm.types";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { visibleText } from "@/utils/visibleText";
import SecTitle from "./FO_SecTitle";

export function RiskManagement({
  company,
  isArabic,
  isFutures,
}: {
  company: SinglePropFirm;
  isArabic: boolean;
  isFutures: boolean;
}) {
  const tSidebar = useTranslations("FOSidebar");
  if (isFutures) {
    return null;
  }
  return (
    <>
      <section id="risk-management" className="space-y-6 scroll-mt-[270px]">
        <SecTitle>
          {tSidebar("items.riskManagement")}
        </SecTitle>
        {company?.riskManagement && (
          <div className="text-sm md:text-base">
            <div
              className="danger-html mfs-content"
              style={company?.riskManagementMobileFontSize ? ({ "--mobile-fs": `${company.riskManagementMobileFontSize}px` } as React.CSSProperties) : undefined}
              dangerouslySetInnerHTML={{
                __html: visibleText(
                  isArabic,
                  company?.riskManagement,
                  company?.riskManagementArabic,
                ),
              }}
            ></div>
          </div>
        )}
      </section>
      <Separator />
    </>
  );
}

export function ProfitShare({
  company,
  isArabic,
  isFutures,
}: {
  company: SinglePropFirm;
  isArabic: boolean;
  isFutures: boolean;
}) {
  const tSidebar = useTranslations("FOSidebar");
  if (isFutures) {
    return null;
  }
  return (
    <>
      <section id="profit-share" className="space-y-6 scroll-mt-[270px]">
        <SecTitle>
          {tSidebar("items.profitShare")}
        </SecTitle>
        <div
          className="danger-html mfs-content"
          style={company?.profitShareMobileFontSize ? ({ "--mobile-fs": `${company.profitShareMobileFontSize}px` } as React.CSSProperties) : undefined}
          dangerouslySetInnerHTML={{
            __html: visibleText(
              isArabic,
              company?.profitShare,
              company?.profitShareArabic,
            ),
          }}
        ></div>
      </section>
      <Separator />
    </>
  );
}
