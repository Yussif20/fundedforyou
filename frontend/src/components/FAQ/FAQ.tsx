export const revalidate = 5;
import SectionTitle from "../Global/SectionTitle";

import LinearBorder from "../Global/LinearBorder";
import { FAQ } from "@/types";
import { AddFaq } from "./FAQForms";
import { getLocale, getTranslations } from "next-intl/server";
import { serverApi } from "@/lib/serverAxios";
import FAQAccordion from "./FAQAccordion";

export default async function FAQComponent({ locale }: { locale?: string }) {
  const currentLocale = locale ?? (await getLocale());
  const isArabic = currentLocale === "ar";
  const t = await getTranslations("FAQ");
  const { data } = await serverApi.get<{ data: FAQ[] }>(`/faqs`);
  const allFaqData = data?.data || [];

  return (
    <div className="space-y-8 md:space-y-14 overflow-x-hidden">
      <div>
        <div className="flex items-center w-full justify-center">
          <SectionTitle
            title={t("title")}
            subtitle={t("subtitle").replace(
              "هل تحتاج إلى مساعدة أو مزيد من المعلومات؟",
              "هل تحتاج إلى مساعدة أو مزيد من المعلومات؟\n"
            )}
            subtitleClass="max-w-xl"
          />
        </div>
      </div>
      <div className="flex items-center w-full justify-end max-w-5xl mx-auto px-4">
        <AddFaq />
      </div>
      <LinearBorder
        className="rounded-2xl w-full max-w-5xl mx-auto overflow-hidden px-4"
        className2="rounded-2xl relative overflow-hidden"
      >
        <div className="p-6 md:p-8 bg-background relative rounded-2xl overflow-hidden">
          <div className="absolute w-50 aspect-square bg-primary/40 blur-[80px] -left-10 -top-30 hidden md:block"></div>

          <h2 className="text-2xl md:text-3xl font-bold md:font-extrabold mb-6 md:mb-8 relative text-foreground">
            {t("commonQuestions")}
          </h2>

          {allFaqData.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm md:text-lg">
              No FAQs available
            </div>
          ) : (
            <FAQAccordion faqData={allFaqData} isArabic={isArabic} />
          )}
        </div>
      </LinearBorder>
    </div>
  );
}
