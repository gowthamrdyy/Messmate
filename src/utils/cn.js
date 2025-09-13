/**
 * Utility function to merge class names
 * Simple implementation without external dependencies
 * @param {...string} classes - Class names to merge
 * @returns {string} - Merged class names
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}