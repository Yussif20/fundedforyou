"use client";

import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none" | "scale";
}

export default function ScrollReveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: ScrollRevealProps) {
  const initial =
    direction === "scale"
      ? { opacity: 0, scale: 0.96 }
      : {
          opacity: 0,
          y: direction === "up" ? 24 : 0,
          x: direction === "left" ? -24 : direction === "right" ? 24 : 0,
        };

  const animate =
    direction === "scale"
      ? { opacity: 1, scale: 1 }
      : { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 80, damping: 18, delay }}
    >
      {children}
    </motion.div>
  );
}
