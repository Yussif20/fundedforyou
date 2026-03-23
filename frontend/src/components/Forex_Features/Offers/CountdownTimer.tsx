"use client";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import useIsArabic from "@/hooks/useIsArabic";

type Props = {
  endDate: string;
  startDate?: string;
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function CountdownTimer({ endDate, startDate }: Props) {
  const isArabic = useIsArabic();

  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(endDate).getTime() - Date.now();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  // إخفاء العرض تمامًا عند انتهائه
  if (timeLeft.isExpired) {
    return null;
  }

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  // Calculate progress bar percentage (time elapsed / total duration)
  const progressPercent = (() => {
    if (!startDate) return null;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const total = end - start;
    if (total <= 0) return null;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  })();

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <Badge
        className="
          bg-primary/10
          border border-primary/20
          text-white
          text-xs
          font-mono
          tabular-nums
        "
      >
        <Clock size={14} />
        <span className="flex gap-1">
          {timeLeft.days > 0 && (
            <>
              <span>{formatNumber(timeLeft.days)}{isArabic ? "ي" : "d"}</span>
              <span>:</span>
            </>
          )}
          <span>{formatNumber(timeLeft.hours)}{isArabic ? "س" : "h"}</span>
          <span>:</span>
          <span>{formatNumber(timeLeft.minutes)}{isArabic ? "د" : "m"}</span>
          <span>:</span>
          <span>{formatNumber(timeLeft.seconds)}{isArabic ? "ث" : "s"}</span>
        </span>
      </Badge>
      {progressPercent !== null && (
        <div className="w-full max-w-[120px] h-1 rounded-full bg-foreground/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
