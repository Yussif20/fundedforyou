"use client";

import dynamic from "next/dynamic";

const CandlestickScene = dynamic(
  () => import("@/components/3d/CandlestickScene"),
  { ssr: false }
);

export default function CandlestickSectionClient() {
  return (
    <div className="w-full h-[280px] sm:h-[360px] md:h-[460px] lg:h-[520px] xl:h-[580px] 2xl:h-[640px]">
      <CandlestickScene className="w-full h-full" />
    </div>
  );
}
