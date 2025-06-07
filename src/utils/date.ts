/**
 * Formats a date string into various display formats, always using UTC timezone.
 * Ensures all displayed times are clearly marked as UTC for user understanding.
 * 
 * @param {string} dateString - ISO date string to format
 * @param {boolean} includeTime - Whether to include time in output
 * @param {boolean} compact - Use compact format (YYYY/MM/DD HH:MM UTC)
 * @returns {string} Formatted date string with UTC timezone indication
 * 
 * @example
 * formatDate('2024-03-15T10:30:00Z', true, true);
 * // Returns: "2024/03/15 10:30 UTC"
 * 
 * @example
 * formatDate('2024-03-15T10:30:00Z', true, false);
 * // Returns: "Mar 15, 2024, 10:30:00 AM UTC"
 */
export const formatDate = (dateString: string, includeTime: boolean = false, compact: boolean = false): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    if (includeTime) {
      if (compact) {
        // YYYY/MM/DD HH:MM UTC format with military time
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes} UTC`;
      }
      
      // Standard format with UTC timezone clearly indicated
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'UTC',
        timeZoneName: 'short'
      });
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Validates if a date string can be parsed into a valid Date object.
 * 
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if the date string is valid
 * 
 * @example
 * isValidDate('2024-03-15T10:30:00Z'); // Returns: true
 * isValidDate('invalid-date'); // Returns: false
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Formats a date string for HTML input[type="date"] elements.
 * Returns date in YYYY-MM-DD format required by date inputs.
 * 
 * @param {string} dateString - ISO date string to format
 * @returns {string} Date in YYYY-MM-DD format or empty string if invalid
 * 
 * @example
 * formatDateForInput('2024-03-15T10:30:00Z'); // Returns: "2024-03-15"
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

/**
 * Generates a date range object for the specified time period.
 * Both dates are set to current local time but can be used for UTC comparisons.
 * 
 * @param {string} period - Time period ('week', 'month', 'quarter', 'year', or other for all-time)
 * @returns {{ start: Date, end: Date }} Object with start and end dates
 * 
 * @example
 * const { start, end } = getDateRange('month');
 * // Returns dates for the last 30 days
 * 
 * @example
 * const { start, end } = getDateRange('week');
 * // Returns dates for the last 7 days
 */
export const getDateRange = (period: string): { start: Date, end: Date } => {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setFullYear(end.getFullYear() - 100); // All time
  }
  
  return { start, end };
};

/**
 * Creates a UTC timestamp string for the current moment.
 * Use this when storing timestamps to ensure consistent UTC storage.
 * 
 * @returns {string} ISO string in UTC timezone
 * 
 * @example
 * const timestamp = createUTCTimestamp();
 * // Returns: "2024-03-15T10:30:00.000Z"
 */
export const createUTCTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Converts a local date to UTC timestamp string.
 * Useful when converting user input dates to UTC for storage.
 * 
 * @param {Date} date - Local date to convert
 * @returns {string} ISO string in UTC timezone
 * 
 * @example
 * const localDate = new Date('2024-03-15T10:30:00');
 * const utcTimestamp = toUTCTimestamp(localDate);
 * // Returns UTC equivalent: "2024-03-15T15:30:00.000Z" (if local is UTC+5)
 */
export const toUTCTimestamp = (date: Date): string => {
  return date.toISOString();
};