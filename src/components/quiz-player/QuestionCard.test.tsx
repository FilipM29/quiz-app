import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent } from '../../test/utils';
import { Question, QuestionType } from '../../models/question';
import { QuestionCard } from './QuestionCard';

describe('QuestionCard - OPTIONS Type', () => {
  const mockOptionsQuestion: Question = {
    id: 'q1',
    text: 'What is 2+2?',
    type: QuestionType.OPTIONS,
    value: 10,
    answer: '4',
    options: ['2', '3', '4', '5'],
    acceptableAnswers: []
  };

  it('should render question text', () => {
    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
      />
    );

    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
  });

  it('should render question number and total', () => {
    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={2}
        totalQuestions={10}
      />
    );

    expect(screen.getByText('Question 2 of 10')).toBeInTheDocument();
  });

  it('should render point value', () => {
    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
      />
    );

    expect(screen.getByText('10 points')).toBeInTheDocument();
  });

  it('should render all answer options as radio buttons', () => {
    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
      />
    );

    expect(screen.getByLabelText('2')).toBeInTheDocument();
    expect(screen.getByLabelText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('4')).toBeInTheDocument();
    expect(screen.getByLabelText('5')).toBeInTheDocument();
  });

  it('should have submit button disabled initially', () => {
    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit answer/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when option is selected', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
      />
    );

    const option = screen.getByLabelText('4');
    await user.click(option);

    const submitButton = screen.getByRole('button', { name: /submit answer/i });
    expect(submitButton).toBeEnabled();
  });

  it('should call onSubmitAnswer with selected value', async () => {
    const user = userEvent.setup();
    const onSubmitAnswer = vi.fn();

    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
        onSubmitAnswer={onSubmitAnswer}
      />
    );

    const option = screen.getByLabelText('4');
    await user.click(option);

    const submitButton = screen.getByRole('button', { name: /submit answer/i });
    await user.click(submitButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('4');
  });

  it('should show "Answer Submitted" after submission', async () => {
    const user = userEvent.setup();
    const onSubmitAnswer = vi.fn();

    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
        onSubmitAnswer={onSubmitAnswer}
      />
    );

    const option = screen.getByLabelText('4');
    await user.click(option);

    const submitButton = screen.getByRole('button', { name: /submit answer/i });
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /answer submitted/i })).toBeInTheDocument();
  });

  it('should disable options after submission', async () => {
    const user = userEvent.setup();
    const onSubmitAnswer = vi.fn();

    renderWithProviders(
      <QuestionCard
        question={mockOptionsQuestion}
        questionNumber={1}
        totalQuestions={5}
        onSubmitAnswer={onSubmitAnswer}
      />
    );

    const option = screen.getByLabelText('4');
    await user.click(option);

    const submitButton = screen.getByRole('button', { name: /submit answer/i });
    await user.click(submitButton);

    // Radio button should be disabled
    const option2 = screen.getByLabelText('2') as HTMLInputElement;
    expect(option2).toBeDisabled();
  });
});

describe('QuestionCard - EXACT Type', () => {
  const mockExactQuestion: Question = {
    id: 'q2',
    text: 'What is the capital of France?',
    type: QuestionType.EXACT,
    value: 15,
    answer: 'Paris',
    options: [],
    acceptableAnswers: []
  };

  it('should render text input for EXACT type', () => {
    renderWithProviders(
      <QuestionCard
        question={mockExactQuestion}
        questionNumber={1}
        totalQuestions={5}
      />
    );

    const input = screen.getByPlaceholderText(/enter your answer/i);
    expect(input).toBeInTheDocument();
  });

  it('should enable submit button when text is entered', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuestionCard
        question={mockExactQuestion}
        questionNumber={1}
        totalQuestions={5}
      />
    );

    const input = screen.getByPlaceholderText(/enter your answer/i);
    await user.type(input, 'Paris');

    const submitButton = screen.getByRole('button', { name: /submit answer/i });
    expect(submitButton).toBeEnabled();
  });

  it('should call onSubmitAnswer with entered text', async () => {
    const user = userEvent.setup();
    const onSubmitAnswer = vi.fn();

    renderWithProviders(
      <QuestionCard
        question={mockExactQuestion}
        questionNumber={1}
        totalQuestions={5}
        onSubmitAnswer={onSubmitAnswer}
      />
    );

    const input = screen.getByPlaceholderText(/enter your answer/i);
    await user.type(input, 'Paris');

    const submitButton = screen.getByRole('button', { name: /submit answer/i });
    await user.click(submitButton);

    expect(onSubmitAnswer).toHaveBeenCalledWith('Paris');
  });
});
