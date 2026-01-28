import { useState, useEffect } from 'react';

/**
 * Hook that debounces a value
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} The debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook that debounces a callback function
 * @param {Function} callback - The callback to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} The debounced callback
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const [debouncedCallback, setDebouncedCallback] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);

  return debouncedCallback;
};

export default useDebounce;