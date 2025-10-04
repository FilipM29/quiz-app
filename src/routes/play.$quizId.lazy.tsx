import LoginIcon from '@mui/icons-material/Login';
import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Typography
} from '@mui/material';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { QuizPlayer } from '../components/quiz-player/QuizPlayer';
import { useAuth } from '../context/auth-context';

export const Route = createLazyFileRoute('/play/$quizId')({
  component: PlayQuizComponent
});

function PlayQuizComponent() {
  const { quizId } = Route.useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [playAsGuest, setPlayAsGuest] = React.useState(false);

  if (isLoading) {
    return (
      <PageContainer>
        <Box sx={{ textAlign: 'center', py: 8, maxWidth: 500, mx: 'auto' }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Skeleton
                variant="circular"
                width={60}
                height={60}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={40}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Skeleton variant="text" width="80%" sx={{ mx: 'auto', mb: 4 }} />
              <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={48} />
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    );
  }

  // Allow guest play if explicitly chosen
  if (!isAuthenticated && !playAsGuest) {
    return (
      <PageContainer>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Card sx={{ maxWidth: 500, mx: 'auto' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <LoginIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Choose How to Play
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Login to save your progress and compete on leaderboards, or play
                as a guest to try it out.
              </Typography>

              {/* Login Button */}
              <Link
                to="/login"
                search={{ redirect: `/play/${quizId}` }}
                style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    px: 4,
                    mb: 2,
                    fontWeight: 600,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}>
                  Login to Play
                </Button>
              </Link>

              {/* Play as Guest Button */}
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => setPlayAsGuest(true)}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'primary.50'
                  }
                }}>
                Play as Guest
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: 'block' }}>
                Guest progress will not be saved
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <QuizPlayer quizId={quizId} />
    </PageContainer>
  );
}
