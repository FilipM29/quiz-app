import { ThemeProvider } from '@mui/material/styles';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from '../components/header/Header.tsx';
import theme from '../theme.tsx';

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Outlet />
      </ThemeProvider>
      <TanStackRouterDevtools />
    </>
  )
});
