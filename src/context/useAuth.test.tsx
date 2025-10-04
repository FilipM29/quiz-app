import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactNode } from 'react';
import { AuthContext, useAuth } from './auth-context';
import { AuthState } from '../types/auth';

describe('useAuth', () => {
  const createWrapper = (authState: AuthState) => {
    return ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={authState}>
        {children}
      </AuthContext.Provider>
    );
  };

  describe('Context access', () => {
    it('should return auth state from context', () => {
      const mockAuthState: AuthState = {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          firebaseId: 'firebase-123'
        },
        isAuthenticated: true,
        isLoading: false,
        token: 'mock-token'
      };

      const wrapper = createWrapper(mockAuthState);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toEqual(mockAuthState);
    });

    it('should return unauthenticated state', () => {
      const mockAuthState: AuthState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null
      };

      const wrapper = createWrapper(mockAuthState);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should return loading state', () => {
      const mockAuthState: AuthState = {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        token: null
      };

      const wrapper = createWrapper(mockAuthState);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should provide user information when authenticated', () => {
      const mockAuthState: AuthState = {
        user: {
          id: 'user-1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          firebaseId: 'firebase-456'
        },
        isAuthenticated: true,
        isLoading: false,
        token: 'valid-token'
      };

      const wrapper = createWrapper(mockAuthState);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toEqual({
        id: 'user-1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        firebaseId: 'firebase-456'
      });
      expect(result.current.token).toBe('valid-token');
    });
  });

  describe('Initial state', () => {
    it('should use initial loading state when no provider', () => {
      // When used without AuthProvider, context will have initial state
      const { result } = renderHook(() => useAuth());

      // The default context has isLoading: true
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
