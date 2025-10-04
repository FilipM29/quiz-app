import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionContainer } from '../components/layout/SectionContainer';
import { QuizFilters } from '../components/quiz/QuizFilters';
import { QuizPaginatedGrid } from '../components/quiz/QuizPaginatedGrid';
import { useCategories } from '../context/categories-context';
import { usePaginatedQuizzes } from '../hooks/usePaginatedQuizzes';
import { useQuizFilters } from '../hooks/useQuizFilters';
import { isIconUrl } from '../utils/quiz-placeholders';

interface BrowseParams {
  category?: string;
  type?: string;
  sortBy?: string;
}

export const Route = createFileRoute('/browse')({
  component: BrowseComponent,
  validateSearch: (search: Record<string, unknown>): BrowseParams => {
    return {
      category: (search.category as string) || undefined,
      type: (search.type as string) || undefined,
      sortBy: (search.sortBy as string) || undefined
    };
  }
});

function BrowseComponent() {
  const { category, type, sortBy } = Route.useSearch();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const validSortByValues = ['popular', 'recent', 'rating', 'title'] as const;
  const validSortBy = (
    validSortByValues.includes(sortBy as (typeof validSortByValues)[number])
      ? sortBy
      : 'popular'
  ) as 'popular' | 'recent' | 'rating' | 'title';

  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useQuizFilters({
      category,
      type,
      sortBy: validSortBy
    });

  const {
    quizzes,
    pagination,
    currentPage,
    handlePageChange,
    isLoading,
    error
  } = usePaginatedQuizzes({
    ...filters
  });

  return (
    <PageContainer>
      <SectionContainer
        title="Browse Quizzes"
        subtitle="Discover engaging quizzes across various topics"
        icon={<SearchIcon color="primary" />}
        centered>
        {/* Enhanced Filters */}
        <Box sx={{ mb: 4 }}>
          <QuizFilters
            filters={filters}
            onFilterChange={updateFilters}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            showTypeFilter={true}
            showSortFilter={true}
          />

          {/* Category Filter */}
          {!categoriesLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category || 'ALL'}
                  label="Category"
                  onChange={(e) =>
                    updateFilters({
                      category:
                        e.target.value === 'ALL' ? undefined : e.target.value
                    })
                  }>
                  <MenuItem value="ALL">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                        {category.icon &&
                          (isIconUrl(category.icon) ? (
                            <img
                              src={category.icon}
                              alt={`${category.label} icon`}
                              style={{
                                width: '16px',
                                height: '16px',
                                objectFit: 'contain'
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: '1rem' }}>
                              {category.icon}
                            </span>
                          ))}
                        {category.label} ({category.quizCount})
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        {/* Results Grid */}
        <QuizPaginatedGrid
          quizzes={quizzes}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          error={error}
          emptyMessage="No quizzes found matching your criteria"
        />

        {/* Results Info */}
        {!isLoading && pagination && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {(currentPage - 1) * pagination.itemsPerPage + 1} -{' '}
              {Math.min(
                currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{' '}
              of {pagination.totalItems} quizzes
            </Typography>
          </Box>
        )}
      </SectionContainer>
    </PageContainer>
  );
}
