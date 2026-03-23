import "@/styles/globals.css";
import HeroConditional from "@/components/Global/HeroConditional";
import Container from "@/components/Global/Container";
import HomeNavItems from "@/components/Forex_Features/HomeNavItems";
import Subscribe from "@/components/Forex_Features/Subscribe";
import SectionDivider from "@/components/Global/SectionDivider";
import ScrollReveal from "@/components/Global/ScrollReveal";
import PrefetchTabData from "@/components/Global/PrefetchTabData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <HeroConditional />
      <PrefetchTabData />
      <div className="py-6 md:py-10">
        <ScrollReveal delay={0.05}>
          <HomeNavItems />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Container>{children}</Container>
        </ScrollReveal>
        <SectionDivider />
        <ScrollReveal delay={0.05}>
          <Subscribe />
        </ScrollReveal>
      </div>
    </div>
  );
}
