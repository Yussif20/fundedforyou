"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

export default function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  const pathname = usePathname();
  // Extract the type (forex vs futures) from the pathname
  const isFutures = pathname.includes("/futures");
  const transitionKey = isFutures ? "futures" : "forex";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
