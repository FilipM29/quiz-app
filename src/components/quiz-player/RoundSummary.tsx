import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography
} from '@mui/material';
import { RoundResult } from '../../types/quiz-session';

interface RoundSummaryProps {
  roundResult: RoundResult;
  totalRounds: number;
  onNextRound: () => void;
  teams?: Array<{ id: string; name: string; score: number }> | null;
}

export const RoundSummary = ({
  roundResult,
  totalRounds,
  onNextRound,
  teams
}: RoundSummaryProps) => {
  const accuracy =
    (roundResult.correctAnswers / roundResult.totalQuestions) * 100;
  const scorePercentage =
    (roundResult.roundScore / roundResult.maxRoundScore) * 100;

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        {/* Round Header */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={`Round ${roundResult.roundIndex + 1} Complete`}
            color="success"
            variant="outlined"
            sx={{ mb: 2, fontSize: '1rem', py: 2 }}
          />
        </Box>

        {/* Round Title */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          gutterBottom
          sx={{ mb: 3 }}>
          {roundResult.round.title}
        </Typography>

        {/* Success Icon */}
        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 3 }} />

        {/* Round Results */}
        {teams && teams.length > 0 ? (
          /* Multiplayer Leaderboard */
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 2 }}>
              Current Standings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[...teams]
                .sort((a, b) => b.score - a.score)
                .map((team, index) => (
                  <Box
                    key={team.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      bgcolor: index === 0 ? 'warning.light' : 'grey.100',
                      borderRadius: 1,
                      border: index === 0 ? '2px solid' : '1px solid',
                      borderColor: index === 0 ? 'warning.main' : 'grey.300'
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="text.secondary">
                        #{index + 1}
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {team.name}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary.main">
                      {team.score} pts
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        ) : (
          /* Single Player Results */
          <Box sx={{ mb: 4 }}>
            {/* Score */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {roundResult.roundScore} / {roundResult.maxRoundScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Points Earned
              </Typography>
            </Box>

            {/* Accuracy */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                {roundResult.correctAnswers} / {roundResult.totalQuestions}{' '}
                Correct
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {accuracy.toFixed(1)}% Accuracy
              </Typography>
              <LinearProgress
                variant="determinate"
                value={scorePercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      scorePercentage >= 70
                        ? 'success.main'
                        : scorePercentage >= 50
                          ? 'warning.main'
                          : 'error.main'
                  }
                }}
              />
            </Box>
          </Box>
        )}

        {/* Performance Message */}
        {!teams && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {accuracy >= 80
              ? 'Excellent work! You are doing great!'
              : accuracy >= 60
                ? 'Good job! Keep it up!'
                : 'Keep trying! You can improve in the next round!'}
          </Typography>
        )}

        {/* Question Review Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Round Review
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Questions from this round:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {roundResult.questionsInRound.map((question, index) => (
              <Box
                key={question.id}
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Question {index + 1} ({question.value} points)
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                  {question.text}
                </Typography>
                {question.options && question.options.length > 0 && (
                  <Box sx={{ mb: 1, ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Options:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        mt: 0.5
                      }}>
                      {question.options.map((option, optIdx) => (
                        <Typography
                          key={optIdx}
                          variant="body2"
                          color="text.secondary">
                          •{' '}
                          {typeof option === 'string' ? option : String(option)}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    bgcolor: 'success.light',
                    borderRadius: 1
                  }}>
                  <Typography
                    variant="caption"
                    color="success.dark"
                    fontWeight="bold">
                    Correct Answer:
                  </Typography>
                  <Typography
                    variant="body1"
                    color="success.dark"
                    fontWeight="bold">
                    {question.answer}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Continue Button */}
        <Button
          variant="contained"
          size="large"
          endIcon={<NavigateNextIcon />}
          onClick={onNextRound}
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: 600,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}>
          {roundResult.roundIndex + 1 < totalRounds
            ? 'Continue to Next Round'
            : 'View Final Results'}
        </Button>
      </CardContent>
    </Card>
  );
};
