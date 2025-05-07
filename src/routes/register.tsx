import { zodResolver } from '@hookform/resolvers/zod';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth-context.tsx';
import { TextField } from '../forms/components/TextField.tsx';
import {
  LoginFormData,
  useLoginFormSchema
} from '../forms/schemas/loginSchema.ts';
import { useUser } from '../hooks/use-user.tsx';

export const Route = createFileRoute('/register')({
  component: RouteComponent
});

function RouteComponent() {
  const schema = useLoginFormSchema();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(schema)
  });
  const { signupWithEmailAndPassword, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useUser();
  const navigate = useNavigate();

  const onSubmit = async ({
    firstName,
    lastName,
    email,
    password
  }: LoginFormData) => {
    setIsLoading(true);
    try {
      const firebaseUser = await signupWithEmailAndPassword(email, password);
      try {
        const firebaseToken = await firebaseUser.user.getIdToken();
        await registerUser(
          email,
          firstName,
          lastName,
          firebaseUser.user.uid,
          firebaseToken
        );
      } catch (apiError) {
        //TODO: replace with some error snackbar or smth
        console.error('Error registering user:', apiError);
      }
      setIsLoading(false);
      await navigate({ to: '/' });
    } catch (error) {
      //TODO: replace with some error snackbar or smth
      console.error('Error creating firebase user:', error);
      setIsLoading(false);
    }
  };

  const onGoogleRegister = async () => {
    await loginWithGoogle();
    await navigate({ to: '/' });
  };

  const onBackToLogin = async () => {
    await navigate({ to: '/login' });
  };

  return (
    <Container>
      <Card
        elevation={1}
        sx={{ maxWidth: 345, margin: 'auto', marginTop: '150px' }}>
        <CardHeader
          title="Register"
          action={
            <Button size="small" color="primary" onClick={onBackToLogin}>
              Back to login
            </Button>
          }
        />
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Loading...
            </Typography>
          </Box>
        ) : (
          <>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    control={control}
                  />
                  <TextField
                    name="lastName"
                    label="Last Name"
                    control={control}
                  />
                  <TextField name="email" label="Email" control={control} />
                  <TextField
                    name="password"
                    label="Password"
                    control={control}
                    type="password"
                  />
                  <Button size="small" color="primary" type="submit">
                    Register
                  </Button>
                </Stack>
              </form>
            </CardContent>
            <Divider sx={{ px: '10px' }} />
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', margin: 'auto' }}>
                  Or continue with:
                </Typography>
                <Button
                  size="small"
                  color="primary"
                  onClick={onGoogleRegister}
                  startIcon={<GoogleIcon />}>
                  Google
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Card>
    </Container>
  );
}
