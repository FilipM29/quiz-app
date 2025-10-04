import { Publish as PublishIcon, Save as SaveIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuizCreation } from '../../hooks/useQuizCreation';
import { BasicInfoStep } from './BasicInfoStep';
import { QuestionsStep } from './QuestionsStep';
import { ReviewStep } from './ReviewStep';
import { RoundsStep } from './RoundsStep';

const steps = [
  'Basic Information',
  'Quiz Structure',
  'Questions',
  'Review & Publish'
];

interface QuizStepperProps {
  quizId?: string;
  onComplete?: () => void;
}

export const QuizStepper = ({ quizId, onComplete }: QuizStepperProps) => {
  const {
    state,
    isLoading,
    error,
    updateBasicInfo,
    updateRounds,
    setCurrentStep,
    saveQuizDraft,
    publishQuiz,
    loadExistingQuiz
  } = useQuizCreation(quizId);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (quizId) {
      loadExistingQuiz(quizId);
    }
  }, [quizId, loadExistingQuiz]);

  const handleNext = async () => {
    // Auto-save before moving to next step
    if (state.currentStep < steps.length - 1) {
      setIsSaving(true);
      setSaveError(null);

      const savedQuizId = await saveQuizDraft();
      if (savedQuizId) {
        setCurrentStep(state.currentStep + 1);
      } else {
        setSaveError('Failed to save progress. Please try again.');
      }
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(state.currentStep - 1);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveError(null);

    const savedQuizId = await saveQuizDraft();
    if (!savedQuizId) {
      setSaveError('Failed to save draft. Please try again.');
    }
    setIsSaving(false);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    setSaveError(null);

    const success = await publishQuiz();
    if (success) {
      onComplete?.();
    } else {
      setSaveError('Failed to publish quiz. Please try again.');
    }
    setIsSaving(false);
  };

  const isStepValid = () => {
    switch (state.currentStep) {
      case 0:
        return (
          state.basicInfo.title &&
          state.basicInfo.description &&
          state.basicInfo.category
        );
      case 1:
        return (
          state.rounds.length > 0 && state.rounds.every((round) => round.title)
        );
      case 2:
        return state.rounds.every(
          (round) =>
            round.questions.length > 0 &&
            round.questions.every((q) => q.text && q.answer && q.value > 0)
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getStepContent = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <BasicInfoStep
            basicInfo={state.basicInfo}
            onUpdate={updateBasicInfo}
          />
        );
      case 1:
        return <RoundsStep rounds={state.rounds} onUpdate={updateRounds} />;
      case 2:
        return <QuestionsStep rounds={state.rounds} onUpdate={updateRounds} />;
      case 3:
        return <ReviewStep basicInfo={state.basicInfo} rounds={state.rounds} />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    const weights = [25, 25, 40, 10]; // Weight each step differently
    let progress = 0;

    for (let i = 0; i <= state.currentStep; i++) {
      if (i < state.currentStep) {
        progress += weights[i];
      } else if (i === state.currentStep) {
        // Partial progress for current step based on validation
        if (isStepValid()) {
          progress += weights[i];
        } else {
          progress += weights[i] * 0.5; // Half credit for being on the step
        }
      }
    }

    return Math.min(progress, 100);
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Loading quiz...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Progress: {Math.round(calculateProgress())}%
        </Typography>
        <LinearProgress variant="determinate" value={calculateProgress()} />
      </Box>

      {/* Stepper */}
      <Stepper activeStep={state.currentStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {saveError}
        </Alert>
      )}

      {/* Step Content */}
      <Paper sx={{ p: 3, mb: 3 }}>{getStepContent()}</Paper>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Button
          disabled={state.currentStep === 0}
          onClick={handleBack}
          variant="outlined">
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Save Draft Button */}
          <Button
            onClick={handleSaveDraft}
            disabled={isSaving || !isStepValid()}
            startIcon={<SaveIcon />}
            variant="outlined">
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>

          {/* Next/Publish Button */}
          {state.currentStep === steps.length - 1 ? (
            <Button
              onClick={handlePublish}
              disabled={isSaving || !isStepValid()}
              startIcon={<PublishIcon />}
              variant="contained"
              color="primary">
              {isSaving ? 'Publishing...' : 'Publish Quiz'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isSaving || !isStepValid()}
              variant="contained">
              {isSaving ? 'Saving...' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
