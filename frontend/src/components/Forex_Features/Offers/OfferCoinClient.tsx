"use client";

import dynamic from "next/dynamic";

const CoinScene = dynamic(() => import("@/components/3d/CoinScene"), {
  ssr: false,
});

export default function OfferCoinClient() {
  return (
    <div className="absolute right-6 lg:right-10 bottom-0 w-[52px] h-[52px] lg:w-[60px] lg:h-[60px] xl:w-[72px] xl:h-[72px] 2xl:w-[88px] 2xl:h-[88px] pointer-events-none opacity-40 lg:opacity-45 xl:opacity-50 hidden lg:block">
      <CoinScene className="w-full h-full" />
    </div>
  );
}
