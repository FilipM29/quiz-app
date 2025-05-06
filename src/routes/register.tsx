import { zodResolver } from '@hookform/resolvers/zod';
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
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth-context.tsx';
import { TextField } from '../forms/components/TextField.tsx';
import {
  LoginFormData,
  useLoginFormSchema
} from '../forms/schemas/loginSchema.ts';

export const Route = createFileRoute('/register')({
  component: RouteComponent
});

function RouteComponent() {
  const schema = useLoginFormSchema();
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(schema)
  });
  const { signupWithEmailAndPassword, loginWithGoogle } = useAuth();

  const onSubmit = async ({ email, password }: LoginFormData) => {
    await signupWithEmailAndPassword(email, password);
  };

  const onGoogleRegister = async () => {
    await loginWithGoogle();
  };

  return (
    <Container>
      <Card
        elevation={1}
        sx={{ maxWidth: 345, margin: 'auto', marginTop: '150px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader title="Register" />
          <CardContent>
            <Stack spacing={2}>
              <TextField name="email" label="Email" control={control} />
              <TextField name="password" label="Password" control={control} />
              <Button size="small" color="primary" type="submit">
                Register
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
            <Button size="small" color="primary" onClick={onGoogleRegister}>
              Google
            </Button>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
}
