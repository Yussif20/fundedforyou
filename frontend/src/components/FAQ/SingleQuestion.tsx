import { FAQ } from "@/types";
import slug from "slug";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { visibleText } from "@/utils/visibleText";
import FAQAction from "./FAQAction";

export default function SingleQuestion({
  faq,
  isArabic,
  nextFaq,
  prevFaq,
}: {
  faq: FAQ;
  isArabic: boolean;
  nextFaq: FAQ;
  prevFaq: FAQ;
}) {
  return (
    <AccordionItem
      value={slug(faq.question)}
      className="border-2 border-border/60 rounded-xl px-5 py-1 bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <AccordionTrigger dir={isArabic ? "rtl" : "ltr"} className="text-start flex-1 hover:no-underline py-5 text-base md:text-lg font-semibold md:font-bold text-foreground">
          {visibleText(isArabic, faq.question, faq.questionArabic)}
        </AccordionTrigger>
        <FAQAction faq={faq} nextFaq={nextFaq} prevFaq={prevFaq} />
      </div>
      <AccordionContent>
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="mfs-content danger-html text-sm md:text-lg font-medium text-foreground/90 leading-relaxed text-start"
          style={
            faq.mobileFontSize
              ? ({
                  "--mobile-fs": `${faq.mobileFontSize}px`,
                } as React.CSSProperties)
              : undefined
          }
          dangerouslySetInnerHTML={{
            __html: visibleText(isArabic, faq.answer, faq.answerArabic),
          }}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
