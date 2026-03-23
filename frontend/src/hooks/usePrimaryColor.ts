"use client";

import { useState, useEffect } from "react";

export function usePrimaryColor() {
  const [primary, setPrimary] = useState("#059666");
  const [primaryDark, setPrimaryDark] = useState("#087951");

  useEffect(() => {
    const update = () => {
      const style = getComputedStyle(document.documentElement);
      const p = style.getPropertyValue("--primary").trim();
      const d = style.getPropertyValue("--primary-dark").trim();
      if (p) setPrimary(p);
      if (d) setPrimaryDark(d);
    };

    update();

    // Re-run whenever the theme class on <html> changes (forex ↔ futures)
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return { primary, primaryDark };
}
