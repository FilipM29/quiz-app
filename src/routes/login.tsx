import { zodResolver } from '@hookform/resolvers/zod';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider, Snackbar,
  Stack,
  Typography
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth-context.tsx';
import { TextField } from '../forms/components/TextField';
import {
  LoginFormData,
  useLoginFormSchema
} from '../forms/schemas/loginSchema';
import {useState} from "react";
import {MESSAGES} from "../utils/messages.ts";

export const Route = createFileRoute('/login')({
  component: Login
});

function Login() {
  const schema = useLoginFormSchema();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(schema)
  });
  const { loginWithEmailAndPassword, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      await loginWithEmailAndPassword(email, password);
      await navigate({ to: '/' });
    } catch (error) {
      setErrorSnackbarOpen(true);
    }
  };

  const onGoogleLogin = async () => {
    await loginWithGoogle();
    await navigate({ to: '/' });
  };

  const onRegister = async () => {
    await navigate({ to: '/register' });
  };

  return (
    <Container>
      <Card
        elevation={1}
        sx={{ maxWidth: 345, margin: 'auto', marginTop: '150px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader title="Login" />
          <CardContent>
            <Stack spacing={2}>
              <TextField name="email" label="Email" control={control} />
              <TextField name="password" label="Password" type="password" control={control} />
              <Button size="small" color="primary" type="submit">
                Login
              </Button>
            </Stack>
          </CardContent>
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
              onClick={onGoogleLogin}
              startIcon={<GoogleIcon />}>
              Google
            </Button>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', margin: 'auto' }}>
              Don't have an account yet? Register here:
            </Typography>
            <Button size="small" color="primary" onClick={onRegister}>
              Register
            </Button>
          </Stack>
        </Box>
      </Card>
      
      <Snackbar 
      open={errorSnackbarOpen}
      autoHideDuration={4000}
      onClose={() => setErrorSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
            onClose={() => setErrorSnackbarOpen(false)}
            severity="error"
        >
          {MESSAGES.LOGIN.ACCOUNT_NOT_FOUND}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
