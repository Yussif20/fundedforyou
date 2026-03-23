"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Trophy, Users, Star } from "lucide-react";
import Container from "./Container";

const stats = [
  { icon: Building2, value: "50+", label: "Prop Firms" },
  { icon: Trophy, value: "1,000+", label: "Challenges" },
  { icon: Users, value: "10K+", label: "Traders" },
  { icon: Star, value: "4.9★", label: "Rating" },
];

export default function StatsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Container>
      <div
        ref={ref}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-foreground/5"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={18} />
              </div>
              <p className="text-2xl md:text-3xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-foreground/50 uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}
