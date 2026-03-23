import SectionTitle from "../Global/SectionTitle";
import Container from "../Global/Container";
import { getTranslations } from "next-intl/server";
import HowItWorksStepsClient from "./HowItWorksStepsClient";

export default async function HowItWorks() {
  const t = await getTranslations("HowItWorks");
  const steps = [
    { number: "01", text: t("steps.step1") },
    { number: "02", text: t("steps.step2") },
    { number: "03", text: t("steps.step3") },
  ];

  return (
    <section className="py-12 md:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <SectionTitle
              title={t("title")}
              subtitle={t("subtitle")}
              className="gap-4 md:gap-5"
              titleClass="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground"
              subtitleClass="text-base sm:text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed font-medium"
            />
          </div>
          <div className="relative rounded-2xl border border-primary/30 bg-linear-to-b from-primary/3 to-primary/8 p-4 sm:p-6 md:p-10 shadow-[0_0_0_1px_rgba(5,150,102,0.04),0_4px_24px_rgba(5,150,102,0.06)]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute -top-20 left-1/4 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-20 right-1/4 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
            </div>
            <HowItWorksStepsClient steps={steps} />
          </div>
        </div>
      </Container>
    </section>
  );
}
