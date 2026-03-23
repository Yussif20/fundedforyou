"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { handleSetSearchParams } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { AddNews } from "./NewsActions";

export default function HINFilter() {
  const t = useTranslations("HighImpactNews");
  const searchParams = useSearchParams();
  const router = useRouter();
  const weeks: { name: string; value: string }[] = [
    { name: t("previousWeek"), value: "previous" },
    { name: t("currentWeek"), value: "current" },
    { name: t("nextWeek"), value: "next" },
  ];

  const selectedWeek = searchParams.get("week") || "current";

  const handleSetUrl = (value: Record<string, string>) => {
    handleSetSearchParams(value, searchParams, router);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 md:gap-4 items-center justify-center">
        {weeks.map((item) => {
          const isActive = selectedWeek === item.value;
          return (
            <Button
              key={item.value}
              className="px-3! sm:px-6! text-xs sm:text-sm font-semibold"
              onClick={() => handleSetUrl({ week: item.value })}
              variant={isActive ? "outline" : "outline2"}
            >
              {item.name}
            </Button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <AddNews>
          <Button>{t("addNews")}</Button>
        </AddNews>
      </div>
    </div>
  );
}
