import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthCard } from '../components/auth/AuthCard';
import { TextField } from '../forms/components/TextField';
import {
  LoginFormData,
  useLoginFormSchema
} from '../forms/schemas/loginSchema';
import { authService } from '../services/auth/auth-service';
import { logger } from '../utils/logger';

export const Route = createFileRoute('/login')({
  component: Login,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/'
  })
});

function Login() {
  const { redirect } = Route.useSearch();
  const schema = useLoginFormSchema();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      logger.debug('Attempting login with email:', data.email);
      const firebaseUser = await authService.login({
        email: data.email,
        password: data.password
      });
      logger.debug('Firebase user logged in successfully:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email
      });

      // Wait for AuthProvider to finish setting up auth state
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to redirect URL or home page on successful login
      navigate({ to: redirect });
    } catch (err) {
      logger.error('Login failed', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subheader="Sign in to access your quizzes"
      error={error}
      isLoading={isLoading}
      submitButtonText="Sign In"
      onSubmit={handleSubmit(onSubmit)}
      footerText="Don't have an account?"
      footerLinkText="Create one here"
      footerLinkTo="/register"
      footerLinkSearch={{ redirect }}>
      <TextField
        name="email"
        label="Email Address"
        type="email"
        control={control}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        control={control}
      />
    </AuthCard>
  );
}
