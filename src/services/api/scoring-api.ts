import { backendConfig } from '../../config/backend';
import { BaseApiService } from './base-api';

export interface PendingSession {
  id: string;
  quizId: string;
  hostId: string;
  playType: string;
  status: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  quiz: {
    id: string;
    title: string;
    pictureUrl?: string;
  };
  host: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  _count: {
    playerAnswers: number;
  };
}

export interface PlayerAnswer {
  id: string;
  questionId: string;
  userId?: string;
  guestIdentifier?: string;
  answer: string;
  submittedAt: string;
  scoringStatus: 'PENDING' | 'AUTO_SCORED' | 'MANUALLY_SCORED';
  isCorrect?: boolean;
  points?: number;
  timeToAnswer?: number;
  teacherFeedback?: string;
  scoredById?: string;
  scoredAt?: string;
  question: {
    id: string;
    text: string;
    type: string;
    answer: string;
    value: number;
    pictureUrl?: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  scoredBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface SessionWithAnswers {
  id: string;
  quizId: string;
  hostId: string;
  playType: string;
  status: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  quiz: {
    id: string;
    title: string;
    pictureUrl?: string;
  };
  host: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  players: Array<{
    id: string;
    username: string;
    score: number;
    isGuest: boolean;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
    };
  }>;
  playerAnswers: PlayerAnswer[];
}

export interface ScoreAnswerRequest {
  isCorrect: boolean;
  points: number;
  feedback?: string;
}

export class ScoringApiService extends BaseApiService {
  async getPendingSessions(): Promise<PendingSession[]> {
    return this.get<PendingSession[]>(
      `${backendConfig.apiHost}/play/scoring/sessions`
    );
  }

  async getSessionWithAnswers(sessionId: string): Promise<SessionWithAnswers> {
    return this.get<SessionWithAnswers>(
      `${backendConfig.apiHost}/play/scoring/sessions/${sessionId}`
    );
  }

  async getPendingAnswers(sessionId: string): Promise<PlayerAnswer[]> {
    return this.get<PlayerAnswer[]>(
      `${backendConfig.apiHost}/play/scoring/sessions/${sessionId}/answers`
    );
  }

  async scoreAnswer(
    answerId: string,
    scoreData: ScoreAnswerRequest
  ): Promise<PlayerAnswer> {
    return this.post<PlayerAnswer>(
      `${backendConfig.apiHost}/play/scoring/answers/${answerId}/score`,
      scoreData
    );
  }

  async getQuizSessions(quizId: string): Promise<PendingSession[]> {
    return this.get<PendingSession[]>(
      `${backendConfig.apiHost}/play/scoring/quizzes/${quizId}/sessions`
    );
  }
}

export const scoringApiService = new ScoringApiService();
