"use client";

import { motion } from "framer-motion";
import { Search, GitCompare, TrendingUp } from "lucide-react";

const stepIcons = [
  <Search size={24} key="search" className="text-primary shrink-0" />,
  <GitCompare size={24} key="compare" className="text-primary shrink-0" />,
  <TrendingUp size={24} key="trending" className="text-primary shrink-0" />,
];

interface Step {
  number: string;
  text: string;
}

export default function HowItWorksStepsClient({ steps }: { steps: Step[] }) {
  return (
    <div className="relative z-10 flex flex-col gap-6 sm:gap-0">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-stretch"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-24px" }}
          transition={{ duration: 0.4, delay: index * 0.12, ease: "easeOut" }}
        >
          {/* Below sm: hidden (no numbers, no connector); sm+: circle with connecting lines */}
          <div className="hidden sm:flex flex-col items-center shrink-0 w-14">
            {/* Line above — hidden below sm, show from sm */}
            {index > 0 ? (
              <div className="hidden sm:flex flex-1 min-h-2 justify-center">
                <div className="w-0 border-l-2 border-dashed border-primary/50 h-full" aria-hidden />
              </div>
            ) : (
              <div className="hidden sm:block flex-1 min-h-2" />
            )}
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-base font-bold text-primary shadow-sm">
              {step.number}
            </div>
            {/* Line below — hidden below sm, show from sm */}
            {index < steps.length - 1 ? (
              <div className="hidden sm:flex flex-1 min-h-2 justify-center">
                <div className="w-0 border-l-2 border-dashed border-primary/50 h-full" aria-hidden />
              </div>
            ) : (
              <div className="hidden sm:block flex-1 min-h-2" />
            )}
          </div>

          {/* Content card — full width on mobile, stacks below circle */}
          <div className="flex w-full min-w-0 flex-1 gap-3 sm:gap-4 items-center rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm px-4 py-4 sm:px-6 sm:py-5 hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {stepIcons[index]}
            </div>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed font-medium text-foreground min-w-0">
              {step.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
