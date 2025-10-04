export interface Category {
  value: string;
  label: string;
  quizCount: number;
  icon: string;
  color: string;
}

export interface CategoryWithQuizzes extends Category {
  quizzes: import('../models/quiz').Quiz[];
}
