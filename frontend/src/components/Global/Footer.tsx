"use client";

import { Instagram } from "lucide-react";
import Container from "./Container";
import NavbarLogo from "./Navbar/NavbarLogo";
import { PiTiktokLogo } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { AiOutlineDiscord } from "react-icons/ai";
import { useTranslations } from "next-intl";
import BackToTop from "./BackToTop";
import FooterLink from "./FooterLink";
import { usePathname } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/futures") ? "/futures" : "/forex";

  const footerLinks = [
    {
      title: t("propFirms"),
      links: [
        { label: t("allPropFirms"), href: basePath },
        { label: t("compareChallenges"), href: `${basePath}/challenges?size=100000&in_steps=STEP1` },
      ],
    },
    {
      title: t("offers"),
      links: [
        { label: t("exclusiveOffers"), href: `${basePath}/exclusive-offers` },
        { label: t("allCurrentOffers"), href: `${basePath}/offers` },
        { label: t("highImpactNews"), href: `${basePath}/high-impact-news` },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("aboutUs"), href: `${basePath}/about` },
        { label: t("faq"), href: `${basePath}/faq` },
        { label: t("contactUs"), href: `${basePath}/contact` },
      ],
    },
  ];

  const legalLinks = [
    { label: t("privacyPolicy"), href: `${basePath}/privacy-policy` },
    { label: t("termsConditions"), href: `${basePath}/terms-and-conditions` },
  ];

  const iconSize = 26;
  const socialLinks = [
    { icon: <AiOutlineDiscord size={iconSize} />, href: "https://discord.com/invite/FundedForYou" },
    { icon: <FiYoutube size={iconSize} />, href: "https://www.youtube.com/@hassan.chami.funded?sub_confirmation=1" },
    { icon: <Instagram size={iconSize} />, href: "https://www.instagram.com/fundedforyou?igsh=NHByYjFuNGJ5b2Rx" },
    { icon: <PiTiktokLogo size={iconSize} />, href: "https://www.tiktok.com/@fundedforyou?_r=1&_t=ZS-94Ktsspx8gZ" },
    { icon: <FaXTwitter size={iconSize} />, href: "https://x.com/Fundedforyou" },
  ];

  return (
    <div className="bg-foreground">
      <div className="px-2 relative bg-background/95">
        <div className="bg-primary/30 absolute w-50 aspect-square rounded-full right-5 bottom-5 blur-3xl"></div>
        <div className="flex justify-center w-full h-full absolute top-0 left-0 flex-col gap-20">
          <div className="bg-primary/30 w-[60vw] h-20 rounded-full right-5 bottom-5 blur-[80px] ml-auto mr-20"></div>
          <div className="bg-primary/30 w-[60vw] h-20 rounded-full blur-[80px]"></div>
        </div>

        <Container className="text-foreground relative overflow-hidden">
          <div className="py-12 md:py-16 relative z-10">

            {/* Main grid: logo col + 3 link cols */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-6">

              {/* Brand column */}
              <div className="flex flex-col gap-5 items-center lg:items-start">
                <div className="flex flex-col items-center lg:items-start">
                  <NavbarLogo
                    logoClassName="h-14 md:h-18"
                    textClassName="text-lg sm:text-xl"
                    isScrolled={false}
                  />
                </div>

                {/* Social icons */}
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-3">
                    {t("socialLinks")}
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                    {socialLinks.map((social, i) => (
                      <FooterLink
                        key={i}
                        href={social.href}
                        target="_blank"
                        className="text-foreground/60 hover:text-primary hover:scale-110 transition-all duration-150"
                      >
                        {social.icon}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* Link columns */}
              {footerLinks.map((section, index) => (
                <div key={index} className="flex flex-col gap-3 items-center lg:items-start">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/90">
                    {section.title}
                  </h3>
                  <div className="flex flex-col gap-2.5 items-center lg:items-start">
                    {section.links.map((link, i) => (
                      <FooterLink
                        key={i}
                        href={link.href}
                        className="text-foreground/55 hover:text-foreground text-sm transition-colors hover:translate-x-0.5 inline-block"
                      >
                        {link.label}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-foreground/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5">
              <p className="text-foreground/40 text-xs" dir="auto">
                {t("copyright")}
              </p>
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {legalLinks.map((link, i) => (
                  <FooterLink
                    key={i}
                    href={link.href}
                    className="text-foreground/40 hover:text-foreground text-xs transition-colors"
                  >
                    {link.label}
                  </FooterLink>
                ))}
                <div className="h-3 border-r border-foreground/20" />
                <BackToTop />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
