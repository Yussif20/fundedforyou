import { Suspense } from "react";
import Firms from "@/components/Forex_Features/Firms/Firms";
import TableSkeleton from "@/components/Global/TableSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Prop Trading Firms — Forex & Futures",
  description:
    "Compare the best prop trading firms for Forex and Futures. Filter by account size, profit split, rules, and more to find your perfect funded account.",
};

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedParams = await searchParams;
  return (
    <>
      <Suspense fallback={<TableSkeleton />}>
        <Firms initialSearchParams={resolvedParams} />
      </Suspense>
    </>
  );
}
