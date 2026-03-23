"use client";
import useIsFutures from "@/hooks/useIsFutures";
import { Link, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/utils/Logo";

interface NavbarLogoProps {
  isScrolled: boolean;
  logoClassName?: string;
  textClassName?: string;
}

export default function NavbarLogo({
  isScrolled,
  logoClassName,
  textClassName,
}: NavbarLogoProps) {
  const isFutures = useIsFutures();
  const homeHref = isFutures ? "/futures" : "/forex";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOnHome = pathname?.endsWith(homeHref);
  const hasSearchParams = searchParams.toString().length > 0;

  const handleClick = (e: React.MouseEvent) => {
    // Only scroll-to-top if on the clean home page (no query params)
    // Otherwise, let the Link navigate normally to clear params like ?page=2
    if (!isOnHome || hasSearchParams) return;

    e.preventDefault();

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link href={homeHref} onClick={handleClick}>
      <div className="w-max flex items-center" dir="ltr">
        <div
          className={cn(
            `aspect-8/9 ${isScrolled ? "h-6 md:h-9" : "h-12 md:h-16"} relative`,
            logoClassName
          )}
        >
          <Logo />
        </div>
        {!isScrolled && (
          <h2
            className={cn(
              "font-bold text-sm sm:text-base md:text-lg md:text-xl",
              textClassName
            )}
          >
            Funded For You
          </h2>
        )}
      </div>
    </Link>
  );
}
