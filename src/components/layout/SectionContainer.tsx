import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface SectionContainerProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  spacing?: number;
  centered?: boolean;
  action?: ReactNode;
}

export const SectionContainer = ({
  title,
  subtitle,
  icon,
  children,
  spacing = 4,
  centered = false,
  action
}: SectionContainerProps) => {
  return (
    <Box sx={{ mb: spacing }}>
      {(title || subtitle || action) && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              textAlign: centered ? 'center' : 'left'
            }}>
            <Box sx={{ flex: 1 }}>
              {title && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={centered ? 'center' : 'flex-start'}
                  spacing={1}
                  sx={{ mb: subtitle ? 1 : 0 }}>
                  {icon}
                  <Typography variant="h4" fontWeight="bold">
                    {title}
                  </Typography>
                </Stack>
              )}
              {subtitle && (
                <Typography variant="body1" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action && !centered && <Box sx={{ ml: 2 }}>{action}</Box>}
          </Box>
        </Box>
      )}
      {children}
    </Box>
  );
};
