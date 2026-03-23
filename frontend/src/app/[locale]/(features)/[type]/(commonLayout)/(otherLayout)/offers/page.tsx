import { Suspense } from "react";
import Offers from "@/components/Forex_Features/Offers/Offers";
import TableSkeleton from "@/components/Global/TableSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prop Firm Offers & Discounts",
  description:
    "Browse the latest prop trading firm offers, discount codes, and promotions. Save on funded account challenges from top firms.",
};

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedParams = await searchParams;
  return (
    <Suspense fallback={<TableSkeleton />}>
      <Offers initialSearchParams={resolvedParams} />
    </Suspense>
  );
}
