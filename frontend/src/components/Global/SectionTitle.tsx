"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SectionTitle({
  title,
  subtitle,
  subtitleClass,
  titleClass,
  className,
  hideLine,
}: {
  title: string;
  subtitle?: string;
  subtitleClass?: string;
  titleClass?: string;
  className?: string;
  hideLine?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-center flex justify-center items-center flex-col gap-3",
        className
      )}
    >
      <h1
        className={cn(
          "font-bold text-3xl lg:text-4xl xl:text-5xl max-w-2xl leading-[1.2]",
          titleClass
        )}
      >
        {title}
      </h1>
      {!hideLine && (
        <motion.div
          className="h-0.5 rounded-full bg-gradient-to-r from-primary to-primary1 mt-1 mx-auto"
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        />
      )}
      {subtitle && (
        <p
          className={cn(
            "text-sm md:text-sm text-foreground/80 max-w-3xl whitespace-pre-line",
            subtitleClass
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
