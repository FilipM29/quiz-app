import { Box, Pagination, Stack, Typography } from '@mui/material';
import { Quiz } from '../../models/quiz';
import { PaginatedResponse } from '../../types/pagination';
import { QuizGridSkeleton } from '../skeletons/QuizGridSkeleton';
import { QuizGrid } from './QuizGrid';

interface QuizPaginatedGridProps {
  quizzes: Quiz[];
  pagination?: PaginatedResponse<Quiz>['pagination'];
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  emptyMessage?: string;
}

export const QuizPaginatedGrid = ({
  quizzes,
  pagination,
  currentPage,
  onPageChange,
  isLoading = false,
  error,
  columns,
  emptyMessage = 'No quizzes found'
}: QuizPaginatedGridProps) => {
  if (isLoading) {
    return <QuizGridSkeleton count={6} />;
  }

  if (error) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'error.main'
        }}>
        <Typography variant="h6">Error loading quizzes</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error.message || 'Something went wrong'}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Results count */}
      {pagination && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {quizzes.length} of {pagination.totalItems} quiz
            {pagination.totalItems !== 1 ? 'es' : ''}
          </Typography>
        </Box>
      )}

      {/* Quiz grid */}
      <QuizGrid quizzes={quizzes} columns={columns} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Empty state */}
      {quizzes.length === 0 && !isLoading && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary'
          }}>
          <Typography variant="h6">{emptyMessage}</Typography>
        </Box>
      )}
    </Stack>
  );
};
