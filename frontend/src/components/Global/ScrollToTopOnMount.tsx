 "use client";

import { useEffect } from "react";

export default function ScrollToTopOnMount() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return null;
}

