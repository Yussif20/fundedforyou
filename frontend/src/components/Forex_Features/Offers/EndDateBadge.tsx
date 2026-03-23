import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  endDate: string; // "2026-02-01" or ISO string
};

const FIVE_HOURS = 1000 * 60 * 60 * 5;

export default function EndDateBadge({ endDate }: Props) {
  const checkExpired = () => {
    return new Date(endDate).getTime() <= Date.now();
  };

  const [isExpired, setIsExpired] = useState(checkExpired());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExpired(checkExpired());
    }, FIVE_HOURS);

    return () => clearInterval(interval);
  }, [endDate]);

  // Format like: "Feb, 1."
  const formattedDate =
    new Date(endDate)
      .toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
      .replace(" ", " ") + "";

  if (isExpired) {
    return (
      <Badge
        className="
          bg-red-500/20
          text-red-400
          border border-red-500/30
          text-xs
        "
      >
        <CalendarDays />
        Expired {formattedDate}
      </Badge>
    );
  }

  return (
    <Badge
      className="
        bg-primary/10
        border border-primary/20
        text-white
        text-xs
      "
    >
      <CalendarDays />
      Ends {formattedDate}
    </Badge>
  );
}
