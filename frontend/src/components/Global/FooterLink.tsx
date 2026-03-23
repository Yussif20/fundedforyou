"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

function waitForElement(
  id: string,
  callback: (element: HTMLElement) => void,
  maxAttempts = 50
) {
  let attempts = 0;
  const check = () => {
    const element = document.getElementById(id);
    if (element) {
      callback(element);
    } else if (attempts < maxAttempts) {
      attempts++;
      requestAnimationFrame(check);
    }
  };
  requestAnimationFrame(check);
}

function scrollToTabsSection() {
  const isAtTop = window.scrollY < 100;

  waitForElement("tabs-section", (tabsSection) => {
    const navbarOffset = isAtTop ? 400 : 200;
    const elementPosition =
      tabsSection.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - navbarOffset,
      behavior: "smooth",
    });
  });
}

const SECTION_IDS: Record<string, string> = {
  "best-sellers": "best-sellers-section",
  "high-impact-news": "high-impact-news-section",
  // about and contact intentionally omitted — scroll to top of page
};

export default function FooterLink({
  href,
  children,
  className,
  target,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
}) {
  const router = useRouter();
  const isExternal = href.startsWith("http");

  // External links (social, etc.) open in a new tab without custom scrolling.
  if (target === "_blank" || isExternal) {
    return (
      <a
        href={href}
        target={target || "_blank"}
        rel="noopener noreferrer"
        className={cn(className)}
      >
        {children}
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const rawPath = href || "/";
    const targetPath =
      rawPath === "/" ? "/" : rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    // Strip query params for path matching, keep full targetPath for navigation
    const cleanPath = targetPath.split("?")[0].replace(/^\//, "");

    // For tabbed sections, mimic navbar behavior:
    // navigate, then scroll precisely to #tabs-section with dynamic offset.
    if (
      cleanPath === "forex" ||
      cleanPath === "futures" ||
      cleanPath.endsWith("/challenges") ||
      cleanPath.endsWith("/offers") ||
      cleanPath.endsWith("/exclusive-offers")
    ) {
      router.push(targetPath, { scroll: false });
      scrollToTabsSection();
      return;
    }

    router.push(targetPath, { scroll: false });

    const sectionId = SECTION_IDS[cleanPath];
    if (sectionId) {
      // Wait for the section element to appear in the DOM (RSC renders it),
      // then scroll to it — data will load into the already-visible section.
      waitForElement(sectionId, (el) => {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      });
    } else {
      // Fallback for pages without a known section ID (e.g. home).
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 200);
    }
  };

  return (
    <Link href={href || "/"} className={cn(className)} onClick={handleClick}>
      {children}
    </Link>
  );
}
