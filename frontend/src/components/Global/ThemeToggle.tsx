"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeValue = "light" | "dark" | "system";

export default function ThemeToggle({
  variant = "ghost",
  size = "icon",
  className,
  showDropdown = true,
}: {
  variant?: "ghost" | "outline";
  size?: "icon" | "sm" | "default" | "lg";
  className?: string;
  /** If false, renders a simple icon button that toggles light/dark only (no system). */
  showDropdown?: boolean;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations("Navbar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme as ThemeValue) || "dark";
  const isDark = resolvedTheme === "dark";

  const triggerIcon = () => {
    if (currentTheme === "system") return <Monitor className="h-5 w-5" aria-hidden />;
    return isDark ? (
      <Moon className="h-5 w-5" aria-hidden />
    ) : (
      <Sun className="h-5 w-5" aria-hidden />
    );
  };

  const triggerLabel = currentTheme === "system"
    ? t("systemTheme")
    : isDark
      ? t("switchToLightTheme")
      : t("switchToDarkTheme");

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        aria-hidden
        tabIndex={-1}
      >
        <span className="h-5 w-5" />
      </Button>
    );
  }

  if (!showDropdown) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={triggerLabel}
        title={triggerLabel}
      >
        {isDark ? (
          <Sun className="h-5 w-5" aria-hidden />
        ) : (
          <Moon className="h-5 w-5" aria-hidden />
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label={triggerLabel}
          title={triggerLabel}
        >
          {triggerIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup
          value={currentTheme}
          onValueChange={(value) => setTheme(value as ThemeValue)}
        >
          <DropdownMenuRadioItem value="light" className="gap-2">
            <Sun className="h-4 w-4" />
            {t("lightTheme")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2">
            <Moon className="h-4 w-4" />
            {t("darkTheme")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="gap-2">
            <Monitor className="h-4 w-4" />
            {t("systemTheme")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
