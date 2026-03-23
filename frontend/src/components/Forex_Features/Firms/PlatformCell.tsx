"use client";
import { TableCell } from "@/components/ui/table";
import { Platform } from "@/types";
import Image from "next/image";
import { useState } from "react";

export default function PlatformCell({ platforms }: { platforms: Platform[] }) {
  const [showAll, setShowAll] = useState(false);

  const visiblePlatforms = showAll ? platforms : platforms.slice(0, 5);
  const remainingCount = platforms.length - 5;
  return (
    <TableCell>
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {visiblePlatforms.map((item, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full relative overflow-hidden ring-1 ring-border/30 shadow-sm"
            title={item.title}
          >
            <Image
              src={item.logoUrl}
              alt="platform"
              fill
              className="object-cover"
            />
          </div>
        ))}

        {remainingCount > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center font-medium hover:bg-muted/80 transition"
          >
            +{remainingCount}
          </button>
        )}
      </div>
    </TableCell>
  );
}
