import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import ReplayIcon from '@mui/icons-material/Replay';
import StarIcon from '@mui/icons-material/Star';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Rating,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { ratingApiService } from '../../services/api/rating-api';
import { UserAnswer } from '../../types/quiz-session';

interface QuizResultsProps {
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
  userAnswers: UserAnswer[];
  timeTaken: number;
  quizTitle: string;
  onPlayAgain?: () => void;
  teams?: Array<{ id: string; name: string; score: number }> | null;
}

export const QuizResults = ({
  quizId,
  totalQuestions,
  correctAnswers,
  accuracy,
  totalScore,
  maxPossibleScore,
  scorePercentage,
  userAnswers,
  timeTaken,
  quizTitle,
  onPlayAgain,
  teams
}: QuizResultsProps) => {
  const { isAuthenticated } = useAuth();
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [existingRating, setExistingRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      ratingApiService
        .getMyRating(quizId)
        .then((rating) => {
          setExistingRating(rating.value);
          setRatingValue(rating.value);
          setComment(rating.comment || '');
        })
        .catch(() => {
          // User hasn't rated yet - that's fine
          setExistingRating(null);
        });
    }
  }, [isAuthenticated, quizId]);

  const handleSubmitRating = async () => {
    if (ratingValue === 0) {
      setSubmitError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await ratingApiService.submitRating(quizId, {
        value: ratingValue,
        comment: comment || undefined
      });
      setSubmitSuccess(true);
      setExistingRating(ratingValue);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'success.main';
    if (percentage >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom>
            Quiz Complete!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {quizTitle}
          </Typography>

          {/* Score Overview - Conditional based on mode */}
          {teams && teams.length > 0 ? (
            /* Multiplayer Final Leaderboard */
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 3 }}>
                Final Results
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[...teams]
                  .sort((a, b) => b.score - a.score)
                  .map((team, index) => (
                    <Box
                      key={team.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 3,
                        bgcolor:
                          index === 0
                            ? 'success.light'
                            : index === 1
                              ? 'warning.light'
                              : index === 2
                                ? 'info.light'
                                : 'grey.100',
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor:
                          index === 0
                            ? 'success.main'
                            : index === 1
                              ? 'warning.main'
                              : index === 2
                                ? 'info.main'
                                : 'grey.300',
                        boxShadow: index < 3 ? 3 : 0
                      }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          color="text.secondary">
                          {index === 0
                            ? '🥇'
                            : index === 1
                              ? '🥈'
                              : index === 2
                                ? '🥉'
                                : `#${index + 1}`}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {team.name}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary.main">
                        {team.score}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          ) : (
            /* Single Player Score */
            <>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  color={getScoreColor(scorePercentage)}
                  sx={{ mb: 1 }}>
                  {Math.round(scorePercentage)}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {totalScore} out of {maxPossibleScore} points
                </Typography>
              </Box>

              {/* Stats */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                sx={{ mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {correctAnswers}/{totalQuestions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Correct Answers
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {accuracy}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accuracy
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {formatTime(timeTaken)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time Taken
                  </Typography>
                </Box>
              </Stack>

              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={accuracy}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getScoreColor(accuracy)
                    }
                  }}
                />
              </Box>
            </>
          )}

          {/* Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center">
            {onPlayAgain && (
              <Button
                variant="contained"
                startIcon={<ReplayIcon />}
                onClick={onPlayAgain}
                sx={{
                  bgcolor: 'warning.main',
                  '&:hover': { bgcolor: 'warning.dark' }
                }}>
                Play Again
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              component={Link}
              to="/">
              Back to Home
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Rating Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {isAuthenticated ? (
            // Authenticated users - show rating form
            <>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Rate This Quiz
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {existingRating !== null
                  ? 'Update your rating for this quiz'
                  : 'Share your experience with others'}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Rating
                  value={ratingValue}
                  onChange={(_, newValue) => setRatingValue(newValue || 0)}
                  size="large"
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comment (optional)"
                placeholder="Share your thoughts about this quiz..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 500 }}
              />

              {submitSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {existingRating !== null
                    ? 'Rating updated successfully!'
                    : 'Rating submitted successfully!'}
                </Alert>
              )}

              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleSubmitRating}
                disabled={isSubmitting || ratingValue === 0}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}>
                {isSubmitting
                  ? 'Submitting...'
                  : existingRating !== null
                    ? 'Update Rating'
                    : 'Submit Rating'}
              </Button>
            </>
          ) : (
            // Guest users - show signup CTA
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <StarIcon
                sx={{
                  fontSize: 48,
                  color: 'warning.main',
                  mb: 2
                }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Love this quiz? Share your thoughts!
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                Sign up to rate quizzes and help others discover great content.
                Your ratings make a difference!
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<LoginIcon />}
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}>
                  Sign Up to Rate
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'primary.50'
                    }
                  }}>
                  Already have an account? Login
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Question Review
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Review your answers to see where you did well and where you can
            improve
          </Typography>

          {userAnswers.map((answer, index) => (
            <Box key={answer.questionId}>
              <Box sx={{ py: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 2
                  }}>
                  <Box sx={{ minWidth: 40 }}>
                    {answer.isCorrect ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1
                      }}>
                      <Typography variant="body2" color="text.secondary">
                        Question {index + 1}
                      </Typography>
                      <Chip
                        label={`${answer.pointsEarned}/${answer.question.value} pts`}
                        size="small"
                        color={answer.isCorrect ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body1" fontWeight="500" sx={{ mb: 2 }}>
                      {answer.question.text}
                    </Typography>

                    <Box sx={{ ml: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}>
                        Your answer:
                      </Typography>
                      <Typography
                        variant="body2"
                        color={answer.isCorrect ? 'success.main' : 'error.main'}
                        sx={{ mb: 2, fontWeight: 500 }}>
                        {answer.userAnswer}
                      </Typography>

                      {!answer.isCorrect && (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}>
                            Correct answer:
                          </Typography>
                          <Typography
                            variant="body2"
                            color="success.main"
                            sx={{ fontWeight: 500 }}>
                            {answer.question.answer}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {index < userAnswers.length - 1 && <Divider />}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};
