import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from '../../context/auth-context';
import { categoryApiService } from '../../services/api/category-api';
import { discoverApiService } from '../../services/api/discover-api';
import { playApiService } from '../../services/api/play-api';
import { quizApiService } from '../../services/api/quiz-api';
import { quizCreationApiService } from '../../services/api/quiz-creation-api';
import { ratingApiService } from '../../services/api/rating-api';
import { scoringApiService } from '../../services/api/scoring-api';
import { userApiService } from '../../services/api/user-api';
import { auth } from '../../services/firebase/config';
import type { AuthState, User } from '../../types/auth';

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();

          try {
            // Set the auth token on ALL API services before making API calls
            userApiService.setAuthToken(token);
            quizCreationApiService.setAuthToken(token);
            playApiService.setAuthToken(token);
            scoringApiService.setAuthToken(token);
            ratingApiService.setAuthToken(token);
            quizApiService.setAuthToken(token);
            categoryApiService.setAuthToken(token);
            discoverApiService.setAuthToken(token);

            let user: User | undefined;

            try {
              // PREFERRED: Try to get user by Firebase ID using dedicated endpoint
              // This requires backend endpoint: GET /users/firebase/:firebaseId
              user = await userApiService.getUserByFirebaseId(firebaseUser.uid);
            } catch (error) {
              // FALLBACK: If endpoint not implemented (404), use legacy method
              // ⚠️ SECURITY WARNING: This fetches ALL users - security vulnerability
              // TODO: Remove this fallback once backend implements /users/firebase/:id
              if (
                error instanceof Error &&
                'status' in error &&
                (error as { status: number }).status === 404
              ) {
                // Endpoint not found - try legacy method
                const allUsers = await userApiService.getAllUsers();
                user = allUsers.find((u) => u.firebaseId === firebaseUser.uid);
              } else {
                throw error; // Re-throw other errors
              }
            }

            // If user doesn't exist in database, create them (first-time login)
            if (!user) {
              user = await userApiService.createUser({
                email: firebaseUser.email || '',
                firstName: firebaseUser.displayName?.split(' ')[0] || '',
                lastName: firebaseUser.displayName?.split(' ')[1] || '',
                firebaseId: firebaseUser.uid
              });
            }

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              token
            });
          } catch (error) {
            // Log error in development only
            if (import.meta.env.DEV) {
              console.error('Error setting up user:', error);
            }
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              token: null
            });
          }
        } else {
          // Clear all auth tokens on logout
          userApiService.setAuthToken(null);
          quizCreationApiService.setAuthToken(null);
          playApiService.setAuthToken(null);
          scoringApiService.setAuthToken(null);
          ratingApiService.setAuthToken(null);
          quizApiService.setAuthToken(null);
          categoryApiService.setAuthToken(null);
          discoverApiService.setAuthToken(null);

          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null
          });
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}
