import { ThemeProvider } from '@mui/material/styles';
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { backendConfig } from '../config/backend';
import { ConfigContext } from '../context/config-context';
import neomorphicLightTheme from '../theme';

// Test-specific backend config (can be overridden per test)
const testBackendConfig = {
  ...backendConfig,
  apiHost: 'http://localhost:8080/api' // Use consistent test API host
};

interface AllProvidersProps {
  children: ReactNode;
}

// Wrapper component with all providers needed for testing (no router by default)
const AllProviders = ({ children }: AllProvidersProps) => {
  return (
    <ConfigContext.Provider value={testBackendConfig}>
      <ThemeProvider theme={neomorphicLightTheme}>
        <SWRConfig
          value={{
            dedupingInterval: 0, // Disable deduping in tests
            provider: () => new Map(), // Each test gets fresh cache
            shouldRetryOnError: false // Don't retry failed requests in tests
          }}>
          {children}
        </SWRConfig>
      </ThemeProvider>
    </ConfigContext.Provider>
  );
};

/**
 * Custom render function that wraps components with all necessary providers
 * Use this instead of RTL's render for component tests
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

/**
 * Create a memory router with a specific route for testing
 * Useful for testing route-specific components
 */
export const createTestRouter = (component: ReactNode, path = '/') => {
  const rootRoute = createRootRoute({
    component: () => <>{component}</>
  });

  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({
      initialEntries: [path]
    })
  });
};

/**
 * Render function for components that need router context (e.g., components using Link)
 * Wraps component with all providers including RouterProvider
 */
export const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const router = createTestRouter(ui);

  return render(<RouterProvider router={router} />, { wrapper: AllProviders, ...options });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
