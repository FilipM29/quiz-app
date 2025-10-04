import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Question, QuestionType } from '../../models/question';
import { logger } from '../../utils/logger';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmitAnswer?: (answer: string) => void;
  disabled?: boolean;
  readOnly?: boolean; // For MULTI_OFFLINE mode - display only
  onNextQuestion?: () => void; // For MULTI_OFFLINE - button to advance to next question
}

export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  disabled = false,
  readOnly = false,
  onNextQuestion
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setHasSubmitted(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (!selectedAnswer.trim() || hasSubmitted || !onSubmitAnswer) return;

    setHasSubmitted(true);
    onSubmitAnswer(selectedAnswer);
  };

  const handleAnswerChange = (value: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(value);
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case QuestionType.OPTIONS: {
        // Debug: Check what backend is sending
        logger.debug('Raw options from backend:', {
          questionId: question.id,
          rawOptions: question.options,
          firstOption: question.options?.[0],
          firstOptionType: typeof question.options?.[0]
        });

        // Handle different backend formats
        const options = (question.options || [])
          .filter((opt: unknown) => opt && opt !== '[object Object]')
          .map((opt: unknown) => {
            if (typeof opt === 'string') {
              // If it's already a string, use as-is
              return opt;
            } else if (typeof opt === 'object' && opt !== null) {
              // If it's an object, try to extract meaningful text
              const objOpt = opt as Record<string, unknown>;
              return (
                (objOpt.text as string) ||
                (objOpt.value as string) ||
                (objOpt.label as string) ||
                (objOpt.name as string) ||
                String(opt)
              );
            }
            return String(opt);
          });

        logger.debug('Processed options:', options);

        // If no valid options, show fallback message
        if (options.length === 0) {
          return (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
              Options not available for this question. Please contact support.
            </div>
          );
        }

        return (
          <FormControl component="fieldset" fullWidth disabled={hasSubmitted}>
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              sx={{ mt: 2 }}>
              {options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{
                    mb: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '1rem'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      }

      case QuestionType.EXACT:
        return (
          <TextField
            fullWidth
            value={selectedAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            disabled={hasSubmitted}
            sx={{ mt: 2 }}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            value={selectedAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            disabled={hasSubmitted}
            sx={{ mt: 2 }}
          />
        );
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        mx: 'auto',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
      {question.pictureUrl && (
        <CardMedia
          component="img"
          sx={{
            height: 200,
            objectFit: 'cover'
          }}
          image={question.pictureUrl}
          alt="Question image"
        />
      )}

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 3 }
        }}>
        {/* Question Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Question {questionNumber} of {totalQuestions}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {question.value} points
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {question.type === QuestionType.OPTIONS
                ? 'Multiple Choice'
                : 'Text Answer'}
            </Typography>
          </Box>
        </Box>

        {/* Question Text */}
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 500,
            lineHeight: 1.4
          }}>
          {question.text}
        </Typography>

        {/* Answer Input or Read-Only Display */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {readOnly ? (
            /* Read-only display for MULTI_OFFLINE */
            question.type === QuestionType.OPTIONS && question.options ? (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom>
                  Options:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {question.options.map((option, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'grey.300'
                      }}>
                      <Typography variant="body1">
                        {typeof option === 'string' ? option : String(option)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : null
          ) : (
            renderQuestionInput()
          )}

          {/* Action Button */}
          <Box sx={{ mt: 'auto', pt: 3 }}>
            {readOnly ? (
              <Button
                variant="contained"
                size="large"
                onClick={onNextQuestion}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}>
                Next Question
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!selectedAnswer.trim() || hasSubmitted || disabled}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  bgcolor: 'warning.main',
                  '&:hover': { bgcolor: 'warning.dark' }
                }}>
                {hasSubmitted ? 'Answer Submitted' : 'Submit Answer'}
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
