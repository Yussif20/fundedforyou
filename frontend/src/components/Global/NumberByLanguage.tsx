// components/ArabicNumber.tsx
"use client";

import useIsArabic from "@/hooks/useIsArabic";

type ArabicNumberProps = {
  children: number | string | bigint;
  className?: string;
  percent?: boolean;
  numberTitle?: string;
};

const toArabicDigits = (num: number | string | bigint) => {
  const map: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
  };

  return num
    .toString()
    .split("")
    .map((c) => map[c] || c)
    .join("");
};

export default function NumberByLanguage({
  children,
  className,
  percent,
  numberTitle,
}: ArabicNumberProps) {
  const isArabic = useIsArabic();
  return (
    <>
      {numberTitle && isArabic && <span> {numberTitle} </span>}
      <span className={className}>
        {isArabic ? toArabicDigits(children) : children}
        {percent && (isArabic ? "٪" : "%")}{" "}
      </span>
      {numberTitle && !isArabic && <span> {numberTitle} </span>}
    </>
  );
}
