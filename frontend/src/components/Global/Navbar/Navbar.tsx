"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "@/i18n/navigation";
import { useCurrentUser } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Container from "../Container";
import ForexFeatureToggle from "../ForexFeatureToggle";
import NavProfile from "../NavProfile";
import NavbarLogo from "./NavbarLogo";
import NavItems from "./NavItems";
import NavLanguageChange from "./NavLanguageChange";

// import ThemeToggle from "../ThemeToggle";
import WebToggler from "./WebToggler";

const MOBILE_BREAKPOINT = 768;

const Navbar = () => {
  const t = useTranslations("Navbar");
  const userData = useAppSelector(useCurrentUser);
  const isLogIn = userData?.id;
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () =>
      setIsMobile(
        typeof window !== "undefined" && (window.innerWidth < MOBILE_BREAKPOINT || window.innerHeight < 500),
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${el.offsetHeight}px`,
      );
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isScrolled, isMobile]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Hysteresis: different thresholds for going down vs going up
          if (scrollY > 100 && !isScrolledRef.current) {
            isScrolledRef.current = true;
            setIsScrolled(true);
          } else if (scrollY < 50 && isScrolledRef.current) {
            isScrolledRef.current = false;
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky z-50 w-full top-0 transition-all duration-150 ${
        isScrolled ? "py-2 bg-background/80 backdrop-blur-sm" : "py-6"
      }`}
    >
      <Container
        className={cn(isMobile && isScrolled && "!px-3 tablet:!ps-5 tablet:!pe-5")}
      >
        <div className="">
          <div className="grid grid-cols-3 items-center">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className={`hidden tablet:block transition-all duration-150 ease-out ${
                  isScrolled
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8 absolute pointer-events-none"
                }`}
              >
                <NavbarLogo isScrolled={isScrolled} />
              </div>

              <div className="flex items-center gap-2 sm:gap-4 transition-all duration-150">
                <WebToggler />
                <div className="tablet:hidden">
                  <NavLanguageChange />
                </div>
              </div>
            </div>

            {/* Center Section */}
            <div className="relative flex items-center justify-center">
              {/* Logo (Main State) */}
              <div
                className={`transition-all duration-150 ease-out ${
                  !isScrolled
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-8 absolute pointer-events-none"
                }`}
              >
                <NavbarLogo isScrolled={isScrolled} />
              </div>

              {/* Feature Toggle (Scrolled State) - smaller on mobile only */}
              <div
                className={`transition-all duration-150 ease-out ${
                  isScrolled
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 absolute pointer-events-none"
                }`}
              >
                <ForexFeatureToggle compact={isMobile} />
              </div>
            </div>

            {/* Right Actions */}

            <div className="flex items-center justify-end gap-1 tablet:gap-2 lg:gap-3">
              <div className="hidden tablet:block">
                <NavLanguageChange />
              </div>
              {/* <ThemeToggle variant="ghost" size="icon" className="h-9 w-9 shrink-0" /> */}

              {isLogIn ? (
                <>
                  <div className="tablet:hidden flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Menu className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-44 p-1.5">
                        <nav className="flex flex-col">
                          {[
                            { label: t("home"), href: "/" },
                            { label: t("offers"), href: "/offers" },
                            { label: t("challenges"), href: "/challenges?size=100000&in_steps=STEP1" },
                            { label: t("spreads"), href: "/spreads" },
                            { label: t("faq"), href: "/faq" },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="text-foreground/70 hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </nav>
                      </PopoverContent>
                    </Popover>
                    <NavProfile />
                  </div>
                  <div className="hidden tablet:block">
                    <NavProfile />
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden tablet:flex items-center justify-end gap-2 lg:gap-3">
                    <Link className="hidden sm:block" href="/auth/sign-in">
                      <Button
                        variant="outline"
                        className="h-9 px-4! font-bold transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                      >
                        {t("signIn")}
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button className="h-9 px-2 sm:px-4! font-bold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]">
                        {t("signUp")}
                      </Button>
                    </Link>
                  </div>
                  <div className="tablet:hidden">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Menu className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-44 p-1.5">
                        <nav className="flex flex-col">
                          {[
                            { label: t("home"), href: "/" },
                            { label: t("offers"), href: "/offers" },
                            { label: t("challenges"), href: "/challenges?size=100000&in_steps=STEP1" },
                            { label: t("spreads"), href: "/spreads" },
                            { label: t("faq"), href: "/faq" },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="text-foreground/70 hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </nav>
                        <div className="h-px bg-border my-1.5" />
                        <div className="flex flex-col gap-1.5 px-1">
                          <Link href="/auth/sign-in">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full font-semibold"
                            >
                              {t("signIn")}
                            </Button>
                          </Link>
                          <Link href="/auth/sign-up">
                            <Button
                              size="sm"
                              className="w-full font-semibold"
                            >
                              {t("signUp")}
                            </Button>
                          </Link>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Feature Toggle Below (Normal State) - smaller on mobile only */}
          <div
            className={`flex justify-center items-center  transition-all duration-500 ease-in-out overflow-hidden mb-3  ${
              !isScrolled
                ? "opacity-100 max-h-20 mt-4 mb-4"
                : "opacity-0 max-h-0"
            }`}
          >
            <ForexFeatureToggle compact={isMobile} />
          </div>

          <div className="hidden tablet:block">
            <NavItems />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
