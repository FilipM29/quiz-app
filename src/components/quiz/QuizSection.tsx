import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { Quiz } from '../../models/quiz';
import { SectionContainer } from '../layout/SectionContainer';
import QuizCard from '../quizCard/QuizCard';

interface QuizSectionProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  quizzes: Quiz[];
  sectionType?: 'forYou' | 'popular' | 'highestRated' | 'recent';
}

export const QuizSection = ({
  title,
  subtitle,
  icon,
  quizzes
}: QuizSectionProps) => {
  if (quizzes.length === 0) return null;

  return (
    <SectionContainer title={title} subtitle={subtitle} icon={icon} centered>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          gap: { xs: '1rem', md: '1.5rem' },
          pb: 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}>
        {quizzes.slice(0, 10).map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </Box>
    </SectionContainer>
  );
};
