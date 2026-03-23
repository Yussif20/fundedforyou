import Spreads from "@/components/Forex_Features/Spreads/Spreads";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Prop Firm Spreads — Forex, Crypto, Indices & Metals",
  description:
    "Compare live spreads across prop trading firms for Forex, Crypto, Indices, and Metals. Find the tightest spreads for your trading strategy.",
};

export default function page() {
  return (
    <div className="pb-20 md:pb-30">
      <Spreads />
    </div>
  );
}
