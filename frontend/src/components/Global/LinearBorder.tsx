import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function LinearBorder({
  children,
  className,
  className2,
}: {
  children: ReactNode;
  className?: string;
  className2?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-max rounded-2xl bg-card shadow-lg shadow-primary/10 overflow-hidden",
        className
      )}
    >
      <div className={cn("w-full", className2)}>
        {children}
      </div>
    </div>
  );
}
