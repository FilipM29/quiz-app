import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingIcon from '@mui/icons-material/Pending';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import useSWR from 'swr';
import { useAuth } from '../context/auth-context';
import {
  scoringApiService,
  type PendingSession
} from '../services/api/scoring-api';

export const Route = createFileRoute('/teacher/scoring')({
  component: TeacherScoringDashboard
});

function TeacherScoringDashboard() {
  const { isAuthenticated } = useAuth();

  const {
    data: sessions,
    isLoading,
    error
  } = useSWR(isAuthenticated ? 'scoring-pending-sessions' : null, () =>
    scoringApiService.getPendingSessions()
  );

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          You must be logged in to access the scoring dashboard.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading sessions...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load scoring sessions. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Teacher Scoring Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and score student answers from offline quiz sessions
        </Typography>
      </Box>

      {!sessions || sessions.length === 0 ? (
        <Alert severity="info">
          No sessions with pending scoring at the moment.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {sessions.map((session: PendingSession) => (
            <Card key={session.id} elevation={2}>
              <CardActionArea
                component={Link}
                to={`/teacher/scoring/${session.id}`}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {session.quiz.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom>
                        Host: {session.host.firstName} {session.host.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created:{' '}
                        {new Date(session.createdAt).toLocaleDateString()}{' '}
                        {new Date(session.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        icon={<PendingIcon />}
                        label={`${session._count.playerAnswers} pending`}
                        color="warning"
                        size="medium"
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}>
                        {session.status.toUpperCase()}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
