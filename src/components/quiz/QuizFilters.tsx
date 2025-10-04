import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { QuizFilters as QuizFiltersType } from '../../types/pagination';

interface QuizFiltersProps {
  filters: QuizFiltersType;
  onFilterChange: (filters: Partial<QuizFiltersType>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  showTypeFilter?: boolean;
  showSortFilter?: boolean;
}

const quizTypes = [
  { value: 'ALL', label: 'All Types' },
  { value: 'SLIDES', label: 'Slides' }
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'recent', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'A-Z' }
];

export const QuizFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  showTypeFilter = true,
  showSortFilter = true
}: QuizFiltersProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ color: 'primary.main' }}>
          <FilterListIcon />
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="center">
        {showTypeFilter && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Quiz Type</InputLabel>
            <Select
              value={filters.type || 'ALL'}
              label="Quiz Type"
              onChange={(e) =>
                onFilterChange({
                  type: e.target.value === 'ALL' ? undefined : e.target.value
                })
              }>
              {quizTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {showSortFilter && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy || 'popular'}
              label="Sort By"
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as QuizFiltersType['sortBy']
                })
              }>
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
            size="small">
            Clear Filters
          </Button>
        )}
      </Stack>
    </Box>
  );
};
