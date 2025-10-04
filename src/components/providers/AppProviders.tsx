import { type ReactNode } from 'react';
import { CategoriesProvider } from '../../context/categories-context';
import { SearchProvider } from '../../context/search-context';
import { ToastProvider } from '../../context/toast-context';
import { ThemeModeProvider } from '../../theme';
import { AuthProvider } from './AuthProvider';
import { ConfigProvider } from './ConfigProvider';
import { SWRProvider } from './SWRProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combines all application providers in a single component.
 * This reduces the visual nesting in the root component while maintaining
 * the same provider hierarchy at runtime.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigProvider>
      <SWRProvider>
        <AuthProvider>
          <CategoriesProvider>
            <ThemeModeProvider>
              <ToastProvider>
                <SearchProvider>{children}</SearchProvider>
              </ToastProvider>
            </ThemeModeProvider>
          </CategoriesProvider>
        </AuthProvider>
      </SWRProvider>
    </ConfigProvider>
  );
}
