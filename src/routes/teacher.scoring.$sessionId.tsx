import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../context/auth-context';
import {
  scoringApiService,
  type PlayerAnswer
} from '../services/api/scoring-api';

export const Route = createFileRoute('/teacher/scoring/$sessionId')({
  component: SessionScoringPage
});

interface ScoringDialogProps {
  answer: PlayerAnswer;
  open: boolean;
  onClose: () => void;
  onScore: (
    answerId: string,
    isCorrect: boolean,
    points: number,
    feedback?: string
  ) => void;
}

function ScoringDialog({ answer, open, onClose, onScore }: ScoringDialogProps) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    onScore(answer.id, isCorrect, points, feedback || undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Score Answer</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Question
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {answer.question.text}
            </Typography>
            {answer.question.pictureUrl && (
              <Box
                component="img"
                src={answer.question.pictureUrl}
                alt="Question"
                sx={{
                  mt: 2,
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 1
                }}
              />
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Correct Answer
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {answer.question.answer}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Student Answer
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
              {answer.answer}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isCorrect}
                  onChange={(e) => {
                    setIsCorrect(e.target.checked);
                    setPoints(e.target.checked ? answer.question.value : 0);
                  }}
                  color="success"
                />
              }
              label={isCorrect ? 'Correct' : 'Incorrect'}
            />
          </Box>

          <TextField
            label="Points"
            type="number"
            fullWidth
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            inputProps={{ min: 0, max: answer.question.value }}
            helperText={`Max points: ${answer.question.value}`}
          />

          <TextField
            label="Feedback (Optional)"
            multiline
            rows={3}
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback to the student..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit Score
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SessionScoringPage() {
  const { sessionId } = Route.useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<PlayerAnswer | null>(
    null
  );
  const [showOnlyPending, setShowOnlyPending] = useState(true);

  const {
    data: session,
    isLoading,
    error,
    mutate
  } = useSWR(isAuthenticated ? `scoring-session-${sessionId}` : null, () =>
    scoringApiService.getSessionWithAnswers(sessionId)
  );

  const handleScoreAnswer = async (
    answerId: string,
    isCorrect: boolean,
    points: number,
    feedback?: string
  ) => {
    try {
      await scoringApiService.scoreAnswer(answerId, {
        isCorrect,
        points,
        feedback
      });
      // Revalidate the session data
      mutate();
    } catch (error) {
      console.error('Failed to score answer:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          You must be logged in to access scoring.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading session...</Typography>
      </Container>
    );
  }

  if (error || !session) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load session. Please try again.
        </Alert>
      </Container>
    );
  }

  const filteredAnswers = showOnlyPending
    ? session.playerAnswers.filter(
        (a: PlayerAnswer) => a.scoringStatus === 'PENDING'
      )
    : session.playerAnswers;

  const groupedAnswers = filteredAnswers.reduce(
    (acc: Record<string, PlayerAnswer[]>, answer: PlayerAnswer) => {
      const userId = answer.userId || answer.guestIdentifier || 'unknown';
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(answer);
      return acc;
    },
    {} as Record<string, PlayerAnswer[]>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate({ to: '/teacher/scoring' })}
        sx={{ mb: 3 }}>
        Back to Dashboard
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {session.quiz.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Host: {session.host.firstName} {session.host.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Players: {session.players.length} | Status: {session.status}
        </Typography>
      </Paper>

      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Typography variant="h6">Student Answers</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyPending}
              onChange={(e) => setShowOnlyPending(e.target.checked)}
            />
          }
          label="Show only pending"
        />
      </Box>

      {Object.keys(groupedAnswers).length === 0 ? (
        <Alert severity="info">
          No {showOnlyPending ? 'pending ' : ''}answers to display.
        </Alert>
      ) : (
        <Stack spacing={3}>
          {Object.entries(groupedAnswers).map(
            ([userId, answers]: [string, PlayerAnswer[]]) => {
              const firstAnswer = answers[0];
              const studentName = firstAnswer.user
                ? `${firstAnswer.user.firstName} ${firstAnswer.user.lastName}`
                : `Guest ${firstAnswer.guestIdentifier}`;

              return (
                <Card key={userId} elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {studentName}
                    </Typography>
                    <Grid container spacing={2}>
                      {answers.map((answer: PlayerAnswer) => (
                        <Grid size={{ xs: 12, md: 6 }} key={answer.id}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Stack spacing={1}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start'
                                }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ flex: 1 }}>
                                  {answer.question.text}
                                </Typography>
                                {answer.scoringStatus === 'PENDING' ? (
                                  <Chip
                                    icon={<PendingIcon />}
                                    label="Pending"
                                    size="small"
                                    color="warning"
                                  />
                                ) : answer.isCorrect ? (
                                  <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Correct"
                                    size="small"
                                    color="success"
                                  />
                                ) : (
                                  <Chip
                                    icon={<CancelIcon />}
                                    label="Incorrect"
                                    size="small"
                                    color="error"
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary">
                                Answer: <strong>{answer.answer}</strong>
                              </Typography>
                              {answer.scoringStatus !== 'PENDING' && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary">
                                  Points: {answer.points} /{' '}
                                  {answer.question.value}
                                </Typography>
                              )}
                              {answer.teacherFeedback && (
                                <Typography variant="body2" color="info.main">
                                  Feedback: {answer.teacherFeedback}
                                </Typography>
                              )}
                              {answer.scoringStatus === 'PENDING' && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => setSelectedAnswer(answer)}
                                  sx={{ mt: 1 }}>
                                  Score Answer
                                </Button>
                              )}
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              );
            }
          )}
        </Stack>
      )}

      {selectedAnswer && (
        <ScoringDialog
          answer={selectedAnswer}
          open={!!selectedAnswer}
          onClose={() => setSelectedAnswer(null)}
          onScore={handleScoreAnswer}
        />
      )}
    </Container>
  );
}
