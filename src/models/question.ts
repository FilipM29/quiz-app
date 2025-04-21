export enum QuestionType {
  EXACT = "EXACT",
  OPTIONS = "OPTIONS",
}

export type Question = {
  id: string;
  type: QuestionType;
  value: number;
  text: string;
  options: string[];
  answer: string;
  createdAt: string;
  updatedAt: string;
  acceptableAnswers: string[];
  pictureUrl?: string;
};
