import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Difficulty, Quiz, QuizStatus, QuizType, QuizVisibility } from '../../models/quiz';
import { CategoriesProvider } from '../../context/categories-context';
import { renderWithProviders } from '../../test/utils';
import QuizCard from './QuizCard';

describe('QuizCard', () => {
  const mockQuiz: Quiz = {
    id: '1',
    title: 'Test Quiz',
    description: 'This is a test quiz description',
    category: 'SCIENCE',
    difficulty: Difficulty.MEDIUM,
    quizType: QuizType.SLIDES,
    quizStatus: QuizStatus.PUBLISHED,
    quizVisibility: QuizVisibility.PUBLIC,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    authorId: 'test-author-id',
    numOfRounds: 3,
    numOfPlays: 100,
    rating: 4.5
  };

  it('should render quiz title', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
  });

  it('should render quiz description', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('This is a test quiz description')).toBeInTheDocument();
  });

  it('should render number of plays', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should render rating when greater than 0', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });

  it('should not render rating when 0', () => {
    const quizWithoutRating = { ...mockQuiz, rating: 0 };
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={quizWithoutRating} />
      </CategoriesProvider>
    );

    expect(screen.queryByText('(0)')).not.toBeInTheDocument();
  });

  it('should render difficulty chip', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('should render quiz type chip', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('SLIDES')).toBeInTheDocument();
  });

  it('should render Play Quiz button', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('Play Quiz')).toBeInTheDocument();
  });

  it('should render card image with alt text', () => {
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={mockQuiz} />
      </CategoriesProvider>
    );

    const image = screen.getByAltText('Test Quiz');
    expect(image).toBeInTheDocument();
  });

  it('should display 0 plays when numOfPlays is not set', () => {
    const quizWithoutPlays = { ...mockQuiz, numOfPlays: 0 };
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={quizWithoutPlays} />
      </CategoriesProvider>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render different difficulty levels with appropriate styling', () => {
    const easyQuiz = { ...mockQuiz, difficulty: Difficulty.EASY };
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={easyQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('EASY')).toBeInTheDocument();

    const hardQuiz = { ...mockQuiz, difficulty: Difficulty.HARD };
    renderWithProviders(
      <CategoriesProvider>
        <QuizCard quiz={hardQuiz} />
      </CategoriesProvider>
    );

    expect(screen.getByText('HARD')).toBeInTheDocument();
  });
});
