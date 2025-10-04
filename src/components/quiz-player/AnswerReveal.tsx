import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography
} from '@mui/material';
import { Question } from '../../models/question';

interface AnswerRevealProps {
  questions: Question[];
  roundTitle: string;
  onScorePlayers: () => void;
}

export const AnswerReveal = ({
  questions,
  roundTitle,
  onScorePlayers
}: AnswerRevealProps) => {
  const totalPoints = questions.reduce((sum, q) => sum + q.value, 0);

  return (
    <Card sx={{ maxWidth: 900, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        {/* Round Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip
            label="Round Complete - Review Answers"
            color="success"
            variant="outlined"
            sx={{ mb: 2, fontSize: '1rem', py: 2 }}
          />
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            {roundTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {questions.length} Questions · {totalPoints} Total Points
          </Typography>
        </Box>

        {/* All Questions and Answers */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          {questions.map((question, index) => (
            <Box
              key={question.id}
              sx={{
                p: 3,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.300'
              }}>
              {/* Question Header */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}>
                  Question {index + 1} ({question.value} points)
                </Typography>
                <Typography variant="h6" fontWeight="500" sx={{ mt: 0.5 }}>
                  {question.text}
                </Typography>
              </Box>

              {/* Question Image (if exists) */}
              {question.pictureUrl && (
                <Box
                  component="img"
                  src={question.pictureUrl}
                  alt="Question"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    mb: 2,
                    borderRadius: 1
                  }}
                />
              )}

              {/* Options (if applicable) */}
              {question.options && question.options.length > 0 && (
                <Box sx={{ mb: 2, ml: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    gutterBottom>
                    Options:
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {question.options.map((option, optIdx) => (
                      <Typography
                        key={optIdx}
                        variant="body2"
                        color="text.secondary">
                        • {typeof option === 'string' ? option : String(option)}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Correct Answer */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'success.light',
                  borderRadius: 1,
                  border: '2px solid',
                  borderColor: 'success.main'
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} color="success" />
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="success.dark">
                    Correct Answer:
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="success.dark"
                  sx={{ mt: 0.5 }}>
                  {question.answer}
                </Typography>

                {/* Acceptable Answers (if any) */}
                {question.acceptableAnswers &&
                  question.acceptableAnswers.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}>
                      Also acceptable: {question.acceptableAnswers.join(', ')}
                    </Typography>
                  )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<EditNoteIcon />}
          onClick={() => onScorePlayers()}
          sx={{
            py: 1.5,
            bgcolor: 'warning.main',
            '&:hover': { bgcolor: 'warning.dark' }
          }}>
          Score Teams for This Round
        </Button>
      </CardContent>
    </Card>
  );
};
