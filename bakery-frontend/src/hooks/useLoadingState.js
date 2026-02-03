import { useState, useCallback } from 'react';

export const useLoadingState = (initialState = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialState);

  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(state => state === true);
  }, [loadingStates]);

  const resetLoading = useCallback(() => {
    setLoadingStates(initialState);
  }, [initialState]);

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    resetLoading
  };
};
