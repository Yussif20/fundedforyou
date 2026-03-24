"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { visibleText } from "@/utils/visibleText";

export default function DiscountCard({
  discount,
}: {
  discount: {
    code: string;
    description: string;
    offerPercentage: number;
    discountType?: "PERCENTAGE" | "TEXT";
    discountText?: string;
    discountTextArabic?: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const locale = useLocale();
  const isArabic = locale === "ar";
  const isTextType = discount.discountType === "TEXT";
  const textContent = isTextType ? visibleText(isArabic, discount.discountText, discount.discountTextArabic) : "";

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!discount.code) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(discount.code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = discount.code;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        onClick={handleCopy}
        className="w-[100px] h-[60px] flex flex-col items-center justify-center gap-1.5 px-3.5 rounded-xl
          bg-gradient-to-b from-primary/90 to-primary/60
          border border-primary/40 shadow-sm shadow-primary/20
          cursor-pointer select-none
          hover:shadow-md hover:shadow-primary/30 hover:scale-105
          transition-all duration-200"
      >
        <span
          className={cn(
            "inline-flex items-baseline gap-0.5 text-primary-foreground tracking-wider leading-none uppercase",
            isArabic && "flex-row-reverse"
          )}
        >
          {isTextType ? (
            <span className="text-xs font-bold">{textContent}</span>
          ) : (
            <>
              <span className="text-base font-bold tabular-nums">{discount.offerPercentage}%</span>
              <span className="text-sm font-bold">{isArabic ? "خصم" : "OFF"}</span>
            </>
          )}
        </span>
        {discount.code && (
          <div className="flex items-center gap-1.5 bg-background/85 rounded-md px-2.5 py-1">
            <span className="text-[11px] font-semibold tracking-wide">{discount.code}</span>
            {copied ? (
              <Check size={10} className="text-primary shrink-0" />
            ) : (
              <Copy size={10} className="text-foreground/50 shrink-0" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
