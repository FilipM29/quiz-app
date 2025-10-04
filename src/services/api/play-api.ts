import { backendConfig } from '../../config/backend';
import { BaseApiService } from './base-api';

export interface PlaySession {
  id: string;
  quizId: string;
  hostId: string;
  playType:
    | 'SINGLE_ONLINE'
    | 'SINGLE_OFFLINE'
    | 'MULTI_ONLINE'
    | 'MULTI_OFFLINE';
  status: 'waiting' | 'active' | 'finished';
  currentRoundIndex: number;
  currentQuestionIndex: number;
  players: Array<{
    userId: string;
    username: string;
    score: number;
    isReady: boolean;
    isGuest: boolean;
  }>;
  settings: {
    maxPlayers: number;
    timePerQuestion: number;
    showCorrectAnswer: boolean;
    allowLateJoin: boolean;
    randomizeQuestions: boolean;
  };
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface StartSessionRequest {
  quizId: string;
  playType:
    | 'SINGLE_ONLINE'
    | 'SINGLE_OFFLINE'
    | 'MULTI_ONLINE'
    | 'MULTI_OFFLINE';
  settings?: {
    maxPlayers?: number;
    timePerQuestion?: number;
    showCorrectAnswer?: boolean;
    allowLateJoin?: boolean;
    randomizeQuestions?: boolean;
  };
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  answer: string;
  timeTaken?: number;
}

export class PlayApiService extends BaseApiService {
  async startSession(request: StartSessionRequest): Promise<PlaySession> {
    return this.post<PlaySession>(backendConfig.apiUrl.play.start, request);
  }

  async joinSession(
    sessionId: string
  ): Promise<{ session: PlaySession; assignedUserId: string }> {
    return this.post<{ session: PlaySession; assignedUserId: string }>(
      backendConfig.apiUrl.play.join,
      {
        sessionId
      }
    );
  }

  async startGame(sessionId: string): Promise<void> {
    return this.post<void>(backendConfig.apiUrl.play.startGame(sessionId), {});
  }

  async submitAnswer(request: SubmitAnswerRequest): Promise<void> {
    return this.post<void>(backendConfig.apiUrl.play.answer, request);
  }

  async nextQuestion(sessionId: string): Promise<void> {
    return this.post<void>(backendConfig.apiUrl.play.next(sessionId), {});
  }

  async finishSession(sessionId: string): Promise<void> {
    return this.post<void>(backendConfig.apiUrl.play.finish(sessionId), {});
  }
}

export const playApiService = new PlayApiService();
