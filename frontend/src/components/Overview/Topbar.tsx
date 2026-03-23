"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/utils/Logo";
import NavLanguageChange from "../Global/Navbar/NavLanguageChange";
import NavProfile from "../Global/NavProfile";

const Topbar = ({ isOpen }: { isOpen: boolean }) => {
  const { isLoading } = useGetMeQuery(undefined);

  const headerClassName = cn(
    "h-16 fixed top-0 left-0 w-full z-50 transition-[padding] duration-300 pl-16",
    "bg-card/95 backdrop-blur-sm border-b border-border/80",
    "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2)]",
    isOpen && "md:pl-64"
  );

  if (isLoading) {
    return (
      <header className={headerClassName}>
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerClassName}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <Link href="/" className="flex items-center shrink-0" aria-label="Home">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 aspect-square overflow-hidden rounded-md" dir="ltr">
            <Logo />
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLanguageChange triggerClassName="h-9 w-9 shrink-0" />
          <NavProfile />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
