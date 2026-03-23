"use client";

import dynamic from "next/dynamic";
import Logo from "@/utils/Logo";

const CoinScene = dynamic(() => import("@/components/3d/CoinScene"), {
  ssr: false,
  loading: () => <Logo />,
});

export default function HeroCoinClient() {
  return <CoinScene className="w-full h-full" />;
}
