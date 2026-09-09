/**
 * Formats a number as Nigerian Naira (₦) with thousands separators and 2 decimal places.
 * e.g., 2000 -> ₦2,000.00
 */
export function formatNaira(value: number | undefined | null, includeDecimals = true): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '₦0.00';
  }

  const isNegative = value < 0;
  const absValue = Math.abs(value);

  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(absValue);

  return `${isNegative ? '-' : ''}₦${formatted}`;
}

/**
 * Formats a number as a clean percentage string.
 * e.g., 0.354 -> 35.4%
 */
export function formatPercent(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0%';
  }
  const percentVal = value * 100;
  return `${percentVal.toFixed(decimals)}%`;
}

/**
 * Safely parse an input value to number or default.
 */
export function parseNum(val: number | string | undefined | null, fallback = 0): number {
  if (val === '' || val === undefined || val === null) return fallback;
  const parsed = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}
