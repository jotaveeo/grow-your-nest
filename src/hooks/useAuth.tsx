
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check - in a real app this would check with your auth service
    const checkAuth = () => {
      // For now, just simulate that user is always authenticated
      setIsAuthenticated(true);
      setLoading(false);
    };

    // Simulate async auth check
    setTimeout(checkAuth, 100);
  }, []);

  return {
    isAuthenticated,
    loading,
  };
};
