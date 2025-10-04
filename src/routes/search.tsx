import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionContainer } from '../components/layout/SectionContainer';
import { QuizPaginatedGrid } from '../components/quiz/QuizPaginatedGrid';
import { usePaginatedQuizzes } from '../hooks/usePaginatedQuizzes';

interface SearchParams {
  q: string;
}

export const Route = createFileRoute('/search')({
  component: SearchComponent,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: (search.q as string) || ''
    };
  }
});

function SearchComponent() {
  const { q: searchQuery } = Route.useSearch();

  const {
    quizzes,
    pagination,
    currentPage,
    handlePageChange,
    isLoading,
    error
  } = usePaginatedQuizzes({
    search: searchQuery
  });

  if (!searchQuery.trim()) {
    return (
      <PageContainer>
        <SectionContainer
          title="Search Quizzes"
          subtitle="Enter a search term to find quizzes"
          icon={<SearchIcon color="primary" />}
          centered>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No search query provided
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Use the search bar in the header to search for quizzes
            </Typography>
          </Box>
        </SectionContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionContainer
        title="Search Results"
        subtitle={`Results for "${searchQuery}"`}
        icon={<SearchIcon color="primary" />}
        centered>
        <QuizPaginatedGrid
          quizzes={quizzes}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          error={error}
          emptyMessage={`No quizzes found matching "${searchQuery}"`}
        />
      </SectionContainer>
    </PageContainer>
  );
}
