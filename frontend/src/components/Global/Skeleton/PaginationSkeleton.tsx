import { Skeleton } from "@/components/ui/skeleton";

interface PaginationSkeletonProps {
  pageCount?: number;
}

export default function PaginationSkeleton({
  pageCount = 5,
}: PaginationSkeletonProps) {
  return (
    <div className="flex items-center justify-center">
      {/* Previous Button Skeleton */}
      <Skeleton className="h-10 w-20 rounded-l-full" />

      {/* Page Number Buttons Skeleton */}
      <div className="flex items-center">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <Skeleton
            key={`page-skeleton-${page}`}
            className="h-10 w-10 rounded-none"
          />
        ))}
      </div>

      {/* Next Button Skeleton */}
      <Skeleton className="h-10 w-16 rounded-r-full" />
    </div>
  );
}
