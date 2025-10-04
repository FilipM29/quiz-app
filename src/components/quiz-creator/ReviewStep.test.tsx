import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../../test/utils';
import { ReviewStep } from './ReviewStep';
import { QuizBasicInfo, QuizRound } from '../../types/quiz-creation';

describe('ReviewStep', () => {
  const mockBasicInfo: QuizBasicInfo = {
    title: 'Test Quiz',
    description: 'This is a test quiz',
    category: 'SCIENCE',
    difficulty: 'MEDIUM',
    quizType: 'SLIDES',
    quizVisibility: 'PUBLIC',
    pictureUrl: 'https://example.com/image.jpg'
  };

  const mockRounds: QuizRound[] = [
    {
      title: 'Round 1',
      order: 1,
      questions: [
        {
          text: 'What is 2+2?',
          type: 'EXACT',
          value: 100,
          answer: '4',
          acceptableAnswers: ['four', 'Four']
        },
        {
          text: 'Pick the correct answer',
          type: 'OPTIONS',
          value: 200,
          answer: 'B',
          options: ['A', 'B', 'C', 'D']
        }
      ]
    },
    {
      title: 'Round 2',
      order: 2,
      questions: [
        {
          text: 'What is the population of Earth?',
          type: 'INTERVAL',
          value: 300,
          answer: '8000000000',
          range: 500000000,
          pictureUrl: 'https://example.com/earth.jpg'
        }
      ]
    }
  ];

  describe('Completion status', () => {
    it('should show success alert when quiz is complete', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText(/quiz is ready to publish!/i)).toBeInTheDocument();
      expect(
        screen.getByText(/all required fields are complete/i)
      ).toBeInTheDocument();
    });

    it('should show warning alert when quiz is incomplete', () => {
      const incompleteRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: [
            {
              text: '',
              type: 'EXACT',
              value: 0,
              answer: ''
            }
          ]
        }
      ];

      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={incompleteRounds} />
      );

      expect(screen.getByText(/quiz is incomplete/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /please ensure all rounds have questions with valid answers and point values/i
        )
      ).toBeInTheDocument();
    });

    it('should show warning when quiz has no rounds', () => {
      renderWithProviders(<ReviewStep basicInfo={mockBasicInfo} rounds={[]} />);

      expect(screen.getByText(/quiz is incomplete/i)).toBeInTheDocument();
    });

    it('should show warning when rounds have no questions', () => {
      const emptyRounds: QuizRound[] = [
        {
          title: 'Round 1',
          order: 1,
          questions: []
        }
      ];

      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={emptyRounds} />
      );

      expect(screen.getByText(/quiz is incomplete/i)).toBeInTheDocument();
    });
  });

  describe('Quiz overview', () => {
    it('should display quiz title and description', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('Test Quiz')).toBeInTheDocument();
      expect(screen.getByText('This is a test quiz')).toBeInTheDocument();
    });

    it('should display category chip', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('SCIENCE')).toBeInTheDocument();
    });

    it('should display quiz type chip', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('SLIDES')).toBeInTheDocument();
    });

    it('should display visibility chip', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('PUBLIC')).toBeInTheDocument();
    });

    it('should display cover image when provided', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      const coverImage = screen.getByAltText('Quiz cover');
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should not display cover image when not provided', () => {
      const basicInfoWithoutImage = { ...mockBasicInfo, pictureUrl: undefined };

      renderWithProviders(
        <ReviewStep basicInfo={basicInfoWithoutImage} rounds={mockRounds} />
      );

      expect(screen.queryByAltText('Quiz cover')).not.toBeInTheDocument();
    });
  });

  describe('Statistics', () => {
    it('should display correct number of rounds', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      // Find the chip that displays round count (value "2" for 2 rounds)
      expect(screen.getByText('Rounds:')).toBeInTheDocument();
      // The chip with value 2 should be next to "Rounds:"
      const roundsSection = screen.getByText('Rounds:').closest('div')!;
      expect(roundsSection.textContent).toContain('2');
    });

    it('should calculate total questions correctly', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('Total Questions:')).toBeInTheDocument();
      const questionsSection = screen.getByText('Total Questions:').closest('div')!;
      // 2 questions in Round 1 + 1 question in Round 2 = 3 total
      expect(questionsSection.textContent).toContain('3');
    });

    it('should calculate total points correctly', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('Total Points:')).toBeInTheDocument();
      const pointsSection = screen.getByText('Total Points:').closest('div')!;
      // 100 + 200 + 300 = 600 points
      expect(pointsSection.textContent).toContain('600');
    });

    it('should estimate play time correctly', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      // 3 questions * 0.5 min + 2 rounds * 1 min = 1.5 + 2 = 3.5, rounded up to 4 minutes
      expect(screen.getByText(/~4 min/i)).toBeInTheDocument();
    });
  });

  describe('Round details', () => {
    it('should display all rounds', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText(/round 1: round 1/i)).toBeInTheDocument();
      expect(screen.getByText(/round 2: round 2/i)).toBeInTheDocument();
    });

    it('should display question count for each round', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      // Round 1 has 2 questions, Round 2 has 1 question
      const questionCountChips = screen.getAllByText(/questions?/i);
      expect(questionCountChips.length).toBeGreaterThan(0);
    });

    it('should display points for each round', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      // Round 1: 100 + 200 = 300 pts
      // Round 2: 300 pts
      // Both rounds have 300 pts, so there should be at least 2 instances
      const pointsChips = screen.getAllByText('300 pts');
      expect(pointsChips.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Question details', () => {
    it('should display question text', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
      expect(screen.getByText('Pick the correct answer')).toBeInTheDocument();
    });

    it('should display question type chips', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('EXACT')).toBeInTheDocument();
      expect(screen.getByText('OPTIONS')).toBeInTheDocument();
      expect(screen.getByText('INTERVAL')).toBeInTheDocument();
    });

    it('should display question points', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText('100 pts')).toBeInTheDocument();
      expect(screen.getByText('200 pts')).toBeInTheDocument();
    });

    it('should display question answers', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      const answerSections = screen.getAllByText(/^Answer:$/i);
      expect(answerSections.length).toBeGreaterThan(0);
    });

    it('should display acceptable answers for EXACT type questions', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText(/acceptable variations:/i)).toBeInTheDocument();
      expect(screen.getByText(/four, Four/i)).toBeInTheDocument();
    });

    it('should display options for OPTIONS type questions', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText(/^Options:$/i)).toBeInTheDocument();
      // Options are joined with " • ", look for them
      const optionsText = screen.getByText(/A • B • C • D/i);
      expect(optionsText).toBeInTheDocument();
    });

    it('should display range for INTERVAL type questions', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(screen.getByText(/acceptable range:/i)).toBeInTheDocument();
      expect(screen.getByText(/±500000000/i)).toBeInTheDocument();
    });

    it('should display question image when provided', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      const questionImage = screen.getByAltText('Question image');
      expect(questionImage).toBeInTheDocument();
      expect(questionImage).toHaveAttribute(
        'src',
        'https://example.com/earth.jpg'
      );
    });
  });

  describe('Publishing information', () => {
    it('should display final notes alert', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(
        screen.getByText(/what happens after publishing\?/i)
      ).toBeInTheDocument();
    });

    it('should display publishing details', () => {
      renderWithProviders(
        <ReviewStep basicInfo={mockBasicInfo} rounds={mockRounds} />
      );

      expect(
        screen.getByText(/your quiz will be available in the public quiz library/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/players can discover and play your quiz/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/you can view play statistics and feedback/i)
      ).toBeInTheDocument();
    });
  });
});
