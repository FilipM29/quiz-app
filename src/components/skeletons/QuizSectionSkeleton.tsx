import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

export const QuizSectionSkeleton = () => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Section header skeleton */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={200} height={40} />
          </Stack>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Skeleton
            variant="text"
            width={300}
            height={24}
            sx={{ mx: 'auto' }}
          />
        </Box>
      </Box>

      {/* Scrollable cards */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          gap: { xs: '1rem', md: '1.5rem' },
          pb: 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            sx={{
              flexShrink: 0,
              width: { xs: '80vw', sm: '45vw', md: '30vw', lg: '22vw' },
              maxWidth: 350,
              display: 'flex',
              flexDirection: 'column'
            }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />
              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
