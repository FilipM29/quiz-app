import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { QuizQuestion, QuizRound } from '../../types/quiz-creation';

interface QuestionEditorProps {
  round: QuizRound;
  onUpdate: (round: QuizRound) => void;
}

interface QuestionFormData {
  text: string;
  type: 'EXACT' | 'OPTIONS' | 'INTERVAL';
  value: number;
  answer: string;
  acceptableAnswers: string[];
  options: string[];
  range?: number;
  pictureUrl?: string;
}

const initialQuestionData: QuestionFormData = {
  text: '',
  type: 'EXACT',
  value: 100,
  answer: '',
  acceptableAnswers: [],
  options: ['', '', '', ''],
  pictureUrl: ''
};

export const QuestionEditor = ({ round, onUpdate }: QuestionEditorProps) => {
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [questionIndex, setQuestionIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] =
    useState<QuestionFormData>(initialQuestionData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionIndex(-1);
    setFormData(initialQuestionData);
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEditQuestion = (question: QuizQuestion, index: number) => {
    setEditingQuestion(question);
    setQuestionIndex(index);
    setFormData({
      text: question.text,
      type: question.type,
      value: question.value,
      answer: question.answer,
      acceptableAnswers: question.acceptableAnswers || [],
      options: question.options || ['', '', '', ''],
      range: question.range,
      pictureUrl: question.pictureUrl || ''
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = round.questions.filter((_, i) => i !== index);
    const updatedRound = { ...round, questions: newQuestions };
    onUpdate(updatedRound);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Point value must be greater than 0';
    }

    if (formData.type === 'OPTIONS') {
      const validOptions = formData.options.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }
      if (
        !formData.options.some((opt) => opt.trim() === formData.answer.trim())
      ) {
        newErrors.answer = 'Answer must match one of the options exactly';
      }
    }

    if (
      formData.type === 'INTERVAL' &&
      (!formData.range || formData.range <= 0)
    ) {
      newErrors.range = 'Range must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveQuestion = () => {
    if (!validateForm()) return;

    const questionData: QuizQuestion = {
      text: formData.text.trim(),
      type: formData.type,
      value: formData.value,
      answer: formData.answer.trim(),
      ...(formData.type === 'EXACT' &&
        formData.acceptableAnswers.length > 0 && {
          acceptableAnswers: formData.acceptableAnswers.filter((a) => a.trim())
        }),
      ...(formData.type === 'OPTIONS' && {
        options: formData.options.filter((opt) => opt.trim())
      }),
      ...(formData.type === 'INTERVAL' &&
        formData.range && {
          range: formData.range
        }),
      ...(formData.pictureUrl && { pictureUrl: formData.pictureUrl })
    };

    const newQuestions = [...round.questions];

    if (editingQuestion && questionIndex >= 0) {
      newQuestions[questionIndex] = { ...editingQuestion, ...questionData };
    } else {
      newQuestions.push(questionData);
    }

    const updatedRound = { ...round, questions: newQuestions };
    onUpdate(updatedRound);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingQuestion(null);
    setQuestionIndex(-1);
    setFormData(initialQuestionData);
    setErrors({});
  };

  const updateFormField = (field: keyof QuestionFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addAcceptableAnswer = () => {
    updateFormField('acceptableAnswers', [...formData.acceptableAnswers, '']);
  };

  const updateAcceptableAnswer = (index: number, value: string) => {
    const newAnswers = [...formData.acceptableAnswers];
    newAnswers[index] = value;
    updateFormField('acceptableAnswers', newAnswers);
  };

  const removeAcceptableAnswer = (index: number) => {
    const newAnswers = formData.acceptableAnswers.filter((_, i) => i !== index);
    updateFormField('acceptableAnswers', newAnswers);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    updateFormField('options', newOptions);
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

  return (
    <Box>
      {/* Questions List */}
      {round.questions.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No questions added yet. Add your first question to get started!
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {round.questions.map((question, index) => (
            <Card key={index} variant="outlined">
              <CardContent sx={{ py: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1
                  }}>
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                      }}>
                      <Typography variant="subtitle2">
                        Question {index + 1}
                      </Typography>
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
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {question.text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Answer:</strong> {question.answer}
                    </Typography>
                    {question.type === 'OPTIONS' && question.options && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Options:</strong> {question.options.join(', ')}
                      </Typography>
                    )}
                    {question.type === 'INTERVAL' && question.range && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Range:</strong> ±{question.range}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => handleEditQuestion(question, index)}
                      color="primary"
                      size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteQuestion(index)}
                      color="error"
                      size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add Question Button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddQuestion}
        fullWidth>
        Add Question
      </Button>

      {/* Question Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            {/* Question Text */}
            <TextField
              label="Question Text"
              value={formData.text}
              onChange={(e) => updateFormField('text', e.target.value)}
              error={!!errors.text}
              helperText={errors.text || 'Enter the question you want to ask'}
              fullWidth
              multiline
              rows={2}
              required
            />

            {/* Question Type and Points */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => updateFormField('type', e.target.value)}
                  label="Question Type">
                  <MenuItem value="EXACT">Exact Answer</MenuItem>
                  <MenuItem value="OPTIONS">Multiple Choice</MenuItem>
                  <MenuItem value="INTERVAL">Numeric Range</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Point Value"
                type="number"
                value={formData.value}
                onChange={(e) =>
                  updateFormField('value', parseInt(e.target.value) || 0)
                }
                error={!!errors.value}
                helperText={errors.value}
                inputProps={{ min: 1, max: 10000 }}
                sx={{ width: 150 }}
                required
              />
            </Box>

            {/* Answer */}
            <TextField
              label="Correct Answer"
              value={formData.answer}
              onChange={(e) => updateFormField('answer', e.target.value)}
              error={!!errors.answer}
              helperText={errors.answer || 'Enter the correct answer'}
              fullWidth
              required
            />

            {/* Type-specific fields */}
            {formData.type === 'EXACT' && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Acceptable Answer Variations (Optional)
                </Typography>
                {formData.acceptableAnswers.map((answer, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      value={answer}
                      onChange={(e) =>
                        updateAcceptableAnswer(index, e.target.value)
                      }
                      placeholder="Alternative answer"
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      onClick={() => removeAcceptableAnswer(index)}
                      color="error"
                      size="small">
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  onClick={addAcceptableAnswer}
                  startIcon={<AddIcon />}
                  size="small"
                  variant="outlined">
                  Add Alternative
                </Button>
              </Box>
            )}

            {formData.type === 'OPTIONS' && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Answer Options
                </Typography>
                {formData.options.map((option, index) => (
                  <TextField
                    key={index}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    label={`Option ${index + 1}`}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))}
                {errors.options && (
                  <Typography variant="caption" color="error">
                    {errors.options}
                  </Typography>
                )}
              </Box>
            )}

            {formData.type === 'INTERVAL' && (
              <TextField
                label="Acceptable Range (±)"
                type="number"
                value={formData.range || ''}
                onChange={(e) =>
                  updateFormField('range', parseFloat(e.target.value) || 0)
                }
                error={!!errors.range}
                helperText={
                  errors.range ||
                  'How much variation is acceptable? (e.g., ±5 for answers between 95-105)'
                }
                inputProps={{ min: 0.1, step: 0.1 }}
                sx={{ width: 200 }}
              />
            )}

            <Divider />

            {/* Optional Image */}
            <TextField
              label="Question Image URL (Optional)"
              value={formData.pictureUrl}
              onChange={(e) => updateFormField('pictureUrl', e.target.value)}
              helperText="Add an image to make the question more engaging"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            {editingQuestion ? 'Update' : 'Add'} Question
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
