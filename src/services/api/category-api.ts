import { z } from 'zod';
import { backendConfig } from '../../config/backend';
import { Quiz } from '../../models/quiz';
import {
  CategorySchema,
  PaginatedResponseSchema,
  QuizSchema
} from '../../schemas/validation';
import { Category } from '../../types/category';
import {
  PaginatedResponse,
  PaginationParams,
  QuizFilters
} from '../../types/pagination';
import { BaseApiService } from './base-api';

export class CategoryApiService extends BaseApiService {
  async getAllCategories(): Promise<Category[]> {
    return this.get<Category[]>(
      backendConfig.apiUrl.category.findAll,
      z.array(CategorySchema)
    );
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.get<Category>(
      backendConfig.apiUrl.category.findById(id),
      CategorySchema
    );
  }

  async getCategoryQuizzes(
    categoryId: string,
    params?: PaginationParams & QuizFilters
  ): Promise<PaginatedResponse<Quiz>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.search) searchParams.append('search', params.search);

    const url = `${backendConfig.apiUrl.category.getQuizzes(categoryId)}?${searchParams.toString()}`;
    return this.get<PaginatedResponse<Quiz>>(
      url,
      PaginatedResponseSchema(QuizSchema)
    );
  }
}

export const categoryApiService = new CategoryApiService();
