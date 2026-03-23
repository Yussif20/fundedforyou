"use client";

import dynamic from "next/dynamic";

const CoinScene = dynamic(() => import("@/components/3d/CoinScene"), {
  ssr: false,
});

export default function SubscribeCoinClient() {
  return (
    <div className="absolute right-4 bottom-0 w-[72px] h-[72px] md:w-[96px] md:h-[96px] lg:w-[120px] lg:h-[120px] xl:w-[144px] xl:h-[144px] 2xl:w-[160px] 2xl:h-[160px] pointer-events-none opacity-50 md:opacity-55 lg:opacity-60 hidden md:block">
      <CoinScene className="w-full h-full" />
    </div>
  );
}
