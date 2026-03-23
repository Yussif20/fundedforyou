"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FaTrophy } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import LinearBorder from "@/components/Global/LinearBorder";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import DiscountText from "@/components/Global/DiscountText";

type Company = {
  id: string;
  title: string;
  off: number;
  logoUrl: string | StaticImageData;
  position: number;
  offers?: { offerPercentage: number }[];
};

export default function PopularFeatures() {
  const { data: allOfferData } = useGetAllFirmsQuery([
    { name: "category", value: "NEW" },
    { name: "firmType", value: "FOREX" },
    { name: "limit", value: "3" },
  ]);

  const t = useTranslations("Features");

  return (
    <Card className="relative">
      <CardContent className="space-y-8 pb-1">
        <div className="font-bold text-lg md:text-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            {t("newTitle")} <FaTrophy className="text-yellow-500" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {allOfferData?.firms?.map((item: any) => (
            <CompanyCard key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const CompanyCard = ({ item }: { item: Company }) => {
  return (
    <div className="border-primary border rounded-lg p-2.5 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FaTrophy
          className={cn(
            "text-xl",
            item.position === 1 && "text-yellow-500",
            item.position === 2 && "text-[#FEC8AE]",
            item.position === 3 && "text-[#6C6D6C]"
          )}
        />
        <div className="bg-primary3 max-w-max p-2 rounded-full">
          <div className="w-6 aspect-square relative">
            <Image
              src={item.logoUrl}
              alt="image"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <h2 className="text-base md:text-xl font-semibold">{item.title}</h2>
      </div>
      {item?.offers?.[0]?.offerPercentage ? (
        <LinearBorder className="rounded-lg" className2="rounded-lg">
          <DiscountText percentage={item.offers[0].offerPercentage} />
        </LinearBorder>
      ) : null}
    </div>
  );
};
