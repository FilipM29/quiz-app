import { backendConfig } from '../../config/backend';
import { Quiz } from '../../models/quiz';
import { BaseApiService } from './base-api';

interface DiscoverResponse<T> {
  quizzes: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface SearchFilters {
  query?: string;
  authorId?: string;
  quizType?: 'SLIDES' | 'JEOPARDY';
  category?: string;
  minRating?: number;
  minRounds?: number;
  maxRounds?: number;
}

interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'popular' | 'recent' | 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export class DiscoverApiService extends BaseApiService {
  async getRecommendedForUser(limit = 10): Promise<Quiz[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    const url = `${backendConfig.apiUrl.discover.recommended}?${params.toString()}`;
    return this.get<Quiz[]>(url);
  }

  async searchQuizzes(
    filters: SearchFilters,
    options: SearchOptions = {}
  ): Promise<DiscoverResponse<Quiz>> {
    const params = new URLSearchParams();

    // Add filters
    if (filters.query) params.append('q', filters.query);
    if (filters.authorId) params.append('author', filters.authorId);
    if (filters.quizType) params.append('type', filters.quizType);
    if (filters.category) params.append('category', filters.category);
    if (filters.minRating)
      params.append('minRating', filters.minRating.toString());
    if (filters.minRounds)
      params.append('minRounds', filters.minRounds.toString());
    if (filters.maxRounds)
      params.append('maxRounds', filters.maxRounds.toString());

    // Add options
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `${backendConfig.apiUrl.discover.search}?${params.toString()}`;
    return this.get<DiscoverResponse<Quiz>>(url);
  }

  async getSimilarQuizzes(quizId: string, limit = 5): Promise<Quiz[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    const url = `${backendConfig.apiUrl.discover.similar(quizId)}?${params.toString()}`;
    return this.get<Quiz[]>(url);
  }

  async getQuizStats(): Promise<{
    totalQuizzes: number;
    totalPlays: number;
    avgRating: number;
    topAuthors: Array<{
      id: string;
      firstName: string;
      lastName: string;
      _count: number;
    }>;
  }> {
    return this.get(backendConfig.apiUrl.discover.stats);
  }
}

export const discoverApiService = new DiscoverApiService();
