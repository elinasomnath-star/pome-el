/**
 * Indian Number System formatter utilities.
 * Indian grouping: last 3 digits, then groups of 2 (lakhs, crores).
 * e.g., 1234567 → "12,34,567"
 */

/**
 * Formats a non-negative integer using Indian comma grouping.
 * @param {number} value
 * @returns {string} e.g. "3,950" or "12,34,567"
 */
export function indianGroup(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  const abs = Math.abs(Math.round(value));
  const str = abs.toString();
  if (str.length <= 3) return str;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  return (value < 0 ? '-' : '') + grouped;
}

/**
 * Format a crore-denominated value as "₹X,XXX Cr".
 * Values already in crores (e.g. firm.revenue = 3950) → "₹3,950 Cr"
 * @param {number} valueCr  - value already in Crores
 * @param {number} [decimals=0] - decimal places (use 1 for e.g. ₹48.0)
 * @returns {string}
 */
export function formatCr(valueCr, decimals = 0) {
  if (valueCr === null || valueCr === undefined || isNaN(valueCr)) return '—';
  if (decimals > 0) {
    const isNeg = valueCr < 0;
    return `${isNeg ? '-' : ''}₹${Math.abs(valueCr).toFixed(decimals)} Cr`;
  }
  return `₹${indianGroup(valueCr)} Cr`;
}

/**
 * Format a lakh-denominated value as "₹X,XX,XXX L" or "₹X L".
 * @param {number} valueLakh - value in lakhs
 * @returns {string}
 */
export function formatLakh(valueLakh) {
  if (valueLakh === null || valueLakh === undefined || isNaN(valueLakh)) return '—';
  return `₹${indianGroup(valueLakh)} L`;
}

/**
 * Format a raw absolute rupee amount (no Cr/L suffix), Indian grouping.
 * e.g. 8120000 → "₹81,20,000"
 * @param {number} value
 * @returns {string}
 */
export function formatRupeeAbs(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  const isNeg = value < 0;
  return `${isNeg ? '-' : ''}₹${indianGroup(Math.abs(value))}`;
}

/**
 * Format a small per-order rupee amount (no grouping needed for 2-3 digit numbers).
 * e.g. 48.0 → "₹48.0", 22 → "₹22"
 * @param {number} value
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPerOrder(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return `₹${Number(value).toFixed(decimals)}`;
}
