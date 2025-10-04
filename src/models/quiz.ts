import { Round } from './round';

export enum QuizType {
  SLIDES = 'SLIDES',
  JEOPARDY = 'JEOPARDY'
}

export enum QuizStatus {
  CONCEPT = 'CONCEPT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum QuizVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export type Quiz = {
  id: string;
  title: string;
  pictureUrl?: string | null;
  description: string;
  category: string;
  difficulty: Difficulty;
  quizType: QuizType;
  quizStatus: QuizStatus;
  quizVisibility: QuizVisibility;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  numOfRounds: number;
  numOfPlays: number;
  rating: number;
  rounds?: Round[];
};
