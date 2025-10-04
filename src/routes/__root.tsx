import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider
} from '@mui/material';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary.tsx';
import Header from '../components/header/Header.tsx';
import { AppProviders } from '../components/providers/AppProviders.tsx';
import { useThemeMode } from '../theme.tsx';

function RouteLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
      <CircularProgress />
    </Box>
  );
}

function AppContent() {
  const { theme } = useThemeMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<RouteLoading />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export const Route = createRootRoute({
  component: () => (
    <>
      <AppProviders>
        <AppContent />
      </AppProviders>
      <TanStackRouterDevtools />
    </>
  )
});
