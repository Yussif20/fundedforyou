"use client";

import { Button } from "@/components/ui/button";
import useIsArabic from "@/hooks/useIsArabic";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaTag } from "react-icons/fa6";
import { RiDiscountPercentFill } from "react-icons/ri";

export default function OfferFilter() {
  const t = useTranslations("Offers");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isArabic = useIsArabic();
  const isExclusive = pathname.includes("exclusive-offers");

  const categories = [
    {
      name: t("exclusiveOffers"),
      queryKey: "exclusive",
      pathSegment: "exclusive-offers",
      icon: FaTag,
    },
    {
      name: t("allCurrentOffers"),
      queryKey: "all",
      pathSegment: "offers",
      icon: RiDiscountPercentFill,
      defaultIconDesign: "text-foreground/50",
    },
  ];

  const handleSetCategory = (pathSegment: string) => {
    const basePath = pathname.replace(/\/(exclusive-offers|offers)$/, "") || "";
    const newPath = basePath ? `${basePath}/${pathSegment}` : `/${pathSegment}`;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${newPath}?${query}` : newPath);
  };

  return (
    <div className="flex items-center gap-2 md:gap-4 overflow-auto">
      {categories.map((item) => {
        const isActive =
          item.queryKey === "all" ? !isExclusive : isExclusive;
        return (
          <Button
            key={item.queryKey}
            onClick={() => handleSetCategory(item.pathSegment)}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "text-foreground/70",
              isActive && "text-foreground font-medium",
              isArabic && "font-semibold"
            )}
          >
            {item?.icon && (
              <item.icon
                className={cn(
                  "text-primary",
                  isActive && "text-success",
                  item?.defaultIconDesign
                )}
              />
            )}
            {item.name}
          </Button>
        );
      })}
    </div>
  );
}
