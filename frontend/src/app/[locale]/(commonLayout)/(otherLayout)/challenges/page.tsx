import { Suspense } from "react";
import Challenges from "@/components/Forex_Features/Challenges/Challenges";
import TableSkeleton from "@/components/Global/TableSkeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Prop Firm Challenges — Account Sizes, Steps & Rules",
  description:
    "Compare prop trading firm challenges side by side. Filter by account size, profit target, loss limits, and rules to find your ideal funded account challenge.",
};

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale } = await params;
  const resolvedParams = await searchParams;
  return (
    <Suspense fallback={<TableSkeleton />}>
      <Challenges locale={locale} initialSearchParams={resolvedParams} />
    </Suspense>
  );
}
