import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UpdateIcon from '@mui/icons-material/Update';
import React from 'react';
import { Quiz } from '../models/quiz';
import { QuizSectionData } from '../types/quiz-section';

export type SortOption = 'popular' | 'newest' | 'rating' | 'alphabetical';

export const sortQuizzes = (quizzes: Quiz[], sortBy: SortOption): Quiz[] => {
  const sorted = [...quizzes];

  switch (sortBy) {
    case 'popular':
      return sorted.sort((a, b) => (b.numOfPlays || 0) - (a.numOfPlays || 0));

    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'rating':
      // Using numOfPlays as proxy for rating until rating field is available
      return sorted.sort((a, b) => (b.numOfPlays || 0) - (a.numOfPlays || 0));

    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sorted;
  }
};

export const filterQuizzesByType = (quizzes: Quiz[], type: string): Quiz[] => {
  if (type === 'ALL' || !type) return quizzes;
  return quizzes.filter((quiz) => quiz.quizType === type);
};

export const searchQuizzes = (quizzes: Quiz[], query: string): Quiz[] => {
  if (!query.trim()) return quizzes;

  const searchTerm = query.toLowerCase().trim();
  return quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm)
  );
};

export const getQuizSectionData = (
  quizzes: Quiz[],
  type: 'forYou' | 'popular' | 'highestRated' | 'recent',
  limit: number = 10
): QuizSectionData => {
  let sectionQuizzes: Quiz[];
  let title: string;
  let subtitle: string;
  let icon: React.ReactNode;

  switch (type) {
    case 'forYou': {
      // For now, use a mix of popular and recent quizzes
      const popularQuizzes = sortQuizzes(quizzes, 'popular').slice(
        0,
        limit / 2
      );
      const recentQuizzes = sortQuizzes(quizzes, 'newest').slice(0, limit / 2);
      sectionQuizzes = [...popularQuizzes, ...recentQuizzes]
        .filter(
          (quiz, index, self) =>
            self.findIndex((q) => q.id === quiz.id) === index
        )
        .slice(0, limit);
      title = 'For You';
      subtitle = 'Recommended quizzes based on your interests';
      icon = <PersonIcon color="primary" />;
      break;
    }

    case 'popular':
      sectionQuizzes = sortQuizzes(quizzes, 'popular').slice(0, limit);
      title = 'Most Popular';
      subtitle = 'Most played quizzes by our community';
      icon = <TrendingUpIcon color="primary" />;
      break;

    case 'highestRated':
      // Using popular as proxy for highest rated until rating system is implemented
      sectionQuizzes = sortQuizzes(quizzes, 'rating').slice(0, limit);
      title = 'Highest Rated';
      subtitle = 'Top-rated quizzes loved by our users';
      icon = <StarIcon color="primary" />;
      break;

    case 'recent':
      sectionQuizzes = sortQuizzes(quizzes, 'newest').slice(0, limit);
      title = 'Recent';
      subtitle = 'Fresh content just added';
      icon = <UpdateIcon color="primary" />;
      break;

    default:
      sectionQuizzes = quizzes.slice(0, limit);
      title = 'Quizzes';
      subtitle = 'Available quizzes';
      icon = <StarIcon color="primary" />;
  }

  return {
    title,
    subtitle,
    quizzes: sectionQuizzes,
    icon,
    sectionType: type
  };
};

export const hasActiveFilters = (filters: {
  search?: string;
  type?: string;
  sortBy?: string;
}): boolean => {
  return !!(
    (filters.search && filters.search.trim()) ||
    (filters.type && filters.type !== 'ALL') ||
    (filters.sortBy && filters.sortBy !== 'popular')
  );
};
