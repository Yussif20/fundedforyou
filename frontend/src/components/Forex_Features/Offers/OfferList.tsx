"use client";
import { EmptyState, ErrorState } from "@/components/Global/Error";
import { Pagination } from "@/components/Global/Pagination";
import { PaginationSkeleton } from "@/components/Global/Skeleton";
import { useGetAllOffersQuery } from "@/redux/api/offerApi";
import { Package } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SingleOffer from "./SingleOffer";
import { OfferListSkeleton } from "./Skeleton";
import useIsFutures from "@/hooks/useIsFutures";
import { useMemo, useEffect } from "react";

export default function OfferList({ companySlug }: { companySlug?: string }) {
  const isFutures = useIsFutures();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page") || 1);
  const searchTerm = searchParams.get("search") || "";
  const isExclusive = pathname.includes("exclusive-offers");
  const isCurrentMonth = searchParams.get("isCurrentMonth") === "true";

  // When on exclusive offers, reset page to 1 so pagination doesn't stick from "all offers"
  useEffect(() => {
    if (isExclusive && currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      const query = params.toString();
      router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
    }
  }, [isExclusive, currentPage, pathname, router, searchParams.toString()]);

  // Build filter parameters from URL query params with useMemo to ensure recalculation
  const filterParams = useMemo(() => {
    const params: {
      page: number;
      limit: number;
      searchTerm?: string;
      isExclusive?: boolean;
      isCurrentMonth?: boolean;
      firmType: string;
      slug?: string;
    } = {
      page: currentPage,
      limit: 10,
      firmType: isFutures ? "FUTURES" : "FOREX",
    };

    // Add search term if exists
    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    // Always add filter parameters to ensure different cache keys
    params.isExclusive = isExclusive;
    params.isCurrentMonth = isCurrentMonth;

    if (companySlug) {
      params.slug = companySlug;
    }
    return params;
  }, [currentPage, searchTerm, isExclusive, isCurrentMonth, isFutures, companySlug]);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllOffersQuery(filterParams, {
      refetchOnMountOrArgChange: 0.01,
      skip: false,
    });

  // Force refetch when filter params change
  useEffect(() => {
    refetch();
  }, [isExclusive, isCurrentMonth, refetch]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <OfferListSkeleton count={3} />
        <PaginationSkeleton pageCount={5} />
      </div>
    );
  }

  // Error state with retry
  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        type={
          error &&
          typeof error === "object" &&
          "status" in error &&
          error.status === "FETCH_ERROR"
            ? "network"
            : "generic"
        }
      />
    );
  }

  // Empty state
  if (!data?.firms || data.firms.length === 0) {
    return (
      <EmptyState
        icon={<Package className="w-12 h-12 text-muted-foreground/60" />}
        title="No offers available"
        description="There are currently no offers matching your criteria. Please check back later."
      />
    );
  }

  // Pagination: only show when we have more than one page for the current view.
  // For exclusive offers, treat as 1 page when this page's results don't fill the limit (so we never show "all offers" page count).
  // Hide while fetching so we never show stale pagination from the other tab.
  const limit = filterParams.limit;
  const totalPage =
    isExclusive && data.firms.length <= limit
      ? 1
      : (data.meta?.totalPage ?? 1);
  const showPagination =
    !isFetching && totalPage > 1 && data.meta != null;

  return (
    <div className="space-y-8">
      {/* Offers List */}
      <div className="space-y-4">
        {data.firms.map((firm, idx) => (
          <SingleOffer
            key={firm.id}
            data={firm}
            index={idx}
            totalCount={data.firms.length}
            prevFirm={data.firms[idx - 1]}
            nextFirm={data.firms[idx + 1]}
          />
        ))}
      </div>

      {/* Loading overlay for refetching */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg text-sm animate-pulse">
          Refreshing...
        </div>
      )}

      {/* Pagination: only for current view, hidden when 1 page or when data is stale */}
      {showPagination && (
        <Pagination totalPages={totalPage} />
      )}
    </div>
  );
}
