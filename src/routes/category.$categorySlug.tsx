import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionContainer } from '../components/layout/SectionContainer';
import { QuizFilters } from '../components/quiz/QuizFilters';
import { QuizPaginatedGrid } from '../components/quiz/QuizPaginatedGrid';
import { QuizSection } from '../components/quiz/QuizSection';
import { useCategories } from '../hooks/useCategories';
import { usePaginatedQuizzes } from '../hooks/usePaginatedQuizzes';
import { useQuizFilters } from '../hooks/useQuizFilters';
import { useQuizSections } from '../hooks/useQuizSections';
import { isIconUrl } from '../utils/quiz-placeholders';

export const Route = createFileRoute('/category/$categorySlug')({
  component: CategoryComponent
});

function CategoryComponent() {
  const { categorySlug } = Route.useParams();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useQuizFilters();

  // Find the category by value (slug is lowercase value)
  const category = categories.find(
    (cat) => cat.value.toLowerCase() === categorySlug
  );
  // Use uppercase category value for API calls
  const categoryId = category?.value;

  // Get sections for this category (when no filters applied)
  const { sections, isLoading: sectionsLoading } = useQuizSections(categoryId);

  // Get paginated quizzes (when filters applied)
  const {
    quizzes,
    pagination,
    currentPage,
    handlePageChange,
    isLoading: paginatedLoading,
    error: paginatedError
  } = usePaginatedQuizzes({
    category: categoryId,
    ...filters
  });

  if (categoriesLoading) {
    return (
      <PageContainer>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Loading category...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!category) {
    return (
      <PageContainer>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error.main">
            Category not found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The category "{categorySlug}" does not exist
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Category Header */}
      <SectionContainer
        title={category.label}
        subtitle={`Explore ${category.label} quizzes`}
        icon={
          category.icon ? (
            isIconUrl(category.icon) ? (
              <img
                src={category.icon}
                alt={`${category.label} icon`}
                style={{
                  width: '2rem',
                  height: '2rem',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <span style={{ fontSize: '2rem', color: category.color }}>
                {category.icon}
              </span>
            )
          ) : undefined
        }
        centered>
        {/* Filter Controls */}
        <QuizFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </SectionContainer>

      {/* Content - either sections or filtered results */}
      {hasActiveFilters ? (
        // Show filtered paginated results
        <SectionContainer
          title="Quiz Results"
          subtitle={`Filtered results for ${category.label}`}
          centered>
          <QuizPaginatedGrid
            quizzes={quizzes}
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isLoading={paginatedLoading}
            error={paginatedError}
            emptyMessage={`No ${category.label.toLowerCase()} quizzes found with current filters`}
          />
        </SectionContainer>
      ) : (
        // Show category sections
        <>
          {sectionsLoading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                Loading quizzes...
              </Typography>
            </Box>
          ) : sections ? (
            <>
              {sections.forYou && <QuizSection {...sections.forYou} />}
              <QuizSection {...sections.popular} />
              <QuizSection {...sections.highestRated} />
              <QuizSection {...sections.recent} />
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No quizzes found in this category
              </Typography>
            </Box>
          )}
        </>
      )}
    </PageContainer>
  );
}
