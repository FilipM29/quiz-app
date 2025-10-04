import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Difficulty, Quiz, QuizStatus, QuizType, QuizVisibility } from '../../models/quiz';
import { CategoriesProvider } from '../../context/categories-context';
import { renderWithProviders } from '../../test/utils';
import { QuizGrid } from './QuizGrid';

describe('QuizGrid', () => {
  const mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'First Quiz',
      description: 'First quiz description',
      category: 'SCIENCE',
      difficulty: Difficulty.EASY,
      quizType: QuizType.SLIDES,
      quizStatus: QuizStatus.PUBLISHED,
      quizVisibility: QuizVisibility.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'test-author',
      numOfRounds: 3,
      numOfPlays: 50,
      rating: 4.0
    },
    {
      id: '2',
      title: 'Second Quiz',
      description: 'Second quiz description',
      category: 'HISTORY',
      difficulty: Difficulty.MEDIUM,
      quizType: QuizType.SLIDES,
      quizStatus: QuizStatus.PUBLISHED,
      quizVisibility: QuizVisibility.PUBLIC,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'test-author',
      numOfRounds: 5,
      numOfPlays: 100,
      rating: 4.5
    }
  ];

  it('should render all quizzes', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizGrid quizzes={mockQuizzes} />
      </CategoriesProvider>
    );

    expect(screen.getByText('First Quiz')).toBeInTheDocument();
    expect(screen.getByText('Second Quiz')).toBeInTheDocument();
  });

  it('should render empty state when no quizzes', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizGrid quizzes={[]} />
      </CategoriesProvider>
    );

    expect(screen.getByText('No quizzes found')).toBeInTheDocument();
  });

  it('should render correct number of quiz cards', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizGrid quizzes={mockQuizzes} />
      </CategoriesProvider>
    );

    // Should have 2 Play Quiz buttons (one for each card)
    const playButtons = screen.getAllByText('Play Quiz');
    expect(playButtons).toHaveLength(2);
  });

  it('should render with custom column configuration', () => {
    const customColumns = { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 };

    renderWithProviders(
      <CategoriesProvider>
        <QuizGrid quizzes={mockQuizzes} columns={customColumns} />
      </CategoriesProvider>
    );

    expect(screen.getByText('First Quiz')).toBeInTheDocument();
    expect(screen.getByText('Second Quiz')).toBeInTheDocument();
  });

  it('should render with custom spacing', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizGrid quizzes={mockQuizzes} spacing={2} />
      </CategoriesProvider>
    );

    expect(screen.getByText('First Quiz')).toBeInTheDocument();
  });

  it('should render single quiz correctly', () => {
    const singleQuiz = [mockQuizzes[0]];

    renderWithProviders(
      <CategoriesProvider>
        <QuizGrid quizzes={singleQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('First Quiz')).toBeInTheDocument();
    expect(screen.queryByText('Second Quiz')).not.toBeInTheDocument();
  });

  it('should handle large number of quizzes', () => {
    const manyQuizzes = Array.from({ length: 20 }, (_, i) => ({
      ...mockQuizzes[0],
      id: `quiz-${i}`,
      title: `Quiz ${i + 1}`
    }));

    renderWithProviders(
      <CategoriesProvider>
        <QuizGrid quizzes={manyQuizzes} />
      </CategoriesProvider>
    );

    expect(screen.getByText('Quiz 1')).toBeInTheDocument();
    expect(screen.getByText('Quiz 20')).toBeInTheDocument();
  });
});
