import { Question } from "./question";

export type Round = {
  id: string;
  title: string;
  order: number;
  questions: Question[];
};
