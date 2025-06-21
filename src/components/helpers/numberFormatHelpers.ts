
/**
 * Formats large numbers into readable format with k, m, b suffixes
 * @param num - The number to format
 * @returns Formatted string (e.g., 1000 -> "1k", 25700 -> "25.7k")
 */
export const formatNumber = (num: number | string): string => {
  // Convert to number if string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  // Return original if not a valid number
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return '0';
  }

  // Handle negative numbers
  const isNegative = numValue < 0;
  const absNum = Math.abs(numValue);

  // Less than 1000, return as-is
  if (absNum < 1000) {
    return numValue.toString();
  }

  // Function to format with suffix
  const formatWithSuffix = (value: number, suffix: string): string => {
    // Round to 1 decimal place
    const rounded = Math.round(value * 10) / 10;
    
    // If it's a whole number, don't show decimal
    const formatted = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    
    // Remove trailing zero after decimal point
    const cleanFormatted = formatted.replace(/\.0$/, '');
    
    return `${isNegative ? '-' : ''}${cleanFormatted}${suffix}`;
  };

  // Billions (1,000,000,000+)
  if (absNum >= 1000000000) {
    return formatWithSuffix(absNum / 1000000000, 'b');
  }
  
  // Millions (1,000,000+)
  if (absNum >= 1000000) {
    return formatWithSuffix(absNum / 1000000, 'm');
  }
  
  // Thousands (1,000+)
  return formatWithSuffix(absNum / 1000, 'k');
};

/**
 * Alternative function that also handles decimal input strings
 * @param input - Number or string input
 * @returns Formatted string
 */
export const formatNumberSafe = (input: number | string | null | undefined): string => {
  if (input === null || input === undefined || input === '') {
    return '0';
  }
  
  return formatNumber(input);
};

/**
 * Formats price with currency symbol (₦) and appropriate suffixes
 * @param price - The price to format
 * @returns Formatted price string (e.g., ₦1,000 -> "₦1k", ₦25,700 -> "₦25.7k")
 */
export const formatPrice = (price: number | string): string => {
  // Convert to number if string
  const numValue = typeof price === 'string' ? parseFloat(price) : price;
  
  // Return ₦0 if not a valid number
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return '₦0';
  }

  // Handle negative numbers
  const isNegative = numValue < 0;
  const absNum = Math.abs(numValue);

  // For amounts less than 10,000, show full amount with commas
  if (absNum < 10000) {
    const formatted = absNum.toLocaleString('en-US');
    return `${isNegative ? '-' : ''}₦${formatted}`;
  }

  // Function to format with suffix and currency symbol
  const formatWithSuffix = (value: number, suffix: string): string => {
    // Round to 1 decimal place
    const rounded = Math.round(value * 10) / 10;
    
    // If it's a whole number, don't show decimal
    const formatted = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
    
    // Remove trailing zero after decimal point
    const cleanFormatted = formatted.replace(/\.0$/, '');
    
    return `${isNegative ? '-' : ''}₦${cleanFormatted}${suffix}`;
  };

  // Millions (1,000,000+)
  if (absNum >= 1000000) {
    return formatWithSuffix(absNum / 1000000, 'm');
  }
  
  // Thousands (10,000+)
  return formatWithSuffix(absNum / 1000, 'k');
};

/**
 * Alternative price formatting function that handles edge cases
 * @param input - Price input (number, string, null, or undefined)
 * @returns Formatted price string
 */
export const formatPriceSafe = (input: number | string | null | undefined): string => {
  if (input === null || input === undefined || input === '') {
    return '₦0';
  }
  
  return formatPrice(input);
};

// Export both functions
export default formatNumber;
