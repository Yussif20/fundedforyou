import { useTranslations } from "next-intl";

interface BatteryIndicatorProps {
  percentage?: number;
  tooltip?: string;
  showNumber?: boolean;
}

const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({
  percentage = 80,
  showNumber = true,
}) => {
  useTranslations("BatteryIndicator");
  const level: number = Math.min(Math.max(percentage, 0), 100);

  // Determine color based on battery level
  const getColor = (): string => {
    if (level <= 20) return "bg-red-500";
    if (level <= 50) return "bg-orange-500";
    return "bg-primary";
  };

  const filledBars: number = Math.ceil((level / 100) * 10);

  return (
    <div className="flex items-center gap-2">
      {/* Percentage Display - optional */}
      {showNumber && <div className="text-sm font-bold">{level}</div>}

      {/* Battery Bars */}
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`w-1 h-6.5 rounded-sm transition-all duration-300 ${
              index < filledBars ? getColor() : "bg-secondary"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BatteryIndicator;
