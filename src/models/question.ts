export enum QuestionType {
  EXACT = 'EXACT',
  OPTIONS = 'OPTIONS',
  INTERVAL = 'INTERVAL'
}

export type Question = {
  id: string;
  type: QuestionType;
  value: number;
  text: string;
  options: string[];
  answer: string;
  acceptableAnswers: string[];
  pictureUrl?: string;
};
