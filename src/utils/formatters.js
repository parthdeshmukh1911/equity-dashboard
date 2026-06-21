/**
 * Format a number as Indian Rupee currency
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted currency string with ₹ prefix
 * 
 * @example
 * formatCurrency(1234567) // "₹12.35L"
 * formatCurrency(-5000) // "−₹5,000"
 * formatCurrency(0) // "₹0"
 * formatCurrency(10000000) // "₹1.00Cr"
 */
export function formatCurrency(value) {
  // Handle invalid inputs
  if (!isFinite(value)) {
    return '₹0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '−' : '';

  // Zero case
  if (value === 0) {
    return '₹0';
  }

  // Crore scale (10,000,000+)
  if (absValue >= 10_000_000) {
    const crores = absValue / 10_000_000;
    return `${sign}₹${crores.toFixed(2)}Cr`;
  }

  // Lakh scale (100,000+)
  if (absValue >= 100_000) {
    const lakhs = absValue / 100_000;
    return `${sign}₹${lakhs.toFixed(2)}L`;
  }

  // Thousands with comma separator
  if (absValue >= 1_000) {
    const formatted = absValue.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    });
    return `${sign}₹${formatted}`;
  }

  // Small values with 2 decimal places
  return `${sign}₹${absValue.toFixed(2)}`;
}

/**
 * Format a number as a percentage
 * @param {number} value - The numeric value to format as percentage
 * @returns {string} Formatted percentage string with % suffix
 * 
 * @example
 * formatPercent(12.5) // "+12.50%"
 * formatPercent(-3.2) // "−3.20%"
 * formatPercent(0) // "0.00%"
 */
export function formatPercent(value) {
  // Handle invalid inputs
  if (!isFinite(value)) {
    return '0.00%';
  }

  const absValue = Math.abs(value);
  
  // Determine sign prefix
  let sign = '';
  if (value > 0) {
    sign = '+';
  } else if (value < 0) {
    sign = '−';
  }

  return `${sign}${absValue.toFixed(2)}%`;
}
