"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, Copy, Plus } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import defaultCompanyImg from "@/assets/companyIcon.png";
import LinearBorder from "@/components/Global/LinearBorder";
import GiftBox from "@/components/Global/Icons/GiftBox";
import { Button } from "@/components/ui/button";
import { Offer, useGetAllOfferdataQuery } from "@/redux/api/offerApi";
import DiscountText from "@/components/Global/DiscountText";
import AddNewOffer from "../Offers/AddNewOffer";
import { visibleText } from "@/utils/visibleText";
import useIsArabic from "@/hooks/useIsArabic";
import { toast } from "sonner";

export type TOffer = {
  id: string;
  code: string;
  createdAt?: string;
  offerPercentage: number;
  text: string;
  textArabic: string;
};

export type TFirm = {
  id: string;
  title: string;
  slug: string;
  logoUrl: string;
  offers: TOffer[];
};

export default function RecentFeatures() {
  const { data: getAllOders } = useGetAllOfferdataQuery([
    { name: "isExclusive", value: "true" },
  ]);
  const isArabic = useIsArabic();
  const offers: Offer[] = getAllOders?.data || [];
  const t = useTranslations("Features");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const groupedCompanies: Offer[][] = [];
  for (let i = 0; i < offers.length; i += 1) {
    groupedCompanies.push(offers.slice(i, i + 2));
  }

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const totalSlides = groupedCompanies.length;

  const scrollPrev = () => {
    if (current > 0) api?.scrollPrev();
  };

  const scrollNext = () => {
    if (current < totalSlides - 1) api?.scrollNext();
  };

  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  const currentOffer = offers[current];
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col justify-between pb-1 h-full gap-8">
        {/* Header */}
        <div className="font-bold text-lg md:text-xl flex justify-between items-center flex-col md:flex-row">
          <div className="flex items-center gap-2">
            {t("title")}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex items-center justify-center gap-2">
              <LinearBorder
                className={cn(current === 0 && "opacity-50 cursor-not-allowed")}
              >
                <div
                  className={cn(
                    "cursor-pointer p-1",
                    current === 0 && "pointer-events-none"
                  )}
                  onClick={scrollPrev}
                >
                  <ChevronLeft />
                </div>
              </LinearBorder>

              {/* Dots */}
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-full w-3 aspect-square",
                    idx <= current
                      ? "bg-linear-to-t from-primary1 to-primary2"
                      : "bg-gray-600"
                  )}
                />
              ))}

              <LinearBorder
                className={cn(
                  current === totalSlides - 1 && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "cursor-pointer rotate-180 p-1",
                    current === totalSlides - 1 && "pointer-events-none"
                  )}
                  onClick={scrollNext}
                >
                  <ChevronLeft />
                </div>
              </LinearBorder>
            </div>
            <AddNewOffer />
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {groupedCompanies.map((group, idx) => (
              <CarouselItem key={idx} className="pl-2 md:pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.map((item) => (
                    <CompanyCard key={item.id} offer={item} />
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Bottom Section */}
        <div className="inline-flex flex-col md:flex-row items-center justify-between gap-3 px-3 py-3 md:px-5 md:py-5 rounded-full bg-primary/10 border-2 border-primary border-dashed shadow-lg w-full">
          <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-base text-card-foreground">
            {currentOffer?.showGift && (
              <div className="flex gap-2">
                <GiftBox className="inline w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                <Plus className="inline w-4 h-4 md:w-5 md:h-5" />
                {visibleText(
                  isArabic,
                  currentOffer?.giftText,
                  currentOffer?.giftTextArabic
                )}{" "}
                &
              </div>
            )}

            <span className="text-xs md:text-sm xl:text-base font-bold">
              {currentOffer?.text || currentOffer?.textArabic ? (
                <p className="font-medium text-sm">
                  {visibleText(
                    isArabic,
                    currentOffer?.text,
                    currentOffer?.textArabic
                  )}
                </p>
              ) : null}
            </span>
          </div>

          <Button
            size="sm"
            className="mt-2 md:mt-0 flex items-center gap-1 md:gap-2"
            onClick={() => handleCopy(currentOffer?.code)}
          >
            <span className="font-semibold text-xs md:text-sm">Code</span>|
            <span className="text-sm md:text-base font-semibold">
              {currentOffer?.code}
            </span>
            <Copy className="w-3 h-3 md:w-4 md:h-4 text-accent-foreground" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const CompanyCard = ({ offer }: { offer: Offer }) => {
  return (
    <div className="border-primary border rounded-lg p-5 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-primary3 max-w-max p-2 rounded-full">
          <div className="w-5 xl:w-6 aspect-square relative">
            <Image
              src={offer.firm?.logoUrl || defaultCompanyImg}
              alt="firm"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
        <h2 className="text-base md:text-lg xl:text-xl font-semibold">
          {offer.firm?.title}
        </h2>
      </div>

      <LinearBorder className="rounded-lg" className2="rounded-lg">
        <DiscountText
          percentage={offer.offerPercentage}
          discountType={offer.discountType}
          discountText={offer.discountText}
          discountTextArabic={offer.discountTextArabic}
        />
      </LinearBorder>
    </div>
  );
};
