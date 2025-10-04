import { Alert, Box, Typography } from '@mui/material';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionContainer } from '../components/layout/SectionContainer';
import { QuizStepper } from '../components/quiz-creator/QuizStepper';

export const Route = createLazyFileRoute('/create')({
  component: CreateQuizComponent
});

function CreateQuizComponent() {
  const navigate = useNavigate();

  const handleQuizComplete = () => {
    // Navigate to my-quizzes page after successful creation
    navigate({ to: '/my-quizzes' });
  };

  return (
    <PageContainer>
      <SectionContainer
        title="Create New Quiz"
        subtitle="Build your own quiz step by step"
        centered>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Getting Started:</strong> Create engaging quizzes with
              multiple rounds and different question types. Your progress is
              automatically saved as you build your quiz.
            </Typography>
          </Alert>

          <QuizStepper onComplete={handleQuizComplete} />
        </Box>
      </SectionContainer>
    </PageContainer>
  );
}
