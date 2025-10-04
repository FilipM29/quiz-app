import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Button, Card, Grid, Skeleton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, createFileRoute } from '@tanstack/react-router';
import { PageContainer } from '../components/layout/PageContainer';
import { QuizSection } from '../components/quiz/QuizSection';
import { QuizSectionSkeleton } from '../components/skeletons/QuizSectionSkeleton';
import { useQuizSections } from '../hooks/useQuizSections';
import { Quiz } from '../models/quiz';

export const Route = createFileRoute('/')({
  component: IndexComponent
});

function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
        mt: 6,
        mb: 4
      }}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        QuizApp
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

function HeroSection() {
  return (
    <Box sx={{ py: { xs: 4, md: 6 }, textAlign: 'center' }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, md: 0 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
          Welcome to QuizApp
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.6
          }}>
          Challenge yourself with interactive quizzes and test your knowledge
          across various topics. Learn, compete, and have fun!
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center">
          <Button
            variant="contained"
            size="medium"
            component={RouterLink}
            to="/browse"
            sx={{
              px: 3,
              py: 1.2,
              bgcolor: 'warning.main',
              '&:hover': { bgcolor: 'warning.dark' }
            }}>
            Browse Quizzes
          </Button>
          <Button
            variant="outlined"
            size="medium"
            component={RouterLink}
            to="/create"
            sx={{ px: 3, py: 1.2 }}>
            Create Quiz
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function StatsSection({ quizzes }: { quizzes: Quiz[] }) {
  const totalQuizzes = quizzes.length;
  const totalPlays = quizzes.reduce(
    (sum, quiz) => sum + (quiz.numOfPlays || 0),
    0
  );
  const avgPlaysPerQuiz =
    totalQuizzes > 0 ? Math.round(totalPlays / totalQuizzes) : 0;

  const stats = [
    {
      icon: <StarIcon />,
      value: totalQuizzes.toString(),
      label: 'Available Quizzes'
    },
    {
      icon: <TrendingUpIcon />,
      value: totalPlays.toLocaleString(),
      label: 'Total Plays'
    },
    {
      icon: <GroupIcon />,
      value: avgPlaysPerQuiz.toString(),
      label: 'Avg Plays per Quiz'
    }
  ];

  return (
    <Box sx={{ mb: 4, mx: 'auto', maxWidth: 1000 }}>
      <Grid container spacing={3} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{ display: 'flex' }}>
            <Card
              sx={{
                textAlign: 'center',
                p: { xs: 2, md: 3 },
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '2.5rem', md: '3rem' },
                  height: { xs: '2.5rem', md: '3rem' },
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                  color: 'white',
                  mb: { xs: 1, md: 1.5 }
                }}>
                {stat.icon}
              </Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="text.primary"
                sx={{
                  mb: 0.5,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
                }}>
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function IndexComponent() {
  const { sections, isLoading, error } = useQuizSections();

  if (error) {
    return (
      <PageContainer>
        <HeroSection />
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error.main">
            Error loading quizzes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please try refreshing the page
          </Typography>
        </Box>
        <Copyright />
      </PageContainer>
    );
  }

  if (isLoading || !sections) {
    return (
      <PageContainer>
        <HeroSection />

        {/* Stats skeleton */}
        <Box sx={{ mb: 4, mx: 'auto', maxWidth: 1000 }}>
          <Grid container spacing={3} justifyContent="center">
            {Array.from({ length: 3 }).map((_, index) => (
              <Grid
                key={index}
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2, md: 3 },
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Skeleton
                    variant="circular"
                    width={48}
                    height={48}
                    sx={{ mb: { xs: 1, md: 1.5 } }}
                  />
                  <Skeleton
                    variant="text"
                    width={80}
                    height={40}
                    sx={{ mb: 0.5 }}
                  />
                  <Skeleton variant="text" width={120} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quiz sections skeletons */}
        <QuizSectionSkeleton />
        <QuizSectionSkeleton />
        <QuizSectionSkeleton />
        <QuizSectionSkeleton />

        <Copyright />
      </PageContainer>
    );
  }

  // Calculate stats from all quizzes (combine all sections)
  const allQuizzes = [
    ...(sections.forYou?.quizzes || []),
    ...sections.popular.quizzes,
    ...sections.highestRated.quizzes,
    ...sections.recent.quizzes
  ].filter(
    (quiz, index, self) => self.findIndex((q) => q.id === quiz.id) === index
  );

  return (
    <PageContainer>
      <HeroSection />
      <StatsSection quizzes={allQuizzes} />

      {/* Sections - For You only shown if user is authenticated */}
      {sections.forYou && <QuizSection {...sections.forYou} />}
      <QuizSection {...sections.popular} />
      <QuizSection {...sections.highestRated} />
      <QuizSection {...sections.recent} />

      <Copyright />
    </PageContainer>
  );
}
