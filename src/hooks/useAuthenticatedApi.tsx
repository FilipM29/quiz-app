import { useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import { categoryApiService } from '../services/api/category-api';
import { discoverApiService } from '../services/api/discover-api';
import { playApiService } from '../services/api/play-api';
import { quizApiService } from '../services/api/quiz-api';
import { quizCreationApiService } from '../services/api/quiz-creation-api';
import { ratingApiService } from '../services/api/rating-api';
import { scoringApiService } from '../services/api/scoring-api';
import { userApiService } from '../services/api/user-api';

/**
 * Hook that ensures all API services have the current auth token
 */
export const useAuthenticatedApi = () => {
  const { token } = useAuth();

  useEffect(() => {
    // Update all API services with the current auth token
    const services = [
      playApiService,
      quizApiService,
      quizCreationApiService,
      userApiService,
      categoryApiService,
      discoverApiService,
      scoringApiService,
      ratingApiService
    ];

    services.forEach((service) => {
      if (
        'setAuthToken' in service &&
        typeof (service as unknown as { setAuthToken?: unknown })
          .setAuthToken === 'function'
      ) {
        (
          service as unknown as { setAuthToken: (token: string | null) => void }
        ).setAuthToken(token);
      }
    });
  }, [token]);

  return {
    playApiService,
    quizApiService,
    quizCreationApiService,
    userApiService,
    categoryApiService,
    discoverApiService,
    scoringApiService,
    ratingApiService
  };
};
