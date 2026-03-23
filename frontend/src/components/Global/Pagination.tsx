"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { handleSetSearchParams } from "@/lib/utils";
import { useTranslations } from "next-intl";
import useIsArabic from "@/hooks/useIsArabic";
import { useEffect, useState } from "react";

interface PaginationWithParamsProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationWithParamsProps) {
  const isArabic = useIsArabic();
  const t = useTranslations("Pagination");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentPage = Number(searchParams.get("page") || 1);

  const createPageURL = (pageNumber: number | string) => {
    handleSetSearchParams(
      { page: pageNumber.toString() },
      searchParams,
      router,
    );
  };

  const scrollToSectionStart = () => {
    const el = document.getElementById("tabs-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (page: number) => {
    createPageURL(page);
    scrollToSectionStart();
  };

  if (totalPages < 2) {
    return "";
  }

  // Show fewer pages on mobile for better responsiveness
  // Mobile: 5 pages (2 before + current + 2 after)
  // Desktop: 10 pages (4 before + current + 5 after)
  const WINDOW = isMobile ? 5 : 10;
  const BEFORE = isMobile ? 2 : 4;
  let windowStart = Math.max(1, currentPage - BEFORE);
  let windowEnd = windowStart + WINDOW - 1;
  if (windowEnd > totalPages) {
    windowEnd = totalPages;
    windowStart = Math.max(1, windowEnd - WINDOW + 1);
  }
  const visiblePages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i,
  );

  // Always include page 1; add ellipsis if window doesn't start at 1
  const showLeadingEllipsis = windowStart > 2;
  const showPage1Separately = windowStart > 1;

  return (
    <div className="flex items-center justify-center gap-0.5 sm:gap-1 max-w-full px-1">
      <button
        className={`
          h-9 sm:h-11 px-2 sm:px-5 flex items-center justify-center shrink-0
          border border-primary/30 font-bold text-xs sm:text-base
          transition-all duration-200 ease-out
          hover:bg-primary/10 hover:text-primary hover:border-primary/60
          ${currentPage === 1 ? "cursor-not-allowed opacity-40" : "hover:-translate-y-0.5 active:translate-y-0"}
          ${isArabic ? "rounded-r-xl sm:rounded-r-2xl" : "rounded-l-xl sm:rounded-l-2xl"}
        `}
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        {t("previous")}
        <span className="sr-only">{t("previousPage")}</span>
      </button>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {showPage1Separately && (
          <button
            className={`
              relative h-9 sm:h-11 min-w-9 sm:min-w-11 px-2 sm:px-3 flex items-center justify-center rounded-lg sm:rounded-xl shrink-0
              border font-bold text-xs sm:text-base transition-all duration-200 ease-out
              ${
                currentPage === 1
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-105"
                  : "border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
            onClick={() => goToPage(1)}
          >
            <span className="relative z-10">1</span>
          </button>
        )}
        {showLeadingEllipsis && (
          <span className="h-9 sm:h-11 min-w-6 sm:min-w-8 flex items-center justify-center text-xs sm:text-base font-bold text-muted-foreground">
            ...
          </span>
        )}
        {visiblePages.map((page) => (
          <button
            className={`
              relative h-9 sm:h-11 min-w-9 sm:min-w-11 px-2 sm:px-3 flex items-center justify-center rounded-lg sm:rounded-xl shrink-0
              border font-bold text-xs sm:text-base transition-all duration-200 ease-out
              ${
                currentPage === page
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-105"
                  : "border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
            key={`page-${page}`}
            onClick={() => goToPage(page)}
          >
            <span className="relative z-10">{page}</span>
          </button>
        ))}
      </div>

      <button
        className={`
          h-9 sm:h-11 px-2 sm:px-5 flex items-center justify-center shrink-0
          border border-primary/30 font-bold text-xs sm:text-base
          transition-all duration-200 ease-out
          hover:bg-primary/10 hover:text-primary hover:border-primary/60
          ${currentPage === totalPages ? "cursor-not-allowed opacity-40" : "hover:-translate-y-0.5 active:translate-y-0"}
          ${isArabic ? "rounded-l-xl sm:rounded-l-2xl" : "rounded-r-xl sm:rounded-r-2xl"}
        `}
        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        {t("next")}
        <span className="sr-only">{t("nextPage")}</span>
      </button>
    </div>
  );
}
