import HighImpactNews from "@/components/Forex_Features/HighImpactNews/HighImpactNews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "High Impact Financial News & Events",
  description:
    "Stay updated with high-impact financial news and economic events that affect Forex and Futures markets. Plan your trades around key announcements.",
};

export default function page() {
  return (
    <div className="">
      <HighImpactNews />
    </div>
  );
}
