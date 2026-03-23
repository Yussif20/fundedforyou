"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export default function AnnouncementSort() {
  const t = useTranslations("AnnouncementSort");
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";

  const options = [
    { label: t("options.recent"), value: "-createdAt" },
    { label: t("options.old"), value: "createdAt" },
  ];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex gap-2 justify-end items-center">
      <p className="w-max">{t("placeholder")}</p>
      <div className="w-34">
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
