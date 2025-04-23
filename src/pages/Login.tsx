import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Container, Stack } from '@mui/material'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginFormSchema, LoginFormData } from '../forms/schemas/loginSchema';
import { TextField } from '../forms/components/TextField';

function Login() {
    const schema = useLoginFormSchema();
    const { control, handleSubmit } = useForm<LoginFormData>({
      resolver: zodResolver(schema),
    });

  return (
    <Container>
        <Card elevation={3} sx={{ maxWidth: 345, marginTop: 8 }}>
            <CardHeader title="Login"/>
      <CardActionArea>
        <CardContent>
            <form onSubmit={handleSubmit((data) => console.log(data))}>
                <Stack spacing={2}>
                <TextField name="email" label="Email" control={control}/>
                <TextField name="password" label="Password"  control={control}/>
                </Stack>
                </form>
        </CardContent>
        
      </CardActionArea>
      <CardActions >
        <Button size="small" color="primary">
          Login
        </Button>
      </CardActions>
    </Card>
    </Container>
  )
}

export default Login