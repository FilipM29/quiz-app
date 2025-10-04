import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useQuizFilters } from './useQuizFilters';

describe('useQuizFilters', () => {
  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useQuizFilters());

    expect(result.current.filters).toEqual({
      type: undefined,
      sortBy: 'popular',
      search: undefined
    });
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('should initialize with custom filters', () => {
    const { result } = renderHook(() =>
      useQuizFilters({
        type: 'SLIDES',
        sortBy: 'recent'
      })
    );

    expect(result.current.filters).toEqual({
      type: 'SLIDES',
      sortBy: 'recent',
      search: undefined
    });
  });

  it('should update filters', () => {
    const { result } = renderHook(() => useQuizFilters());

    act(() => {
      result.current.updateFilters({ type: 'SLIDES', sortBy: 'recent' });
    });

    expect(result.current.filters).toEqual({
      type: 'SLIDES',
      sortBy: 'recent',
      search: undefined
    });
  });

  it('should update type filter', () => {
    const { result } = renderHook(() => useQuizFilters());

    act(() => {
      result.current.updateType('SLIDES');
    });

    expect(result.current.filters.type).toBe('SLIDES');
  });

  it('should update sortBy filter', () => {
    const { result } = renderHook(() => useQuizFilters());

    act(() => {
      result.current.updateSortBy('recent');
    });

    expect(result.current.filters.sortBy).toBe('recent');
  });

  it('should update search filter', () => {
    const { result } = renderHook(() => useQuizFilters());

    act(() => {
      result.current.updateSearch('test query');
    });

    expect(result.current.filters.search).toBe('test query');
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() =>
      useQuizFilters({
        type: 'SLIDES',
        sortBy: 'recent',
        search: 'test'
      })
    );

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({
      type: undefined,
      sortBy: 'popular',
      search: undefined
    });
    expect(result.current.hasActiveFilters).toBe(false);
  });

  describe('hasActiveFilters', () => {
    it('should return false for default filters', () => {
      const { result } = renderHook(() => useQuizFilters());

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should return true when search is set', () => {
      const { result } = renderHook(() => useQuizFilters());

      act(() => {
        result.current.updateSearch('test');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should return false when search is empty string', () => {
      const { result } = renderHook(() => useQuizFilters());

      act(() => {
        result.current.updateSearch('  ');
      });

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should return true when type is set', () => {
      const { result } = renderHook(() => useQuizFilters());

      act(() => {
        result.current.updateType('SLIDES');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should return false when type is ALL', () => {
      const { result } = renderHook(() => useQuizFilters());

      act(() => {
        result.current.updateType('ALL');
      });

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should return true when sortBy is not popular', () => {
      const { result } = renderHook(() => useQuizFilters());

      act(() => {
        result.current.updateSortBy('recent');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should return false when sortBy is popular', () => {
      const { result } = renderHook(() => useQuizFilters({ sortBy: 'recent' }));

      act(() => {
        result.current.updateSortBy('popular');
      });

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should return true when multiple filters are active', () => {
      const { result } = renderHook(() => useQuizFilters());

      act(() => {
        result.current.updateFilters({
          type: 'SLIDES',
          sortBy: 'recent',
          search: 'test'
        });
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });
  });
});
