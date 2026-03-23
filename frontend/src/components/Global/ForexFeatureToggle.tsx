import FFT_Buttons from "./FFT_Buttons";
import LinearBorder from "./LinearBorder";
import { cn } from "@/lib/utils";

export default function ForexFeatureToggle({ compact }: { compact?: boolean }) {
  return (
    <LinearBorder className={cn("shadow-none", compact && "rounded-xl")}>
      <FFT_Buttons compact={compact} />
    </LinearBorder>
  );
}
