export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface QuizFilters {
  type?: string;
  sortBy?: 'popular' | 'recent' | 'rating' | 'title';
  search?: string;
  category?: string;
}
