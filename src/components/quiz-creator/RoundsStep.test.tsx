import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, userEvent } from '../../test/utils';
import { RoundsStep } from './RoundsStep';
import { QuizRound } from '../../types/quiz-creation';

describe('RoundsStep', () => {
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  describe('Initial rendering', () => {
    it('should show empty state when no rounds exist', () => {
      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      expect(
        screen.getByText(/no rounds created yet/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add round/i })).toBeInTheDocument();
    });

    it('should render existing rounds', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText(/round 1: round 1/i)).toBeInTheDocument();
      expect(screen.getByText(/round 2: round 2/i)).toBeInTheDocument();
    });

    it('should display question count for each round', () => {
      const mockRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            {
              text: 'Q1',
              type: 'EXACT',
              value: 10,
              answer: 'A1'
            },
            {
              text: 'Q2',
              type: 'OPTIONS',
              value: 10,
              answer: 'A2',
              options: ['A2', 'B2']
            }
          ]
        }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText(/2 questions/i)).toBeInTheDocument();
    });

    it('should display singular "question" for 1 question', () => {
      const mockRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            {
              text: 'Q1',
              type: 'EXACT',
              value: 10,
              answer: 'A1'
            }
          ]
        }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      expect(screen.getByText('1 question')).toBeInTheDocument();
    });

    it('should show tips alert', () => {
      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      expect(screen.getByText(/tips:/i)).toBeInTheDocument();
      expect(screen.getByText(/most quizzes work well with 3-5 rounds/i)).toBeInTheDocument();
    });
  });

  describe('Adding rounds', () => {
    it('should open dialog when Add Round button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add New Round')).toBeInTheDocument();
    });

    it('should add new round when saved', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      // Open dialog
      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      // Fill in title
      const titleInput = screen.getByLabelText(/round title/i);
      await user.type(titleInput, 'New Round');

      // Save
      const saveButton = screen.getByRole('button', { name: /add round/i });
      await user.click(saveButton);

      // Verify onUpdate called with new round
      expect(mockOnUpdate).toHaveBeenCalledWith([
        {
          title: 'New Round',
          order: 1,
          questions: []
        }
      ]);
    });

    it('should close dialog after successful save', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const titleInput = screen.getByLabelText(/round title/i);
      await user.type(titleInput, 'New Round');

      const saveButton = screen.getByRole('button', { name: /add round/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should add rounds with correct order', async () => {
      const user = userEvent.setup();
      const existingRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] }
      ];

      renderWithProviders(
        <RoundsStep rounds={existingRounds} onUpdate={mockOnUpdate} />
      );

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const titleInput = screen.getByLabelText(/round title/i);
      await user.type(titleInput, 'Round 2');

      const saveButton = screen.getByRole('button', { name: /add round/i });
      await user.click(saveButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ]);
    });

    it('should cancel adding round when Cancel is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const titleInput = screen.getByLabelText(/round title/i);
      await user.type(titleInput, 'New Round');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Editing rounds', () => {
    it('should open edit dialog with pre-filled title', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Original Title', order: 1, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Find edit button by icon testid
      const editIcon = screen.getByTestId('EditIcon');
      const editButton = editIcon.closest('button')!;
      await user.click(editButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit Round')).toBeInTheDocument();

      const titleInput = screen.getByLabelText(/round title/i) as HTMLInputElement;
      expect(titleInput.value).toBe('Original Title');
    });

    it('should update round when edited', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Original Title', order: 1, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const editIcon = screen.getByTestId('EditIcon');
      const editButton = editIcon.closest('button')!;
      await user.click(editButton);

      const titleInput = screen.getByLabelText(/round title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      const updateButton = screen.getByRole('button', { name: /update round/i });
      await user.click(updateButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Updated Title', order: 1, questions: [] }
      ]);
    });

    it('should preserve questions when editing round title', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        {
          title: 'Original',
          order: 1,
          questions: [
            { text: 'Q1', type: 'EXACT', value: 10, answer: 'A1' }
          ]
        }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      const editIcon = screen.getByTestId('EditIcon');
      const editButton = editIcon.closest('button')!;
      await user.click(editButton);

      const titleInput = screen.getByLabelText(/round title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated');

      const updateButton = screen.getByRole('button', { name: /update round/i });
      await user.click(updateButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        {
          title: 'Updated',
          order: 1,
          questions: [
            { text: 'Q1', type: 'EXACT', value: 10, answer: 'A1' }
          ]
        }
      ]);
    });
  });

  describe('Deleting rounds', () => {
    it('should delete round when delete button is clicked', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Find and click delete button for first round
      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[0].closest('button')!;
      await user.click(deleteButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 2', order: 1, questions: [] }
      ]);
    });

    it('should recalculate order when middle round is deleted', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] },
        { title: 'Round 3', order: 3, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Delete Round 2
      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[1].closest('button')!;
      await user.click(deleteButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 3', order: 2, questions: [] }
      ]);
    });
  });

  describe('Reordering rounds', () => {
    it('should move round up when up arrow is clicked', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Find up arrow for Round 2 (second up button that's not disabled)
      const upButtons = screen.getAllByRole('button', { name: '▲' });
      const secondRoundUpButton = upButtons[1];

      await user.click(secondRoundUpButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 2', order: 1, questions: [] },
        { title: 'Round 1', order: 2, questions: [] }
      ]);
    });

    it('should move round down when down arrow is clicked', async () => {
      const user = userEvent.setup();
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Find down arrow for Round 1 (first down button that's not disabled)
      const downButtons = screen.getAllByRole('button', { name: '▼' });
      const firstRoundDownButton = downButtons[0];

      await user.click(firstRoundDownButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 2', order: 1, questions: [] },
        { title: 'Round 1', order: 2, questions: [] }
      ]);
    });

    it('should disable up arrow for first round', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // First up button should be disabled
      const upButtons = screen.getAllByRole('button', { name: '▲' });
      const firstRoundUpButton = upButtons[0];

      expect(firstRoundUpButton).toBeDisabled();
    });

    it('should disable down arrow for last round', () => {
      const mockRounds: QuizRound[] = [
        { title: 'Round 1', order: 1, questions: [] },
        { title: 'Round 2', order: 2, questions: [] }
      ];

      renderWithProviders(<RoundsStep rounds={mockRounds} onUpdate={mockOnUpdate} />);

      // Second down button should be disabled
      const downButtons = screen.getAllByRole('button', { name: '▼' });
      const secondRoundDownButton = downButtons[1];

      expect(secondRoundDownButton).toBeDisabled();
    });
  });

  describe('Validation', () => {
    it('should show error when title is empty', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const saveButton = screen.getByRole('button', { name: /add round/i });
      await user.click(saveButton);

      expect(screen.getByText(/round title is required/i)).toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('should show error when title is only whitespace', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const titleInput = screen.getByLabelText(/round title/i);
      await user.type(titleInput, '   ');

      const saveButton = screen.getByRole('button', { name: /add round/i });
      await user.click(saveButton);

      expect(screen.getByText(/round title is required/i)).toBeInTheDocument();
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });

    it('should enforce max length of 100 characters on input', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const titleInput = screen.getByLabelText(/round title/i) as HTMLInputElement;

      // Verify maxLength attribute is set
      expect(titleInput).toHaveAttribute('maxLength', '100');
    });

    it('should show helper text in dialog', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      expect(
        screen.getByText(/enter a descriptive title for this round/i)
      ).toBeInTheDocument();
    });

    it('should trim whitespace from title before saving', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const titleInput = screen.getByLabelText(/round title/i);
      await user.type(titleInput, '  Round 1  ');

      const saveButton = screen.getByRole('button', { name: /add round/i });
      await user.click(saveButton);

      expect(mockOnUpdate).toHaveBeenCalledWith([
        { title: 'Round 1', order: 1, questions: [] }
      ]);
    });

    it('should clear errors when dialog is reopened', async () => {
      const user = userEvent.setup();

      renderWithProviders(<RoundsStep rounds={[]} onUpdate={mockOnUpdate} />);

      // First attempt - trigger error
      const addButton = screen.getByRole('button', { name: /add round/i });
      await user.click(addButton);

      const saveButton = screen.getByRole('button', { name: /add round/i });
      await user.click(saveButton);

      expect(screen.getByText(/round title is required/i)).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Reopen dialog
      await user.click(addButton);

      // Error should be cleared
      expect(screen.queryByText(/round title is required/i)).not.toBeInTheDocument();
    });
  });
});
