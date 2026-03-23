"use client";
import { Accordion } from "../ui/accordion";
import SingleQuestion from "./SingleQuestion";
import { FAQ } from "@/types";
import { useSearchParams } from "next/navigation";

export default function FAQAccordion({
  faqData,
  isArabic,
}: {
  faqData: FAQ[];
  isArabic: boolean;
}) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={slug}
      className="w-full space-y-4"
    >
      {faqData.map((item, index) => (
        <SingleQuestion
          isArabic={isArabic}
          key={item.id}
          faq={item}
          nextFaq={faqData[index + 1]}
          prevFaq={faqData[index - 1]}
        />
      ))}
    </Accordion>
  );
}
