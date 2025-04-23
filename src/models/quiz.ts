import { Round } from './round';

export enum QuizType {
  SLIDES = 'SLIDES',
  JEOPARDY = 'JEOPARDY'
}

export enum QuizStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum QuizVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED'
}

export type Quiz = {
  id: string;
  title: string;
  pictureUrl: string;
  description: string;
  type: QuizType;
  status: QuizStatus;
  visibility: QuizVisibility;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  numOfRounds: number;
  numOfPlayes: number;
  rounds: Round[];
};
