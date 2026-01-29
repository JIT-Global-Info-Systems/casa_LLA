import { useState, useCallback, useRef } from 'react';

/**
 * Hook for managing loading states with support for multiple concurrent operations
 * @param {Object} initialState - Initial loading state object
 * @returns {Object} Loading state management utilities
 */
export const useLoadingState = (initialState = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialState);
  const timeoutRefs = useRef(new Map());

  /**
   * Set loading state for a specific key
   * @param {string} key - Loading state key
   * @param {boolean} isLoading - Loading state
   * @param {number} minDuration - Minimum duration to show loading (prevents flashing)
   */
  const setLoading = useCallback((key, isLoading, minDuration = 0) => {
    if (isLoading) {
      // Clear any existing timeout for this key
      if (timeoutRefs.current.has(key)) {
        clearTimeout(timeoutRefs.current.get(key));
      }

      setLoadingStates(prev => ({ ...prev, [key]: true }));
    } else {
      if (minDuration > 0) {
        // Ensure loading shows for minimum duration
        const timeoutId = setTimeout(() => {
          setLoadingStates(prev => ({ ...prev, [key]: false }));
          timeoutRefs.current.delete(key);
        }, minDuration);
        
        timeoutRefs.current.set(key, timeoutId);
      } else {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }
    }
  }, []);

  /**
   * Check if a specific key is loading
   * @param {string} key - Loading state key
   * @returns {boolean} Loading state
   */
  const isLoading = useCallback((key) => {
    return Boolean(loadingStates[key]);
  }, [loadingStates]);

  /**
   * Check if any operation is loading
   * @returns {boolean} True if any operation is loading
   */
  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  /**
   * Wrap an async function with loading state management
   * @param {string} key - Loading state key
   * @param {Function} asyncFn - Async function to wrap
   * @param {number} minDuration - Minimum loading duration
   * @returns {Function} Wrapped function
   */
  const withLoading = useCallback((key, asyncFn, minDuration = 300) => {
    return async (...args) => {
      setLoading(key, true);
      try {
        const result = await asyncFn(...args);
        return result;
      } finally {
        setLoading(key, false, minDuration);
      }
    };
  }, [setLoading]);

  /**
   * Reset all loading states
   */
  const resetLoading = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current.clear();
    
    setLoadingStates({});
  }, []);

  /**
   * Set multiple loading states at once
   * @param {Object} states - Object with key-value pairs of loading states
   */
  const setMultipleLoading = useCallback((states) => {
    setLoadingStates(prev => ({ ...prev, ...states }));
  }, []);

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    withLoading,
    resetLoading,
    setMultipleLoading,
  };
};

/**
 * Hook for managing global loading state (useful for blocking UI during critical operations)
 */
export const useGlobalLoading = () => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState('');
  const globalTimeoutRef = useRef(null);

  const setGlobalLoading = useCallback((loading, message = '', minDuration = 0) => {
    if (loading) {
      setIsGlobalLoading(true);
      setGlobalLoadingMessage(message);
    } else {
      if (minDuration > 0) {
        globalTimeoutRef.current = setTimeout(() => {
          setIsGlobalLoading(false);
          setGlobalLoadingMessage('');
        }, minDuration);
      } else {
        setIsGlobalLoading(false);
        setGlobalLoadingMessage('');
      }
    }
  }, []);

  const clearGlobalLoading = useCallback(() => {
    if (globalTimeoutRef.current) {
      clearTimeout(globalTimeoutRef.current);
    }
    setIsGlobalLoading(false);
    setGlobalLoadingMessage('');
  }, []);

  return {
    isGlobalLoading,
    globalLoadingMessage,
    setGlobalLoading,
    clearGlobalLoading,
  };
};

export default useLoadingState;