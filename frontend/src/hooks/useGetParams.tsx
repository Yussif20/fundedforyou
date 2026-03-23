import { useSearchParams } from "next/navigation";

export default function useGetParams() {
  const searchParams = useSearchParams();
  const countries = searchParams.get("countries") || "";
  const paymentMethods = searchParams.get("paymentMethods") || "";
  const payoutMethods = searchParams.get("payoutMethods") || "";
  const yearsInOperation = searchParams.get("range_yearsInOperation") || "";
  const assets = searchParams.get("assets") || "";
  const platforms = searchParams.get("platforms") || "";
  const programType = searchParams.get("programType") || "";
  const range_maxAllocation = searchParams.get("range_maxAllocation") || "";
  const drawdowns = searchParams.get("drawdown") || "";
  const otherFeatures = searchParams.get("otherFeatures") || "";
  const firms = searchParams.get("firms") || "";
  return {
    countries,
    paymentMethods,
    payoutMethods,
    yearsInOperation,
    assets,
    platforms,
    programType,
    range_maxAllocation,
    drawdowns,
    otherFeatures,
    firms,
  };
}
