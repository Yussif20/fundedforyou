import { Suspense } from "react";
import Offers from "@/components/Forex_Features/Offers/Offers";
import TableSkeleton from "@/components/Global/TableSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exclusive Prop Firm Offers & Discounts",
  description:
    "Discover exclusive deals and limited-time offers from top prop trading firms. Get the best discounts on funded account challenges.",
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
