import { SWRConfiguration } from 'swr';
import { logger } from '../utils/logger';

/**
 * Global SWR configuration with retry logic and error handling
 */

// Exponential backoff with maximum of 3 retries
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

/**
 * Custom retry logic with exponential backoff
 * Retries: 1s, 2s, 4s (total 3 retries)
 */
function retryWithBackoff(
  error: Error & { status?: number },
  _key: string,
  _config: unknown,
  revalidate: unknown,
  { retryCount }: { retryCount: number }
): void {
  // Don't retry on 4xx errors (client errors - these won't succeed on retry)
  if (error.status && error.status >= 400 && error.status < 500) {
    logger.warn('Client error, not retrying', {
      status: error.status,
      message: error.message
    });
    return;
  }

  // Stop retrying after MAX_RETRIES
  if (retryCount >= MAX_RETRIES) {
    logger.error('Max retries reached', {
      retryCount,
      error: error.message
    });
    return;
  }

  // Calculate exponential backoff delay
  const delay = BASE_DELAY * 2 ** retryCount;

  logger.info('Retrying request', {
    retryCount: retryCount + 1,
    maxRetries: MAX_RETRIES,
    delay
  });

  // Retry after delay
  setTimeout(() => {
    if (typeof revalidate === 'function') {
      revalidate({ retryCount: retryCount + 1 });
    }
  }, delay);
}

/**
 * Global SWR configuration
 */
export const swrConfig: SWRConfiguration = {
  // Network error handling
  onError: (error: Error & { status?: number }, key: string) => {
    // Only log errors in development
    if (import.meta.env.DEV) {
      logger.error('SWR Error', {
        key,
        status: error.status,
        message: error.message
      });
    }
  },

  // Retry logic with exponential backoff
  onErrorRetry: retryWithBackoff,

  // Success callback for logging (development only)
  onSuccess: (data, key, config) => {
    if (import.meta.env.DEV && config.dedupingInterval === 0) {
      // Only log on forced revalidations (manual fetches)
      logger.debug('SWR Success', {
        key,
        dataLength: Array.isArray(data) ? data.length : 'N/A'
      });
    }
  },

  // Default options
  revalidateOnFocus: false, // Don't revalidate on window focus (performance)
  revalidateOnReconnect: true, // Revalidate when network reconnects
  revalidateIfStale: true, // Revalidate if data is stale
  dedupingInterval: 2000, // Dedupe requests within 2 seconds
  focusThrottleInterval: 5000, // Throttle focus revalidation to 5 seconds
  loadingTimeout: 3000, // Consider request slow after 3 seconds
  errorRetryInterval: 5000, // Wait 5 seconds between retries (initial)
  errorRetryCount: MAX_RETRIES, // Maximum number of retries

  // Suspense mode - disabled by default
  suspense: false,

  // Keep previous data while revalidating
  keepPreviousData: true
};

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.onLine === 'boolean'
  ) {
    return navigator.onLine;
  }
  return true; // Assume online if can't detect
}

/**
 * Custom error class for network errors
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Enhanced fetcher with offline detection
 */
export async function swrFetcher<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  // Check if online
  if (!isOnline()) {
    throw new NetworkError('No internet connection');
  }

  try {
    const response = await fetch(url, init);

    // Handle HTTP errors
    if (!response.ok) {
      const error = new Error('API request failed') as Error & {
        status: number;
        info: unknown;
      };
      error.status = response.status;

      try {
        error.info = await response.json();
      } catch {
        error.info = await response.text();
      }

      throw error;
    }

    return response.json();
  } catch (error) {
    // Network errors (failed to fetch)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Failed to connect to server');
    }
    throw error;
  }
}
