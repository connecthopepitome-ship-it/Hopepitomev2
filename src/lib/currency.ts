/**
 * HOPEPITOME — CENTRALIZED CURRENCY CONFIGURATION & FORMATTER
 * Indian Rupee (INR / ₹) standardized across all client portals,
 * admin dashboards, quotations, invoices, and service packages.
 */

export const CURRENCY_CONFIG = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
  name: 'Indian Rupee',
} as const;

/**
 * Format an amount into standard Indian Rupee notation (e.g. ₹2,500, ₹1,25,000).
 */
export function formatINR(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return '₹0';
  }
  const numeric = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(numeric)) return '₹0';
  const rounded = Math.round(numeric);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Format an amount into Indian Rupee notation with 2 decimals (e.g. ₹2,500.00).
 */
export function formatINRWithDecimals(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return '₹0.00';
  }
  const numeric = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(numeric)) return '₹0.00';
  return (
    '₹' +
    numeric.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export default formatINR;

