"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex items-center gap-1.5 text-foreground/50 hover:text-foreground transition-colors text-xs"
      aria-label="Back to top"
    >
      <ArrowUp size={14} />
      Back to top
    </button>
  );
}
