import { backendConfig } from '../../config/backend';
import {
  CreateQuestionRequest,
  CreateQuizRequest,
  CreateRoundRequest,
  MyQuiz
} from '../../types/quiz-creation';
import { BaseApiService } from './base-api';

export class QuizCreationApiService extends BaseApiService {
  async createQuiz(data: CreateQuizRequest): Promise<MyQuiz> {
    return this.post<MyQuiz>(backendConfig.apiUrl.quiz.create, data);
  }

  async updateQuiz(
    quizId: string,
    data: Partial<CreateQuizRequest>
  ): Promise<MyQuiz> {
    return this.put<MyQuiz>(backendConfig.apiUrl.quiz.update(quizId), data);
  }

  async getMyQuizzes(userId: string): Promise<MyQuiz[]> {
    return this.get<MyQuiz[]>(backendConfig.apiUrl.quiz.myQuizzes(userId));
  }

  async getQuizById(quizId: string): Promise<MyQuiz> {
    return this.get<MyQuiz>(backendConfig.apiUrl.quiz.findById(quizId));
  }

  async deleteQuiz(quizId: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(
      backendConfig.apiUrl.quiz.delete(quizId)
    );
  }

  async createRound(data: CreateRoundRequest): Promise<{
    id: string;
    title: string;
    order: number;
    quizId: string;
  }> {
    return this.post(backendConfig.apiUrl.rounds.create, data);
  }

  async updateRound(
    roundId: string,
    data: Partial<Omit<CreateRoundRequest, 'quizId'>>
  ): Promise<{
    id: string;
    title: string;
    order: number;
    quizId: string;
  }> {
    return this.put(backendConfig.apiUrl.rounds.update(roundId), data);
  }

  async deleteRound(roundId: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(
      backendConfig.apiUrl.rounds.delete(roundId)
    );
  }

  async createQuestion(data: CreateQuestionRequest): Promise<{
    id: string;
    text: string;
    type: 'EXACT' | 'OPTIONS' | 'INTERVAL';
    value: number;
    answer: string;
    acceptableAnswers?: string[];
    options?: string[];
    range?: number;
    pictureUrl?: string;
    roundId: string;
  }> {
    return this.post(backendConfig.apiUrl.question.create, data);
  }

  async updateQuestion(
    questionId: string,
    data: Partial<Omit<CreateQuestionRequest, 'roundId'>>
  ): Promise<{
    id: string;
    text: string;
    type: 'EXACT' | 'OPTIONS' | 'INTERVAL';
    value: number;
    answer: string;
    acceptableAnswers?: string[];
    options?: string[];
    range?: number;
    pictureUrl?: string;
    roundId: string;
  }> {
    return this.put(backendConfig.apiUrl.question.update(questionId), data);
  }

  async deleteQuestion(questionId: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(
      backendConfig.apiUrl.question.delete(questionId)
    );
  }

  async getRoundsByQuizId(quizId: string): Promise<
    Array<{
      id: string;
      title: string;
      order: number;
      quizId: string;
    }>
  > {
    return this.get(backendConfig.apiUrl.quiz.getRounds(quizId));
  }

  async getQuestionsByRoundId(roundId: string): Promise<
    Array<{
      id: string;
      text: string;
      type: 'EXACT' | 'OPTIONS' | 'INTERVAL';
      value: number;
      answer: string;
      acceptableAnswers?: string[];
      options?: string[];
      range?: number;
      pictureUrl?: string;
      roundId: string;
    }>
  > {
    return this.get(backendConfig.apiUrl.rounds.getQuestions(roundId));
  }
}

export const quizCreationApiService = new QuizCreationApiService();
