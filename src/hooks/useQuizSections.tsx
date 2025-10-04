import { useContext } from 'react';
import useSWR from 'swr';
import { AuthContext } from '../context/auth-context';
import { ConfigContext } from '../context/config-context';
import { Quiz } from '../models/quiz';
import { discoverApiService } from '../services/api/discover-api';
import { QuizSections } from '../types/quiz-section';
import { getQuizSectionData } from '../utils/quiz-helpers';

export const useQuizSections = (categoryId?: string) => {
  const { apiHost } = useContext(ConfigContext);
  const { user } = useContext(AuthContext);

  // Fetch quizzes using discover API endpoints (server-side sorting)
  const {
    data: sectionsData,
    error,
    isLoading
  } = useSWR<{
    popular: Quiz[];
    highestRated: Quiz[];
    recent: Quiz[];
    forYou?: Quiz[];
  }>(
    categoryId
      ? `${apiHost}/discover/category/${categoryId}`
      : user
        ? `${apiHost}/discover/sections-auth`
        : `${apiHost}/discover/sections`,
    async () => {
      if (categoryId) {
        // For category pages, get quizzes from that category using search API
        const [popularResult, ratedResult, recentResult] = await Promise.all([
          discoverApiService.searchQuizzes(
            { category: categoryId },
            { limit: 10, sortBy: 'popular' }
          ),
          discoverApiService.searchQuizzes(
            { category: categoryId },
            { limit: 10, sortBy: 'rating' }
          ),
          discoverApiService.searchQuizzes(
            { category: categoryId },
            { limit: 10, sortBy: 'recent' }
          )
        ]);

        // Generate sections from category quizzes
        return {
          popular: popularResult.quizzes,
          highestRated: ratedResult.quizzes,
          recent: recentResult.quizzes
        };
      }

      // For homepage, fetch from discover search endpoint with different sort options
      const results = await Promise.all([
        discoverApiService.searchQuizzes({}, { limit: 10, sortBy: 'popular' }),
        discoverApiService.searchQuizzes({}, { limit: 10, sortBy: 'rating' }),
        discoverApiService.searchQuizzes({}, { limit: 10, sortBy: 'recent' }),
        user ? discoverApiService.getRecommendedForUser(10) : null
      ]);

      return {
        popular: results[0].quizzes,
        highestRated: results[1].quizzes,
        recent: results[2].quizzes,
        ...(results[3] && { forYou: results[3] })
      };
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2 * 60 * 1000 // 2 minutes
    }
  );

  // Convert to QuizSections format
  const sections: QuizSections | undefined = sectionsData
    ? {
        popular: getQuizSectionData(sectionsData.popular, 'popular'),
        highestRated: getQuizSectionData(
          sectionsData.highestRated,
          'highestRated'
        ),
        recent: getQuizSectionData(sectionsData.recent, 'recent'),
        ...(sectionsData.forYou && {
          forYou: getQuizSectionData(sectionsData.forYou, 'forYou')
        })
      }
    : undefined;

  return {
    sections,
    error,
    isLoading
  };
};
