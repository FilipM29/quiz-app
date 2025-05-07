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
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth-context.tsx';
import { TextField } from '../forms/components/TextField';
import {
  LoginFormData,
  useLoginFormSchema
} from '../forms/schemas/loginSchema';

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

  const onSubmit = async ({ email, password }: LoginFormData) => {
    await loginWithEmailAndPassword(email, password);
    await navigate({ to: '/' });
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
              <TextField name="password" label="Password" control={control} />
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
    </Container>
  );
}

export default Login;
