import { zodResolver } from '@hookform/resolvers/zod';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Stack,
  Typography
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth-context.tsx';
import { TextField } from '../forms/components/TextField.tsx';
import {
  RegisterFormData,
  useRegisterFormSchema
} from '../forms/schemas/registerSchema.ts';
import { useUser } from '../hooks/use-user.tsx';
import { MESSAGES } from '../utils/messages.ts';

export const Route = createFileRoute('/register')({
  component: RegisterComponent
});

function RegisterComponent() {
  const schema = useRegisterFormSchema();
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(schema)
  });
  const { signupWithEmailAndPassword, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useUser();
  const navigate = useNavigate();
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const onSubmit = async ({
    firstName,
    lastName,
    email,
    password
  }: RegisterFormData) => {
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
        setErrorMessage(MESSAGES.REGISTER.API_ERROR);
        setErrorSnackbarOpen(true);
      }
      setIsLoading(false);
      await navigate({ to: '/' });
    } catch (error) {
      setErrorMessage(MESSAGES.REGISTER.FIREBASE_ERROR);
      setErrorSnackbarOpen(true);
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
        sx={{ maxWidth: 345, margin: 'auto', marginTop: '150px'}}>
        <CardHeader
          title="Register"
          action={
            <Button size="small" color="primary" onClick={onBackToLogin}>
              Back to login
            </Button>
          }
        />
        <CardContent
          sx={{
            height: '360px'
          }}>
          {isLoading ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <CircularProgress />
              </Box>
          ) : (
            <>
              <Stack sx={{ width: "full"}}>
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
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setErrorSnackbarOpen(false)}>
        <Alert onClose={() => setErrorSnackbarOpen(false)} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
