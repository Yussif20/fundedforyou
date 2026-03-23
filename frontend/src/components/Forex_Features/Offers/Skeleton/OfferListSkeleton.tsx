import OfferCardSkeleton from "./OfferCardSkeleton";

interface OfferListSkeletonProps {
  count?: number;
  showTag?: boolean;
  hideBlackHoles?: boolean;
}

export default function OfferListSkeleton({
  count = 3,
  showTag = false,
  hideBlackHoles = false,
}: OfferListSkeletonProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <OfferCardSkeleton
          key={index}
          showTag={showTag}
          hideBlackHoles={hideBlackHoles}
        />
      ))}
    </div>
  );
}
