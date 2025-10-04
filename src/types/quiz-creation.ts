export interface QuizBasicInfo {
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  quizType: 'SLIDES' | 'JEOPARDY';
  quizVisibility: 'PUBLIC' | 'PRIVATE';
  pictureUrl?: string;
}

export interface QuizRound {
  id?: string;
  title: string;
  order: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id?: string;
  text: string;
  type: 'EXACT' | 'OPTIONS' | 'INTERVAL';
  value: number;
  answer: string;
  acceptableAnswers?: string[];
  options?: string[];
  range?: number;
  pictureUrl?: string;
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  quizType: 'SLIDES' | 'JEOPARDY';
  quizStatus: 'CONCEPT' | 'PUBLISHED' | 'ARCHIVED';
  quizVisibility: 'PUBLIC' | 'PRIVATE';
  numOfRounds: number;
  pictureUrl?: string;
}

export interface CreateRoundRequest {
  title: string;
  order: number;
  quizId: string;
}

export interface CreateQuestionRequest {
  text: string;
  type: 'EXACT' | 'OPTIONS' | 'INTERVAL';
  value: number;
  answer: string;
  acceptableAnswers?: string[];
  options?: string[];
  range?: number;
  pictureUrl?: string;
  roundId: string;
}

export interface QuizCreationState {
  basicInfo: QuizBasicInfo;
  rounds: QuizRound[];
  currentStep: number;
  isComplete: boolean;
  quizId?: string;
}

export interface MyQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  quizType: 'SLIDES' | 'JEOPARDY';
  quizStatus: 'CONCEPT' | 'PUBLISHED' | 'ARCHIVED';
  quizVisibility: 'PUBLIC' | 'PRIVATE';
  numOfRounds: number;
  numOfPlays: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  pictureUrl?: string;
}
