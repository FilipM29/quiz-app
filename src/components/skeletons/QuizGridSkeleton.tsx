import { Grid } from '@mui/material';
import { QuizCardSkeleton } from './QuizCardSkeleton';

interface QuizGridSkeletonProps {
  count?: number;
}

export const QuizGridSkeleton = ({ count = 6 }: QuizGridSkeletonProps) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3, xl: 3 }} key={index}>
          <QuizCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};
