import BestSellers from "@/components/Forex_Features/BestSellers/BestSellers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Most Popular Prop Trading Firms",
  description:
    "See the most popular and highest-rated prop trading firms. Rankings based on trader preferences, challenge quality, and firm reliability.",
};

export default function page() {
  return (
    <>
      <BestSellers />
    </>
  );
}
