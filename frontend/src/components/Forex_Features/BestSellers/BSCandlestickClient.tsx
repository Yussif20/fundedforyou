"use client";

import dynamic from "next/dynamic";

const SingleCandlestickScene = dynamic(
  () => import("@/components/3d/SingleCandlestickScene"),
  { ssr: false }
);

export default function BSCandlestickClient() {
  return (
    <div className="absolute right-0 top-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 opacity-10 md:opacity-12 lg:opacity-15 pointer-events-none hidden md:block">
      <SingleCandlestickScene className="w-full h-full" variant={2} scale={1.2} rotationSpeed={0.1} />
    </div>
  );
}
