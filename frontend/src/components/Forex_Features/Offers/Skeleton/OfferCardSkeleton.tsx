import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OfferCardSkeletonProps {
  showTag?: boolean;
  hideBlackHoles?: boolean;
}

export default function OfferCardSkeleton({
  showTag = false,
  hideBlackHoles = true,
}: OfferCardSkeletonProps) {
  return (
    <Card className="border-foreground/30 p-3 lg:p-6 bg-foreground/10 flex flex-col gap-8 relative">
      {/* Black holes decoration */}
      {!hideBlackHoles && (
        <div className="absolute border-r-2 top-0 min-h-full border-foreground/5 border-dashed left-75 hidden lg:block w-0">
          <div className="absolute -top-6 w-9 h-12 rounded-full bg-background -left-4"></div>
          <div className="absolute -bottom-6 w-9 h-12 rounded-full bg-background -left-4"></div>
        </div>
      )}

      {/* Main Card Content */}
      <CardContent className="px-0 flex gap-y-3 flex-col lg:flex-row">
        {/* Mobile Layout */}
        <MobileOfferCardSkeleton />
        {/* Mobile Layout */}

        {/* Desktop Layout */}
        <div className="flex justify-between items-center w-full h-max">
          {/* Discount Card - Desktop */}
          <div className="flex items-center justify-center">
            <Card className="h-12 sm:h-16 lg:h-20 aspect-5/2 flex-col justify-center items-center gap-y-1 bg-transparent relative rounded-2xl hidden lg:flex border-foreground/30">
              {/* Fire Icon Button */}
              <Skeleton className="rounded-bl-none rounded-tr-none rounded-tl-xl rounded-br-2xl absolute top-0 left-0 h-5 w-5 sm:w-7 sm:h-7" />

              {/* Percentage Text */}
              <Skeleton className="h-4 sm:h-5 lg:h-5 w-16 sm:w-20 lg:w-24" />

              {/* Gift Badge */}
              <div className="px-2 md:py-0.5 lg:py-1 bg-foreground/10 max-w-max rounded-full flex justify-center items-center gap-1 md:gap-1.5">
                <Skeleton className="h-3 lg:h-4 w-3 lg:w-4 rounded-full" />
                <Skeleton className="h-3 lg:h-4 w-12 sm:w-16 lg:w-20" />
                <Skeleton className="h-3 lg:h-4 w-3 lg:w-4 rounded-full" />
              </div>
            </Card>

            {/* Company Data - Desktop */}
            <div className="hidden lg:flex items-center gap-1.5 md:gap-2.5 md:ml-[50px]">
              <div className="bg-foreground/35 max-w-max p-1.5 md:p-2.5 rounded-full">
                <Skeleton className="w-4 md:w-7 xl:w-9 aspect-square rounded-full" />
              </div>
              <Skeleton className="h-6 w-32 xl:w-40 " />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5 justify-end ml-auto lg:ml-0">
            {/* Tag Button */}
            {showTag && <Skeleton className="h-8 w-16 rounded-full" />}

            {/* Code MATCH Button */}
            <Skeleton className="h-8 w-32 sm:w-36 md:w-40 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const MobileOfferCardSkeleton = () => {
  return (
    <>
      {/* Mobile Layout */}
      <div className="flex justify-between items-center">
        {/* Company Data - Mobile */}
        <div className="flex items-center gap-1.5 md:gap-2.5 lg:hidden">
          <div className="bg-primary3 max-w-max p-1.5 md:p-2.5 rounded-full">
            <Skeleton className="w-4 md:w-7 xl:w-9 aspect-square rounded-full" />
          </div>
          <Skeleton className="h-5 w-24 sm:w-32 md:w-40" />
        </div>

        {/* Discount Card - Mobile */}
        <Card className="h-12 sm:h-16 lg:h-20 aspect-5/2 flex flex-col justify-center items-center gap-y-1 bg-transparent relative rounded-2xl lg:hidden">
          {/* Fire Icon Button */}
          <Skeleton className="rounded-bl-none rounded-tr-none rounded-tl-xl rounded-br-2xl absolute top-0 left-0 h-5 w-5 sm:w-7 sm:h-7" />

          {/* Percentage Text */}
          <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />

          {/* Gift Badge */}
          <div className="px-2 md:py-0.5 lg:py-1 bg-foreground/10 max-w-max rounded-full flex justify-center items-center gap-1 md:gap-1.5">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-12 sm:w-16" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Divider - Mobile */}
      <div className="w-full border-b border-foreground/20 block lg:hidden"></div>
    </>
  );
};
