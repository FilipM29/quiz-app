import { z } from 'zod';
import { backendConfig } from '../../config/backend';
import { Question } from '../../models/question';
import { Quiz } from '../../models/quiz';
import { Round } from '../../models/round';
import {
  PaginatedResponseSchema,
  QuestionSchema,
  QuizSchema,
  RoundSchema
} from '../../schemas/validation';
import { PaginatedResponse, PaginationParams } from '../../types/pagination';
import { QuizSections } from '../../types/quiz-section';
import { BaseApiService } from './base-api';

export class QuizApiService extends BaseApiService {
  async getQuizById(id: string): Promise<Quiz> {
    return this.get<Quiz>(backendConfig.apiUrl.quiz.findById(id), QuizSchema);
  }

  async createQuiz(
    quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Quiz> {
    return this.post<Quiz>(backendConfig.apiUrl.quiz.create, quiz, QuizSchema);
  }

  async updateQuiz(id: string, quiz: Partial<Quiz>): Promise<Quiz> {
    return this.put<Quiz>(
      backendConfig.apiUrl.quiz.update(id),
      quiz,
      QuizSchema
    );
  }

  async deleteQuiz(id: string): Promise<void> {
    return this.delete<void>(backendConfig.apiUrl.quiz.delete(id));
  }

  async getQuizSections(categoryId?: string): Promise<QuizSections> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    // Note: Skip validation for QuizSections because it contains React elements (icon)
    // which cannot be validated by Zod
    return this.get<QuizSections>(
      `${backendConfig.apiUrl.quiz.sections}${params}`
    );
  }

  async searchQuizzes(
    query: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Quiz>> {
    const searchParams = new URLSearchParams({ q: query });

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    return this.get<PaginatedResponse<Quiz>>(
      `${backendConfig.apiUrl.quiz.search}?${searchParams.toString()}`,
      PaginatedResponseSchema(QuizSchema)
    );
  }

  async getQuizRounds(quizId: string): Promise<Round[]> {
    return this.get<Round[]>(
      backendConfig.apiUrl.quiz.getRounds(quizId),
      z.array(RoundSchema)
    );
  }

  async getRoundQuestions(roundId: string): Promise<Question[]> {
    return this.get<Question[]>(
      backendConfig.apiUrl.rounds.getQuestions(roundId),
      z.array(QuestionSchema)
    );
  }
}

export const quizApiService = new QuizApiService();
