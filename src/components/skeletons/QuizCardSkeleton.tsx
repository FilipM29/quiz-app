import { Card, CardActions, CardContent, Skeleton, Stack } from '@mui/material';

export const QuizCardSkeleton = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
      {/* Image skeleton */}
      <Skeleton variant="rectangular" height={200} />

      <CardContent sx={{ flex: 1 }}>
        {/* Title */}
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />

        {/* Description */}
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />

        {/* Category & Stats */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Stack>

        {/* Bottom info */}
        <Stack direction="row" justifyContent="space-between">
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={80} />
        </Stack>
      </CardContent>

      <CardActions>
        <Skeleton variant="rounded" width="100%" height={36} />
      </CardActions>
    </Card>
  );
};
