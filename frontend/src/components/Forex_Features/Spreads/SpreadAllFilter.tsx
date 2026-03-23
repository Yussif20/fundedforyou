"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGetPlatformsQuery } from "@/redux/api/spreadApi";
import { Platform_T } from "@/types/spread.types";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const handleSetSearchParams = (
    params: Record<string, string>,
    searchParams: URLSearchParams,
    router: ReturnType<typeof useRouter>,
) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
        if (
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
        ) {
            newParams.delete(key);
        } else if (Array.isArray(value)) {
            newParams.set(key, JSON.stringify(value));
        } else {
            newParams.set(key, String(value));
        }
    });

    router.push(`?${newParams.toString()}`, { scroll: false });
};

export default function SpreadAllFilters({ firms, currencies }: {
    firms: { name: string, id: string, image: string }[], currencies: {
        id: string;
        countries: {
            flag: StaticImageData;
            currency: string;
        }[];
        symbol: {
            id: string;
            countries: string[];
        };
    }[]
}) {
    const t = useTranslations("Filters");
    const [isMobile, setIsMobile] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const filterOpen = searchParams.get("filterOpen") === "true" ? true : false;
    const { data: dataRawPlatforms } = useGetPlatformsQuery([
        {
            name: "limit",
            value: "100",
        },
    ]);
    const platforms = dataRawPlatforms?.data?.platforms || [];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1040);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    const getArrayParam = (key: string) => {
        const value = searchParams.get(key);
        return value?.split(",") || [];
    };

    const filters = {
        platforms: getArrayParam("platforms"),
        firms: getArrayParam("firms"),
        symbols: getArrayParam("symbols"),
    };

    const toggleMultiSelect = (key: string, value: string) => {
        const current = (filters[key as keyof typeof filters] as string[]) ?? [];
        const updated = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
        handleSetSearchParams({ [key]: updated.join(",") }, searchParams, router);
    };

    const resetFilters = () => {
        router.push(window.location.pathname, { scroll: false });
    };

    const getExpandedItems = () => {
        const expanded = searchParams.get("expanded");
        return expanded ? expanded.split(",") || [] : [];
    };

    const handleAccordionChange = (values: string[]) => {
        handleSetSearchParams({ expanded: values.join() }, searchParams, router);
    };

    const items = (
        <>
            <Accordion
                type="multiple"
                value={getExpandedItems()}
                onValueChange={handleAccordionChange}
                className="w-full"
            >


                {/* firms */}
                <AccordionItem value="firms" className="border-gray-800">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        {t("firms")}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                        <div className="grid gap-4">
                            {firms.map((firm) => {
                                const isActive = filters["firms"].includes(firm.id)
                                return <div onClick={() => toggleMultiSelect("firms", firm.id)} key={firm.id} className="flex items-center gap-3 cursor-pointer">

                                    <div className={cn("size-6 rounded-md  border border-border flex justify-center items-center", isActive ? "bg-foreground" : "")}>
                                        {isActive && <Check size={16} className="text-background" />}
                                    </div>

                                    <div
                                        className="flex items-center gap-2"
                                    >
                                        <div className="bg-primary3 max-w-max rounded-lg overflow-hidden border border-border flex-shrink-0">
                                            <div className="w-10 aspect-square relative">
                                                <Image
                                                    src={firm.image}
                                                    alt="image"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-hidden transition-all duration-200 md:!max-w-none">
                                            <h2 className="text-base md:text-lg xl:text-xl font-semibold whitespace-nowrap">
                                                {firm?.name}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* Platforms */}
                <AccordionItem value="platforms" className="border-gray-800">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        {t("platforms")}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                        <div className="flex flex-wrap gap-2">
                            {platforms.map((platform: Platform_T) => (
                                <Badge
                                    key={platform.id}
                                    variant={
                                        filters["platforms"].includes(platform.id)
                                            ? "defaultBH"
                                            : "outline"
                                    }
                                    onClick={() => toggleMultiSelect("platforms", platform.id)}
                                    className="cursor-pointer"
                                >
                                    {platform.title}
                                </Badge>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* Symbols */}
                <AccordionItem value="symbols" className="border-gray-800">
                    <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                        {t("symbols")}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-4">
                        <div className="grid gap-4">
                            {currencies.map((currency) => {
                                const isActive = filters["symbols"].includes(currency.id)
                                return <div key={currency.id} onClick={() => toggleMultiSelect("symbols", currency.id)} className="flex items-center gap-1.5 cursor-pointer">
                                    <div className={cn("size-6 rounded-md  border border-border flex justify-center items-center", isActive ? "bg-foreground" : "")}>
                                        {isActive && <Check size={16} className="text-background" />}
                                    </div>

                                    <div className="flex gap-1.5">
                                        {currency.countries.map((country, index) => (
                                            <div
                                                key={`${country.currency}-${index}`}
                                                className={`w-9 h-9 rounded-full overflow-hidden relative ${index > 0 ? "-ml-5" : ""}`}
                                            >
                                                <Image
                                                    src={country.flag}
                                                    alt={country.currency}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-base font-semibold text-foreground">
                                        {currency.countries.map((i) => i.currency).join("/")}
                                    </p>
                                </div>
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button
                variant="link"
                className="w-full text-success hover:bg-transparent"
                onClick={resetFilters}
            >
                {t("resetFilter")}
            </Button>
        </>
    );

    const handleSetCategory = () => {
        handleSetSearchParams({ filterOpen: "" }, searchParams, router);
    };

    return (
        <>
            <div
                className={cn(
                    "w-sm hidden lg:block transition-all duration-300 space-y-4 rounded-lg bg-background text-foreground overflow-hidden",
                    !filterOpen && "w-0",
                )}
            >
                {items}
            </div>
            {isMobile && (
                <Dialog open={filterOpen} onOpenChange={handleSetCategory}>
                    <DialogContent className="max-w-full! h-full p-4 overflow-auto bg-background text-foreground lg:hidden flex justify-center items-center">
                        <div className="w-full max-w-md max-h-[90vh] overflow-auto">
                            {items}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
