import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disablePadding?: boolean;
}

export const PageContainer = ({
  children,
  maxWidth = false,
  disablePadding = false
}: PageContainerProps) => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container
        maxWidth={maxWidth}
        sx={{
          px: disablePadding ? 0 : { xs: 2, sm: 3, md: 4 },
          py: disablePadding ? 0 : { xs: 2, md: 3 }
        }}>
        {children}
      </Container>
    </Box>
  );
};
