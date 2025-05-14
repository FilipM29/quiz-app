import { ThemeProvider } from '@mui/material/styles';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from '../components/header/Header.tsx';
import { AuthContext, AuthProvider } from '../context/auth-context.tsx';
import theme from '../theme.tsx';

interface RootRouterContext {
  auth?: AuthContext;
}

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: () => (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Header />
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  )
});
