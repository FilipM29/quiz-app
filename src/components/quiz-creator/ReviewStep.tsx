import {
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import { QuizBasicInfo, QuizRound } from '../../types/quiz-creation';

interface ReviewStepProps {
  basicInfo: QuizBasicInfo;
  rounds: QuizRound[];
}

export const ReviewStep = ({ basicInfo, rounds }: ReviewStepProps) => {
  const getTotalQuestions = () => {
    return rounds.reduce((total, round) => total + round.questions.length, 0);
  };

  const getTotalPoints = () => {
    return rounds.reduce((total, round) => {
      return (
        total +
        round.questions.reduce((roundTotal, question) => {
          return roundTotal + question.value;
        }, 0)
      );
    }, 0);
  };

  const getEstimatedPlayTime = () => {
    const totalQuestions = getTotalQuestions();
    // Estimate 30 seconds per question + 1 minute per round for transitions
    const estimatedMinutes = Math.ceil(
      totalQuestions * 0.5 + rounds.length * 1
    );
    return estimatedMinutes;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'EXACT':
        return 'primary';
      case 'OPTIONS':
        return 'secondary';
      case 'INTERVAL':
        return 'success';
      default:
        return 'default';
    }
  };

  const isQuizComplete = () => {
    return (
      basicInfo.title &&
      basicInfo.description &&
      basicInfo.category &&
      rounds.length > 0 &&
      rounds.every(
        (round) =>
          round.title &&
          round.questions.length > 0 &&
          round.questions.every((q) => q.text && q.answer && q.value > 0)
      )
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review & Publish
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your quiz details before publishing. Once published, your quiz
        will be available to players.
      </Typography>

      {/* Completion Status */}
      {isQuizComplete() ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Quiz is ready to publish!</strong> All required fields are
            complete.
          </Typography>
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Quiz is incomplete.</strong> Please ensure all rounds have
            questions with valid answers and point values.
          </Typography>
        </Alert>
      )}

      {/* Quiz Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuizIcon color="primary" />
            Quiz Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>{basicInfo.title}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {basicInfo.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<CategoryIcon />}
                  label={basicInfo.category}
                  variant="outlined"
                />
                <Chip
                  label={basicInfo.quizType}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<VisibilityIcon />}
                  label={basicInfo.quizVisibility}
                  color={
                    basicInfo.quizVisibility === 'PUBLIC'
                      ? 'success'
                      : 'default'
                  }
                  variant="outlined"
                />
              </Box>

              {basicInfo.pictureUrl && (
                <Box
                  component="img"
                  src={basicInfo.pictureUrl}
                  alt="Quiz cover"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 150,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    Rounds:
                  </Typography>
                  <Chip label={rounds.length} color="primary" size="small" />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Questions:
                  </Typography>
                  <Chip
                    label={getTotalQuestions()}
                    color="secondary"
                    size="small"
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Points:
                  </Typography>
                  <Chip
                    label={getTotalPoints().toLocaleString()}
                    color="success"
                    size="small"
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    Est. Play Time:
                  </Typography>
                  <Chip
                    icon={<TimerIcon />}
                    label={`~${getEstimatedPlayTime()} min`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Rounds Detail */}
      <Typography variant="h6" gutterBottom>
        Quiz Structure
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
        {rounds.map((round) => (
          <Accordion key={round.order} defaultExpanded={rounds.length <= 3}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%'
                }}>
                <Typography variant="subtitle1">
                  Round {round.order}: {round.title}
                </Typography>
                <Chip
                  label={`${round.questions.length} questions`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`${round.questions.reduce((sum, q) => sum + q.value, 0)} pts`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {round.questions.map((question, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{ bgcolor: 'background.default' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1
                        }}>
                        <Typography variant="body2" color="text.secondary">
                          Question {index + 1}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={question.type}
                            size="small"
                            color={
                              getQuestionTypeColor(question.type) as
                                | 'primary'
                                | 'secondary'
                                | 'success'
                                | 'default'
                            }
                            variant="outlined"
                          />
                          <Chip
                            label={`${question.value} pts`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{ mb: 1, fontWeight: 500 }}>
                        {question.text}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}>
                        <strong>Answer:</strong> {question.answer}
                      </Typography>

                      {question.type === 'EXACT' &&
                        question.acceptableAnswers &&
                        question.acceptableAnswers.length > 0 && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}>
                            <strong>Acceptable variations:</strong>{' '}
                            {question.acceptableAnswers.join(', ')}
                          </Typography>
                        )}

                      {question.type === 'OPTIONS' && question.options && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}>
                          <strong>Options:</strong>{' '}
                          {question.options.join(' • ')}
                        </Typography>
                      )}

                      {question.type === 'INTERVAL' && question.range && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}>
                          <strong>Acceptable range:</strong> ±{question.range}
                        </Typography>
                      )}

                      {question.pictureUrl && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}>
                            <strong>Image:</strong>
                          </Typography>
                          <Box
                            component="img"
                            src={question.pictureUrl}
                            alt="Question image"
                            sx={{
                              maxWidth: 200,
                              maxHeight: 120,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Final Notes */}
      <Alert severity="info">
        <Typography variant="body2">
          <strong>What happens after publishing?</strong>
          <br />
          • Your quiz will be available in the public quiz library (if set to
          public)
          <br />
          • Players can discover and play your quiz
          <br />
          • You can view play statistics and feedback
          <br />• You can still edit the quiz, but changes will create a new
          version
        </Typography>
      </Alert>
    </Box>
  );
};
