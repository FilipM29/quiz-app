import { zodResolver } from '@hookform/resolvers/zod';
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Typography
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthCard } from '../components/auth/AuthCard';
import { TextField } from '../forms/components/TextField';
import {
  RegisterFormData,
  useRegisterFormSchema
} from '../forms/schemas/registerSchema';
import { authService } from '../services/auth/auth-service';

export const Route = createFileRoute('/register')({
  component: Register,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || '/'
  })
});

function Register() {
  const { redirect } = Route.useSearch();
  const schema = useRegisterFormSchema();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  const acceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Complete registration: Firebase Auth + Database user creation
      await authService.registerComplete(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );

      // Wait for AuthProvider to finish setting up auth state
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to home page on successful registration
      navigate({ to: redirect });
    } catch (err) {
      // Handle specific Firebase errors
      if (err instanceof Error) {
        if (err.message.includes('auth/email-already-in-use')) {
          setError(
            'An account with this email already exists. Please try logging in instead.'
          );
        } else if (err.message.includes('auth/weak-password')) {
          setError('Password is too weak. Please choose a stronger password.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subheader="Join us to create and play amazing quizzes!"
      error={error}
      isLoading={isLoading}
      submitButtonText="Create Account"
      submitDisabled={!acceptTerms}
      onSubmit={handleSubmit(onSubmit)}
      footerText="Already have an account?"
      footerLinkText="Sign in here"
      footerLinkTo="/login"
      footerLinkSearch={{ redirect }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextField name="firstName" label="First Name" control={control} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField name="lastName" label="Last Name" control={control} />
        </Grid>
      </Grid>

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
        helperText="Minimum 6 characters"
      />

      <TextField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        control={control}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptTerms}
            onChange={(e) => setValue('acceptTerms', e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            I agree to the{' '}
            <Link href="#" underline="hover">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" underline="hover">
              Privacy Policy
            </Link>
          </Typography>
        }
      />
    </AuthCard>
  );
}
