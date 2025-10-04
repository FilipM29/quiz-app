import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { FetchError } from '../utils/common';

/**
 * Hook to handle automatic redirect to login on 401 errors
 * @param error - Error from API call (usually from SWR or try-catch)
 */
export function useAuthRedirect(error: Error | null | undefined) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;

    // Check if it's a 401 Unauthorized error
    if (error instanceof FetchError && error.status === 401) {
      // Get current path for redirect after login
      const currentPath = window.location.pathname + window.location.search;

      // Redirect to login with return path
      navigate({
        to: '/login',
        search: { redirect: currentPath }
      });
    }
  }, [error, navigate]);
}

/**
 * Check if an error is a 401 Unauthorized error
 * Useful for conditional rendering or error handling
 */
export function is401Error(error: unknown): boolean {
  return error instanceof FetchError && error.status === 401;
}
