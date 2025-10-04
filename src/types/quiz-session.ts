import { Question } from '../models/question';
import { Quiz } from '../models/quiz';
import { Round } from '../models/round';

export interface UserAnswer {
  questionId: string;
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent?: number;
}

export interface RoundResult {
  roundIndex: number;
  round: Round;
  questionsInRound: Question[];
  answersInRound: UserAnswer[];
  roundScore: number;
  maxRoundScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

export enum QuizPhase {
  NOT_STARTED = 'NOT_STARTED',
  ROUND_INTRO = 'ROUND_INTRO',
  QUESTION = 'QUESTION',
  ANSWER_REVEAL = 'ANSWER_REVEAL', // For MULTI_OFFLINE: show correct answer before scoring
  MANUAL_SCORING = 'MANUAL_SCORING', // For MULTI_OFFLINE: manually input team scores
  ROUND_SUMMARY = 'ROUND_SUMMARY',
  QUIZ_COMPLETE = 'QUIZ_COMPLETE'
}

export interface QuizSession {
  quiz: Quiz;
  rounds: Round[];
  roundQuestions: Question[][]; // Questions organized by round
  allQuestions: Question[];
  currentRoundIndex: number;
  currentQuestionIndex: number; // Question index within current round
  currentGlobalQuestionIndex: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  totalScore: number;
  maxPossibleScore: number;
  currentPhase: QuizPhase;
  isComplete: boolean;
  startedAt: Date;
  completedAt?: Date;
  roundResults: RoundResult[];
}

export interface QuizSessionState {
  session: QuizSession | null;
  isLoading: boolean;
  error: string | null;
}

export enum QuizSessionAction {
  INIT_QUIZ = 'INIT_QUIZ',
  START_QUIZ = 'START_QUIZ',
  SUBMIT_ANSWER = 'SUBMIT_ANSWER',
  NEXT_QUESTION = 'NEXT_QUESTION',
  COMPLETE_QUIZ = 'COMPLETE_QUIZ',
  SET_ERROR = 'SET_ERROR',
  SET_LOADING = 'SET_LOADING'
}
