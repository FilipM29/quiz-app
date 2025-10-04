import { Box, Grid } from '@mui/material';
import { Quiz } from '../../models/quiz';
import QuizCard from '../quizCard/QuizCard';

interface QuizGridProps {
  quizzes: Quiz[];
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: number;
}

export const QuizGrid = ({
  quizzes,
  columns = { xs: 12, sm: 4, md: 4, lg: 3, xl: 3 },
  spacing = 3
}: QuizGridProps) => {
  if (quizzes.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}>
        No quizzes found
      </Box>
    );
  }

  return (
    <Grid container spacing={spacing} sx={{ justifyContent: 'center' }}>
      {quizzes.map((quiz) => (
        <Grid
          key={quiz.id}
          size={{
            xs: columns.xs || 12,
            sm: columns.sm || 6,
            md: columns.md || 4,
            lg: columns.lg || 3,
            xl: columns.xl || 2.4
          }}>
          <QuizCard quiz={quiz} />
        </Grid>
      ))}
    </Grid>
  );
};
