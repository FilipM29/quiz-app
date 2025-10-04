import { backendConfig } from '../../config/backend';
import { BaseApiService } from './base-api';

export interface Rating {
  id: string;
  value: number;
  comment?: string | null;
  authorId: string;
  quizId: string;
}

export interface SubmitRatingRequest {
  value: number;
  comment?: string;
}

export class RatingApiService extends BaseApiService {
  async submitRating(
    quizId: string,
    request: SubmitRatingRequest
  ): Promise<Rating> {
    return this.post<Rating>(
      backendConfig.apiUrl.rating.submit(quizId),
      request
    );
  }

  async getMyRating(quizId: string): Promise<Rating> {
    return this.get<Rating>(backendConfig.apiUrl.rating.getMyRating(quizId));
  }
}

export const ratingApiService = new RatingApiService();
