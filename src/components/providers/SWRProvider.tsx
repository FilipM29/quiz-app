import { type ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { swrConfig } from '../../config/swr';

interface SWRProviderProps {
  children: ReactNode;
}

/**
 * Global SWR configuration provider
 * Wraps the app with SWR config for retry logic and error handling
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
