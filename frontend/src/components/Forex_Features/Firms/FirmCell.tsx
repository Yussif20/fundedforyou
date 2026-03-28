"use client";
import { TableCell } from "@/components/ui/table";
import useIsArabic from "@/hooks/useIsArabic";
import useIsFutures from "@/hooks/useIsFutures";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

export default function FirmCell({
  company,
  userRole,
}: {
  company: { slug: string; image: string | StaticImageData; name: string; notes?: string };
  userRole?: string;
}) {
  const isArabic = useIsArabic();
  const isFutures = useIsFutures();

  const linkHref = `${isFutures ? "/futures/" : "/"}firms/${company.slug}`;

  return (
    <>
      <TableCell
        className={cn(
          "bg-background z-20 hidden md:table-cell sticky w-fit",
          !isArabic && "left-0 shadow-[2px_0_4px_rgba(0,0,0,0.1)]",
          isArabic && "right-0 shadow-[-2px_0_4px_rgba(0,0,0,0.1)]"
        )}
      >
        <Link
          href={`${isFutures ? "/futures/" : "/"}firms/${company.slug}`}

          className="flex items-center gap-2 max-md:outline-none max-md:focus:outline-none max-md:active:outline-none max-md:[-webkit-tap-highlight-color:transparent]"
        >
          <div className="bg-primary3 max-w-max rounded-xl overflow-hidden border border-border/50 shadow-sm flex-shrink-0 group-hover:border-primary/30 transition-colors duration-200">
            <div className="w-9 md:w-10 xl:w-14 aspect-square relative">
              <Image
                src={company.image}
                alt="image"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="overflow-hidden transition-all duration-200 md:!max-w-none">
            <h2 className="text-sm md:text-base xl:text-lg font-semibold whitespace-nowrap">
              {company.name}
            </h2>
            {userRole === "SUPER_ADMIN" && company.notes && (
              <p className="text-[10px] text-red-500 leading-tight whitespace-nowrap">{company.notes}</p>
            )}
          </div>
        </Link>
      </TableCell>

      <TableCell
        className={cn(
          // Mobile logo cell: fixed width so EN/AR look identical
          "bg-background z-30 table-cell md:hidden sticky border-r-0 overflow-visible",
          // slightly larger than old EN, smaller than old AR
          "w-[40px] min-w-[40px] max-w-[40px]",
          !isArabic && [
            "left-0",
            "shadow-[2px_0_4px_rgba(0,0,0,0.1),8px_0_0_0_var(--background)]",
          ],
          isArabic && [
            "right-0 left-auto",
            "shadow-[-2px_0_4px_rgba(0,0,0,0.1)]",
          ],
        )}
      >
        {/* Full-cell background layer for horizontal padding only (left/right of logo), so we don't overlay the header */}
        <span className="absolute inset-y-0 -left-3 -right-3 bg-background -z-[1]" aria-hidden />
        <Link
          href={linkHref}

          className="relative z-0 flex justify-center md:justify-start w-full min-w-0 max-md:outline-none max-md:focus:outline-none max-md:active:outline-none max-md:[-webkit-tap-highlight-color:transparent]"
        >
          <div className="bg-primary3 rounded-xl overflow-hidden border border-border/50 shadow-sm flex-shrink-0 w-9 md:w-10 xl:w-14 aspect-square relative group-hover:border-primary/30 transition-colors duration-200">
            <Image
              src={company.image}
              alt={company.name}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </TableCell>

      <TableCell className={cn("bg-background z-20 table-cell md:hidden w-fit")}>
        <Link href={linkHref} scroll={false} className="flex justify-center max-md:outline-none max-md:focus:outline-none max-md:active:outline-none max-md:[-webkit-tap-highlight-color:transparent]">
          <div className={cn("overflow-visible transition-all duration-200 md:max-w-none md:text-left text-center")}>
            <h2 className="text-xs md:text-base xl:text-lg font-semibold whitespace-nowrap px-1">
              {company.name}
            </h2>
            {userRole === "SUPER_ADMIN" && company.notes && (
              <p className="text-[8px] text-red-500 leading-tight whitespace-nowrap px-1">{company.notes}</p>
            )}
          </div>
        </Link>
      </TableCell>
    </>
  );
}
