import { useState } from 'react';
import { QuizFilters } from '../types/pagination';

const defaultFilters: QuizFilters = {
  type: undefined,
  sortBy: 'popular',
  search: undefined
};

export const useQuizFilters = (initialFilters: Partial<QuizFilters> = {}) => {
  const [filters, setFilters] = useState<QuizFilters>({
    ...defaultFilters,
    ...initialFilters
  });

  const updateFilters = (newFilters: Partial<QuizFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const updateType = (type: string | undefined) => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const updateSortBy = (sortBy: QuizFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const updateSearch = (search: string | undefined) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = () => {
    return !!(
      (filters.search && filters.search.trim()) ||
      (filters.type && filters.type !== 'ALL') ||
      (filters.sortBy && filters.sortBy !== 'popular')
    );
  };

  return {
    filters,
    updateFilters,
    updateType,
    updateSortBy,
    updateSearch,
    clearFilters,
    hasActiveFilters: hasActiveFilters()
  };
};
