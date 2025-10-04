import { useContext } from 'react';
import useSWR from 'swr';
import { AuthContext } from '../context/auth-context';
import { ConfigContext } from '../context/config-context';
import { quizCreationApiService } from '../services/api/quiz-creation-api';
import { MyQuiz } from '../types/quiz-creation';

export const useMyQuizzes = () => {
  const { user } = useContext(AuthContext);
  const { apiHost } = useContext(ConfigContext);

  const {
    data: quizzes,
    error,
    isLoading,
    mutate
  } = useSWR<MyQuiz[]>(
    user ? `${apiHost}/quiz/my/${user.id}` : null,
    async () => {
      if (!user) throw new Error('User not authenticated');
      return quizCreationApiService.getMyQuizzes(user.id);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30 * 1000 // 30 seconds
    }
  );

  const deleteQuiz = async (quizId: string) => {
    try {
      await quizCreationApiService.deleteQuiz(quizId);
      // Optimistically update the cache
      if (quizzes) {
        mutate(
          quizzes.filter((quiz) => quiz.id !== quizId),
          false
        );
      }
      // Revalidate to ensure consistency
      mutate();
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      throw error;
    }
  };

  const updateQuizStatus = async (
    quizId: string,
    status: 'CONCEPT' | 'PUBLISHED' | 'ARCHIVED'
  ) => {
    try {
      await quizCreationApiService.updateQuiz(quizId, { quizStatus: status });
      // Revalidate to get updated data
      mutate();
    } catch (error) {
      console.error('Failed to update quiz status:', error);
      throw error;
    }
  };

  return {
    quizzes: quizzes || [],
    error,
    isLoading,
    mutate,
    deleteQuiz,
    updateQuizStatus
  };
};
