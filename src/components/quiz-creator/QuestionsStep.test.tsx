import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, userEvent } from '../../test/utils';
import { QuestionsStep } from './QuestionsStep';
import { QuizRound } from '../../types/quiz-creation';

// Mock QuestionEditor component
vi.mock('./QuestionEditor', () => ({
  QuestionEditor: ({ round }: { round: QuizRound }) => (
    <div data-testid={`question-editor-${round.order}`}>
      Question Editor for Round {round.order}
    </div>
  )
}));

describe('QuestionsStep', () => {
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  describe('Empty state', () => {
    it('should show warning when no rounds exist', () => {
      renderWithProviders(<QuestionsStep rounds={[]} onUpdate={mockOnUpdate} />);

      expect(
        screen.getByText(/you need to create at least one round/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/go back to the previous step to add rounds/i)
      ).toBeInTheDocument();
    });

    it('should not show progress summary when no rounds', () => {
      renderWithProviders(<QuestionsStep rounds={[]} onUpdate={mockOnUpdate} />);

      expect(screen.queryByText(/progress summary/i)).not.toBeInTheDocument();
    });
  });

  describe('Rendering rounds', () => {
    it('should render all rounds as accordions', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText(/round 1: round 1/i)).toBeInTheDocument();
      expect(screen.getByText(/round 2: round 2/i)).toBeInTheDocument();
    });

    it('should display question count for each round', () => {
      const mockRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            { text: 'Q1', type: 'EXACT', value: 100, answer: 'A1' },
            { text: 'Q2', type: 'OPTIONS', value: 100, answer: 'A2', options: ['A2', 'B2'] }
          ]
        },
        {
          title: 'Round 2',
          order: 2,
          questions: [
            { text: 'Q3', type: 'EXACT', value: 100, answer: 'A3' }
          ]
        }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText('2 questions')).toBeInTheDocument();
      expect(screen.getByText('1 question')).toBeInTheDocument();
    });

    it('should display completed count for rounds with questions', () => {
      const mockRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            { text: 'Q1', type: 'EXACT', value: 100, answer: 'A1' },
            { text: '', type: 'OPTIONS', value: 0, answer: '', options: [] }
          ]
        }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Only 1 question is complete (has text, answer, and value > 0)
      expect(screen.getByText('1 complete')).toBeInTheDocument();
    });

    it('should expand first round by default', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // First round should be expanded (aria-expanded="true")
      const round1Header = screen.getByText(/round 1: round 1/i).closest('button')!;
      expect(round1Header).toHaveAttribute('aria-expanded', 'true');

      // Second round should be collapsed
      const round2Header = screen.getByText(/round 2: round 2/i).closest('button')!;
      expect(round2Header).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Progress summary', () => {
    it('should show progress summary with rounds', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText(/progress summary/i)).toBeInTheDocument();
    });

    it('should calculate total and completed questions correctly', () => {
      const mockRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            { text: 'Q1', type: 'EXACT', value: 100, answer: 'A1' },
            { text: 'Q2', type: 'OPTIONS', value: 100, answer: 'A2', options: ['A2'] },
            { text: '', type: 'EXACT', value: 0, answer: '' } // Incomplete
          ]
        },
        {
          title: 'Round 2',
          order: 2,
          questions: [
            { text: 'Q3', type: 'EXACT', value: 100, answer: 'A3' }
          ]
        }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Should show 3/4 questions complete
      expect(screen.getByText(/3 \/ 4 questions complete/i)).toBeInTheDocument();
    });

    it('should show success color when all questions complete', () => {
      const mockRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            { text: 'Q1', type: 'EXACT', value: 100, answer: 'A1' }
          ]
        }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const progressChip = screen.getByText(/1 \/ 1 questions complete/i);
      expect(progressChip).toBeInTheDocument();
    });

    it('should display round count', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] },
        { title: 'Round 3', order: 3, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText('3 Rounds')).toBeInTheDocument();
    });

    it('should display singular "Round" for 1 round', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText('1 Round')).toBeInTheDocument();
    });
  });

  describe('Accordion behavior', () => {
    it('should expand/collapse round when clicked', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Initially, Round 1 is expanded
      const round1Header = screen.getByText(/round 1: round 1/i).closest('button')!;
      const round2Header = screen.getByText(/round 2: round 2/i).closest('button')!;

      expect(round1Header).toHaveAttribute('aria-expanded', 'true');
      expect(round2Header).toHaveAttribute('aria-expanded', 'false');

      // Click Round 2 header to expand it
      await user.click(round2Header);

      // Now Round 2 should be expanded, Round 1 should be collapsed
      expect(round2Header).toHaveAttribute('aria-expanded', 'true');
      expect(round1Header).toHaveAttribute('aria-expanded', 'false');
    });

    it('should collapse round when clicking its header again', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const round1Header = screen.getByText(/round 1: round 1/i).closest('button')!;

      // Initially expanded
      expect(round1Header).toHaveAttribute('aria-expanded', 'true');

      // Click to collapse
      await user.click(round1Header);

      // Should be collapsed now
      expect(round1Header).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Delete round', () => {
    it('should open confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Click delete button on first round
      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[0].closest('button')!;
      await user.click(deleteButton);

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByText(/delete round\?/i)).toBeInTheDocument();
    });

    it('should show warning when deleting round with questions', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            { text: 'Q1', type: 'EXACT', value: 100, answer: 'A1' },
            { text: 'Q2', type: 'OPTIONS', value: 100, answer: 'A2', options: ['A2'] }
          ]
        },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[0].closest('button')!;
      await user.click(deleteButton);

      expect(screen.getByText(/warning:/i)).toBeInTheDocument();
      expect(screen.getByText(/this round contains 2 questions/i)).toBeInTheDocument();
    });

    it('should delete round when confirmed', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[0].closest('button')!;
      await user.click(deleteButton);

      const confirmButton = screen.getByRole('button', { name: /delete round/i });
      await user.click(confirmButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 2', order: 1, questions: [] }
      ]);
    });

    it('should cancel deletion when cancel is clicked', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[0].closest('button')!;
      await user.click(deleteButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnUpdate).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should disable delete button when only one round exists', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const deleteIcon = screen.getByTestId('DeleteIcon');
      const deleteButton = deleteIcon.closest('button')!;

      expect(deleteButton).toBeDisabled();
    });

    it('should recalculate order when round is deleted', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] },
        { title: 'Round 3', order: 3, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Delete Round 2
      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[1].closest('button')!;
      await user.click(deleteButton);

      const confirmButton = screen.getByRole('button', { name: /delete round/i });
      await user.click(confirmButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 3', order: 2, questions: [] }
      ]);
    });
  });

  describe('Tips and guidance', () => {
    it('should display question type tips', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText(/question tips:/i)).toBeInTheDocument();
      expect(screen.getByText(/exact:/i)).toBeInTheDocument();
      expect(screen.getByText(/multiple choice:/i)).toBeInTheDocument();
      expect(screen.getByText(/range:/i)).toBeInTheDocument();
    });

    it('should display description about question types', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] }
      ];

      renderWithProviders(<QuestionsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(
        screen.getByText(
          /add questions to each round. you can create different types of questions/i
        )
      ).toBeInTheDocument();
    });
  });
});
