/**
 * Date utility functions for safe date formatting
 */
 
/**
 * Safely format a date string to YYYY-MM-DD format
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string or "-" if invalid
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toISOString().split("T")[0];
  } catch (error) {
    return "-";
  }
};
 
/**
 * Safely format a date string for display (localized)
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string or "-" if invalid
 */
export const formatDisplayDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString();
  } catch (error) {
    return "-";
  }
};
 
/**
 * Safely create a Date object for filtering/comparison
 * @param {string|Date} dateString - The date to convert
 * @returns {Date|null} Valid Date object or null if invalid
 */
export const safeDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};
 
/**
 * Check if a date string is valid
 * @param {string|Date} dateString - The date to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};
 
/**
 * Format date with fallback for invalid dates
 * @param {string|Date} dateString - The date to format
 * @param {string} fallback - Fallback text for invalid dates
 * @returns {string} Formatted date or fallback
 */
export const formatDateWithFallback = (dateString, fallback = "—") => {
  if (!dateString) return fallback;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return fallback;
    return date.toISOString().split("T")[0];
  } catch (error) {
    return fallback;
  }
};
 
/**
 * Safely format a date from call objects that might have created_at or createdAt
 * @param {Object} call - Call object with date fields
 * @returns {string} Formatted date string
 */
export const formatCallDate = (call) => {
  const dateValue = call?.created_at || call?.createdAt;
  return formatDisplayDate(dateValue);
};
 