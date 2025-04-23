import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Header from '../components/header/header';
import QuizCard from '../components/quizCard/QuizCard';
import { useQuiz } from '../hooks/use-quiz';

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

export default function App() {
  const { quizzes } = useQuiz();
  return (
    <>
      <Header />
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
