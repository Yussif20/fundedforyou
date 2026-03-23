import { ReactNode } from "react";
import SectionTitle from "../Global/SectionTitle";
import { Card, CardContent } from "../ui/card";
import LinearBorder from "../Global/LinearBorder";
import { cn } from "@/lib/utils";

export default function AuthContainer({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <LinearBorder
      className2="rounded-2xl max-w-full"
      className="rounded-2xl max-w-full!"
    >
      <Card className={cn("w-full max-w-xl border-none shadow-none bg-card/95 backdrop-blur-sm", className)}>
        <CardContent className="p-6 sm:p-8 md:p-10 space-y-8 w-full">
          <SectionTitle
            title={title}
            subtitle={subtitle}
            titleClass="text-2xl md:text-3xl"
            subtitleClass="text-foreground/70 text-sm md:text-base"
            hideLine
          />
          <div className="pt-1">{children}</div>
        </CardContent>
      </Card>
    </LinearBorder>
  );
}
