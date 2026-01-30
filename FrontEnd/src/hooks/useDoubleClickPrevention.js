import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook to prevent double-clicking on actions
 * @param {number} delay - Delay in milliseconds before allowing another click (default: 1000ms)
 * @returns {object} - { isLoading, executeAction }
 */
export const useDoubleClickPrevention = (delay = 1000) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const executeAction = useCallback(async (action) => {
    if (isLoading) {
      return; // Prevent double execution
    }

    setIsLoading(true);

    try {
      const result = action();
      
      // If action returns a promise, wait for it
      if (result && typeof result.then === 'function') {
        await result;
      }
      
      return result;
    } catch (error) {
      console.error('Action execution error:', error);
      throw error;
    } finally {
      // Keep loading state for the specified delay
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }
  }, [isLoading, delay]);

  return {
    isLoading,
    executeAction
  };
};

/**
 * Hook for managing multiple loading states (useful for lists with individual action buttons)
 * @param {number} delay - Delay in milliseconds before allowing another click
 * @returns {object} - { loadingStates, executeAction }
 */
export const useMultipleDoubleClickPrevention = (delay = 1000) => {
  const [loadingStates, setLoadingStates] = useState(new Set());
  const timeoutsRef = useRef(new Map());

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const executeAction = useCallback(async (id, action) => {
    if (loadingStates.has(id)) {
      return; // Prevent double execution for this specific item
    }

    setLoadingStates(prev => new Set(prev).add(id));

    try {
      const result = action();
      
      // If action returns a promise, wait for it
      if (result && typeof result.then === 'function') {
        await result;
      }
      
      return result;
    } catch (error) {
      console.error(`Action execution error for ${id}:`, error);
      throw error;
    } finally {
      // Keep loading state for the specified delay
      const timeout = setTimeout(() => {
        setLoadingStates(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        timeoutsRef.current.delete(id);
      }, delay);
      
      timeoutsRef.current.set(id, timeout);
    }
  }, [loadingStates, delay]);

  const isLoading = useCallback((id) => {
    return loadingStates.has(id);
  }, [loadingStates]);

  return {
    loadingStates,
    isLoading,
    executeAction
  };
};