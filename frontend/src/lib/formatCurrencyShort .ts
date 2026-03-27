export const formatCurrencyShort = (value: string | number, showDollar: boolean = true): string => {
  const dollarSign: string = showDollar ? '$' : ''
  const num = typeof value === "string" ? parseFloat(value) : value;
  let numberText = ''
  if (isNaN(num)) numberText = "0";

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000) {
    const b = num / 1_000_000_000;
    numberText = Number.isInteger(b) ? `${b}b` : `${parseFloat(b.toFixed(2))}b`;
  } else if (absNum >= 1_000_000) {
    const m = num / 1_000_000;
    numberText = Number.isInteger(m) ? `${m}m` : `${parseFloat(m.toFixed(2))}m`;
  } else if (absNum >= 1_000) {
    numberText = num % 1_000 === 0
      ? `${num / 1_000}k`
      : `${Math.round(num).toLocaleString("en-US")}`;
  } else {
    numberText = `${num}`;
  }
  return `${dollarSign}${numberText}`
};

/** Format max allocation for Firms table: 300000 → "300K" (uppercase K) */
export const formatMaxAllocationToK = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0K";
  const absNum = Math.abs(num);
  if (absNum >= 1_000_000) {
    const m = num / 1_000_000;
    return Number.isInteger(m) ? `${m}M` : `${parseFloat(m.toFixed(2))}M`;
  }
  if (absNum >= 1_000) {
    return num % 1_000 === 0
      ? `${num / 1_000}K`
      : `${Math.round(num).toLocaleString("en-US")}`;
  }
  return `${num}`;
};

/** Format currency with full number and commas for Challenges: 300000 → "300,000" */
export const formatCurrencyLong = (
  value: string | number,
  showDollar: boolean = true
): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return showDollar ? "$0" : "0";
  const hasDecimals = num % 1 !== 0;
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  });
  return showDollar ? `$${formatted}` : formatted;
};
