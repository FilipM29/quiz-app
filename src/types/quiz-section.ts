import { ReactNode } from 'react';
import { Quiz } from '../models/quiz';

export interface QuizSectionData {
  title: string;
  subtitle: string;
  quizzes: Quiz[];
  icon: ReactNode;
  sectionType: 'forYou' | 'popular' | 'highestRated' | 'recent';
}

export interface QuizSections {
  forYou?: QuizSectionData;
  popular: QuizSectionData;
  highestRated: QuizSectionData;
  recent: QuizSectionData;
}
