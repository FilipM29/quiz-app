import { Alert, Box, Typography } from '@mui/material';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionContainer } from '../components/layout/SectionContainer';
import { QuizStepper } from '../components/quiz-creator/QuizStepper';

export const Route = createLazyFileRoute('/edit/$quizId')({
  component: EditQuizComponent
});

function EditQuizComponent() {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();

  const handleQuizComplete = () => {
    // Navigate to my-quizzes page after successful update
    navigate({ to: '/my-quizzes' });
  };

  return (
    <PageContainer>
      <SectionContainer
        title="Edit Quiz"
        subtitle="Update your quiz content and settings"
        centered>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Editing Mode:</strong> You're editing an existing quiz.
              Changes are automatically saved as you progress through the steps.
            </Typography>
          </Alert>

          <QuizStepper quizId={quizId} onComplete={handleQuizComplete} />
        </Box>
      </SectionContainer>
    </PageContainer>
  );
}
