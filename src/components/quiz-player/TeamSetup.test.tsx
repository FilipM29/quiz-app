import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, userEvent } from '../../test/utils';
import { TeamSetup } from './TeamSetup';

describe('TeamSetup', () => {
  const mockOnStart = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
    mockOnCancel.mockClear();
  });

  describe('Initial rendering', () => {
    it('should display quiz title', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="My Awesome Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('My Awesome Quiz')).toBeInTheDocument();
    });

    it('should display setup header', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/local multiplayer setup/i)).toBeInTheDocument();
    });

    it('should display instructions', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText(/add teams or players who will participate/i)
      ).toBeInTheDocument();
    });

    it('should display team name input field', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByLabelText(/team\/player name/i)
      ).toBeInTheDocument();
    });

    it('should display add button', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument();
    });

    it('should disable add button when input is empty', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const addButton = screen.getByRole('button', { name: /^add$/i });
      expect(addButton).toBeDisabled();
    });

    it('should display empty state message', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByText(/no teams added yet/i)
      ).toBeInTheDocument();
    });

    it('should display back button', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should display start quiz button', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(
        screen.getByRole('button', { name: /start quiz/i })
      ).toBeInTheDocument();
    });

    it('should disable start quiz button when no teams', () => {
      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const startButton = screen.getByRole('button', { name: /start quiz/i });
      expect(startButton).toBeDisabled();
    });
  });

  describe('Adding teams', () => {
    it('should enable add button when text is entered', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      const addButton = screen.getByRole('button', { name: /^add$/i });

      expect(addButton).toBeDisabled();

      await user.type(input, 'Team 1');

      expect(addButton).not.toBeDisabled();
    });

    it('should add team when add button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      const addButton = screen.getByRole('button', { name: /^add$/i });

      await user.type(input, 'Team 1');
      await user.click(addButton);

      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    it('should add team when Enter key is pressed', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);

      await user.type(input, 'Team 1{Enter}');

      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    it('should clear input after adding team', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i) as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /^add$/i });

      await user.type(input, 'Team 1');
      await user.click(addButton);

      expect(input.value).toBe('');
    });

    it('should trim whitespace from team names', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      const addButton = screen.getByRole('button', { name: /^add$/i });

      await user.type(input, '  Team 1  ');
      await user.click(addButton);

      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    it('should not add team with only whitespace', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      const addButton = screen.getByRole('button', { name: /^add$/i });

      await user.type(input, '   ');

      expect(addButton).toBeDisabled();
    });

    it('should add multiple teams', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);

      await user.type(input, 'Team 1{Enter}');
      await user.type(input, 'Team 2{Enter}');
      await user.type(input, 'Team 3{Enter}');

      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.getByText('Team 2')).toBeInTheDocument();
      expect(screen.getByText('Team 3')).toBeInTheDocument();
    });

    it('should display team count', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);

      await user.type(input, 'Team 1{Enter}');
      await user.type(input, 'Team 2{Enter}');

      expect(screen.getByText('Teams (2)')).toBeInTheDocument();
    });

    it('should hide empty state message when teams are added', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/no teams added yet/i)).toBeInTheDocument();

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');

      expect(screen.queryByText(/no teams added yet/i)).not.toBeInTheDocument();
    });
  });

  describe('Removing teams', () => {
    it('should display delete button for each team', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');

      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      expect(deleteIcons.length).toBeGreaterThan(0);
    });

    it('should remove team when delete button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');

      expect(screen.getByText('Team 1')).toBeInTheDocument();

      const deleteIcon = screen.getByTestId('DeleteIcon');
      const deleteButton = deleteIcon.closest('button')!;
      await user.click(deleteButton);

      expect(screen.queryByText('Team 1')).not.toBeInTheDocument();
    });

    it('should show empty state after removing all teams', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');

      const deleteIcon = screen.getByTestId('DeleteIcon');
      const deleteButton = deleteIcon.closest('button')!;
      await user.click(deleteButton);

      expect(screen.getByText(/no teams added yet/i)).toBeInTheDocument();
    });

    it('should remove specific team when multiple teams exist', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');
      await user.type(input, 'Team 2{Enter}');
      await user.type(input, 'Team 3{Enter}');

      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[1].closest('button')!;
      await user.click(deleteButton);

      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.queryByText('Team 2')).not.toBeInTheDocument();
      expect(screen.getByText('Team 3')).toBeInTheDocument();
    });

    it('should update team count after deletion', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');
      await user.type(input, 'Team 2{Enter}');

      expect(screen.getByText('Teams (2)')).toBeInTheDocument();

      const deleteIcons = screen.getAllByTestId('DeleteIcon');
      const deleteButton = deleteIcons[0].closest('button')!;
      await user.click(deleteButton);

      expect(screen.getByText('Teams (1)')).toBeInTheDocument();
    });
  });

  describe('Action buttons', () => {
    it('should enable start quiz button when teams are added', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const startButton = screen.getByRole('button', { name: /start quiz/i });
      expect(startButton).toBeDisabled();

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');

      expect(startButton).not.toBeDisabled();
    });

    it('should call onStart with teams array when start button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');
      await user.type(input, 'Team 2{Enter}');

      const startButton = screen.getByRole('button', { name: /start quiz/i });
      await user.click(startButton);

      expect(mockOnStart).toHaveBeenCalledTimes(1);
      expect(mockOnStart).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Team 1' }),
          expect.objectContaining({ name: 'Team 2' })
        ])
      );
    });

    it('should call onCancel when back button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should disable start button after removing all teams', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, 'Team 1{Enter}');

      const startButton = screen.getByRole('button', { name: /start quiz/i });
      expect(startButton).not.toBeDisabled();

      const deleteIcon = screen.getByTestId('DeleteIcon');
      const deleteButton = deleteIcon.closest('button')!;
      await user.click(deleteButton);

      expect(startButton).toBeDisabled();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long team names', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const longName = 'This is a very long team name that should still work properly';
      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, `${longName}{Enter}`);

      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle special characters in team names', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const specialName = "Team #1 (Winner's Circle) & Co.";
      const input = screen.getByLabelText(/team\/player name/i);
      await user.type(input, `${specialName}{Enter}`);

      expect(screen.getByText(specialName)).toBeInTheDocument();
    });

    it('should handle adding many teams', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <TeamSetup
          quizTitle="Test Quiz"
          onStart={mockOnStart}
          onCancel={mockOnCancel}
        />
      );

      const input = screen.getByLabelText(/team\/player name/i);

      for (let i = 1; i <= 10; i++) {
        await user.type(input, `Team ${i}{Enter}`);
      }

      expect(screen.getByText('Teams (10)')).toBeInTheDocument();
      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.getByText('Team 10')).toBeInTheDocument();
    });
  });
});
