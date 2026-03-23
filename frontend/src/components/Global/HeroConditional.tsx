"use client";

import { usePathname } from "@/i18n/navigation";
import Hero from "@/components/Global/hero";

const PAGES_WITHOUT_HERO = ["about", "contact", "high-impact-news", "terms-and-conditions", "privacy-policy"];

export default function HeroConditional() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "";
  if (PAGES_WITHOUT_HERO.includes(lastSegment)) return null;
  return <Hero />;
}
