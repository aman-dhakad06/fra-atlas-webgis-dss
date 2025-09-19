import { useState, useCallback } from 'react';

export const useMapErrorHandler = () => {
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback((errorMessage, details = null) => {
    console.error('Map Error:', errorMessage, details);
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    clearError();
  }, [clearError]);

  return {
    error,
    retryCount,
    handleError,
    clearError,
    retry
  };
};