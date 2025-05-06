import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createFileRoute } from '@tanstack/react-router';
import QuizCard from '../components/quizCard/QuizCard';
import { useQuiz } from '../hooks/use-quiz';

export const Route = createFileRoute('/')({
  component: IndexComponent
});

function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary'
      }}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

function IndexComponent() {
  const { quizzes } = useQuiz();
  return (
    <>
      <Grid container spacing={2} mt={8} justifyContent={'center'}>
        {quizzes.map((quiz) => (
          <Grid key={quiz.id}>
            <QuizCard quiz={quiz} />
          </Grid>
        ))}
      </Grid>
      <Container>
        <Box position="fixed" bottom={0} right={0} mb={4} mr={4}>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
