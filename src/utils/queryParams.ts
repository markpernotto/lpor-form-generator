/**
 * Utility functions for handling URL query parameters
 */

/**
 * Extract query parameters from the current URL
 */
export function getUrlSearchParams(): URLSearchParams {
  return new URLSearchParams(
    window.location.search,
  );
}

/**
 * Get a specific query parameter value
 * @param key - The parameter key
 * @param defaultValue - Default value if parameter doesn't exist
 * @returns The parameter value or default value
 */
export function getQueryParam(
  key: string,
  defaultValue: string = "",
): string {
  const params = getUrlSearchParams();
  return params.get(key) || defaultValue;
}

/**
 * Get multiple query parameters as an object
 * @param keys - Array of parameter keys to extract
 * @returns Object with key-value pairs of parameters
 */
export function getMultipleQueryParams(
  keys: string[],
): Record<string, string> {
  const params = getUrlSearchParams();
  const result: Record<string, string> = {};

  keys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Check if a query parameter exists
 * @param key - The parameter key
 * @returns True if parameter exists, false otherwise
 */
export function hasQueryParam(
  key: string,
): boolean {
  const params = getUrlSearchParams();
  return params.has(key);
}
