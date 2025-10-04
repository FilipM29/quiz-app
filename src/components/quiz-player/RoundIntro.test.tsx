import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent } from '../../test/utils';
import { RoundIntro } from './RoundIntro';
import { Round } from '../../models/round';

describe('RoundIntro', () => {
  const mockRound: Round = {
    id: 'round-1',
    title: 'Science Round',
    order: 1
  };

  const mockOnStartRound = vi.fn();

  beforeEach(() => {
    mockOnStartRound.mockClear();
  });

  describe('Display information', () => {
    it('should display round number and total rounds', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={2}
          totalRounds={5}
          questionsCount={10}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('Round 2 of 5')).toBeInTheDocument();
    });

    it('should display round title', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={5}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('Science Round')).toBeInTheDocument();
    });

    it('should display questions count', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={7}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
    });

    it('should display singular "Question" for 1 question', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={1}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Question')).toBeInTheDocument();
    });

    it('should display round information header', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={5}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('Round Information')).toBeInTheDocument();
    });

    it('should display instructions text', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={5}
          onStartRound={mockOnStartRound}
        />
      );

      expect(
        screen.getByText(
          /get ready for the next round! answer each question carefully/i
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/you cannot go back once you submit/i)
      ).toBeInTheDocument();
    });
  });

  describe('Start button', () => {
    it('should display start round button', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={5}
          onStartRound={mockOnStartRound}
        />
      );

      expect(
        screen.getByRole('button', { name: /start round/i })
      ).toBeInTheDocument();
    });

    it('should call onStartRound when button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={5}
          onStartRound={mockOnStartRound}
        />
      );

      const startButton = screen.getByRole('button', { name: /start round/i });
      await user.click(startButton);

      expect(mockOnStartRound).toHaveBeenCalledTimes(1);
    });

    it('should call onStartRound only once per click', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={5}
          onStartRound={mockOnStartRound}
        />
      );

      const startButton = screen.getByRole('button', { name: /start round/i });
      await user.click(startButton);
      await user.click(startButton);

      expect(mockOnStartRound).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle first round', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={5}
          questionsCount={3}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('Round 1 of 5')).toBeInTheDocument();
    });

    it('should handle last round', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={5}
          totalRounds={5}
          questionsCount={3}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('Round 5 of 5')).toBeInTheDocument();
    });

    it('should handle single round quiz', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={1}
          questionsCount={10}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('Round 1 of 1')).toBeInTheDocument();
    });

    it('should handle zero questions', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={0}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
    });

    it('should handle round with long title', () => {
      const longTitleRound: Round = {
        id: 'round-2',
        title: 'This is a Very Long Round Title That Tests Text Wrapping',
        order: 2
      };

      renderWithProviders(
        <RoundIntro
          round={longTitleRound}
          roundNumber={2}
          totalRounds={3}
          questionsCount={5}
          onStartRound={mockOnStartRound}
        />
      );

      expect(
        screen.getByText(
          'This is a Very Long Round Title That Tests Text Wrapping'
        )
      ).toBeInTheDocument();
    });

    it('should handle large question count', () => {
      renderWithProviders(
        <RoundIntro
          round={mockRound}
          roundNumber={1}
          totalRounds={3}
          questionsCount={100}
          onStartRound={mockOnStartRound}
        />
      );

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Questions')).toBeInTheDocument();
    });
  });
});
