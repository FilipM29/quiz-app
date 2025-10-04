import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { ConfigContext } from '../context/config-context';
import { Quiz } from '../models/quiz';
import { discoverApiService } from '../services/api/discover-api';
import { PaginatedResponse, QuizFilters } from '../types/pagination';

interface UsePaginatedQuizzesParams extends QuizFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const usePaginatedQuizzes = (params: UsePaginatedQuizzesParams = {}) => {
  const { apiHost } = useContext(ConfigContext);
  const [currentPage, setCurrentPage] = useState(params.page || 1);
  const limit = params.limit || 12;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [params.search, params.type, params.sortBy, params.category]);

  // Build cache key for SWR
  const cacheKey = params.search
    ? `${apiHost}/discover/search?q=${params.search}&page=${currentPage}&limit=${limit}&category=${params.category || ''}`
    : params.category
      ? `${apiHost}/discover/search?category=${params.category}&page=${currentPage}&limit=${limit}&type=${params.type || ''}&sortBy=${params.sortBy || ''}`
      : `${apiHost}/discover/search?${new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
          ...(params.type && { type: params.type }),
          ...(params.sortBy && { sortBy: params.sortBy })
        }).toString()}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Quiz>>(
    cacheKey,
    async (): Promise<PaginatedResponse<Quiz>> => {
      if (params.search) {
        // Use discover search API which supports category filtering
        const result = await discoverApiService.searchQuizzes(
          {
            query: params.search,
            category: params.category,
            quizType: params.type as 'SLIDES' | 'JEOPARDY' | undefined
          },
          {
            limit,
            offset: (currentPage - 1) * limit,
            sortBy: params.sortBy
          }
        );
        // Convert DiscoverResponse to PaginatedResponse format
        return {
          data: result.quizzes,
          pagination: {
            currentPage:
              Math.floor(result.pagination.offset / result.pagination.limit) +
              1,
            itemsPerPage: result.pagination.limit,
            totalItems: result.pagination.total,
            totalPages: Math.ceil(
              result.pagination.total / result.pagination.limit
            ),
            hasNext: result.pagination.hasMore,
            hasPrevious: result.pagination.offset > 0
          }
        };
      }

      if (params.category) {
        // Use discover search API for category-specific quizzes
        const result = await discoverApiService.searchQuizzes(
          {
            category: params.category,
            quizType: params.type as 'SLIDES' | 'JEOPARDY' | undefined
          },
          {
            limit,
            offset: (currentPage - 1) * limit,
            sortBy: params.sortBy
          }
        );
        // Convert DiscoverResponse to PaginatedResponse format
        return {
          data: result.quizzes,
          pagination: {
            currentPage:
              Math.floor(result.pagination.offset / result.pagination.limit) +
              1,
            itemsPerPage: result.pagination.limit,
            totalItems: result.pagination.total,
            totalPages: Math.ceil(
              result.pagination.total / result.pagination.limit
            ),
            hasNext: result.pagination.hasMore,
            hasPrevious: result.pagination.offset > 0
          }
        };
      }

      // Fallback to search endpoint for general browsing
      const result = await discoverApiService.searchQuizzes(
        {
          quizType: params.type as 'SLIDES' | 'JEOPARDY' | undefined
        },
        {
          limit,
          offset: (currentPage - 1) * limit,
          sortBy: params.sortBy
        }
      );
      // Convert DiscoverResponse to PaginatedResponse format
      return {
        data: result.quizzes,
        pagination: {
          currentPage:
            Math.floor(result.pagination.offset / result.pagination.limit) + 1,
          itemsPerPage: result.pagination.limit,
          totalItems: result.pagination.total,
          totalPages: Math.ceil(
            result.pagination.total / result.pagination.limit
          ),
          hasNext: result.pagination.hasMore,
          hasPrevious: result.pagination.offset > 0
        }
      };
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30 * 1000 // 30 seconds
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    quizzes: data?.data || [],
    pagination: data?.pagination,
    currentPage,
    error,
    isLoading,
    mutate,
    handlePageChange
  };
};
