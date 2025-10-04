import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { quizCreationApiService } from '../services/api/quiz-creation-api';
import {
  CreateQuizRequest,
  QuizBasicInfo,
  QuizCreationState,
  QuizRound
} from '../types/quiz-creation';

const initialState: QuizCreationState = {
  basicInfo: {
    title: '',
    description: '',
    category: '',
    difficulty: 'EASY',
    quizType: 'SLIDES',
    quizVisibility: 'PUBLIC'
  },
  rounds: [],
  currentStep: 0,
  isComplete: false
};

export const useQuizCreation = (existingQuizId?: string) => {
  const [state, setState] = useState<QuizCreationState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const updateBasicInfo = (info: QuizBasicInfo) => {
    setState((prev) => ({
      ...prev,
      basicInfo: info
    }));
  };

  const updateRounds = (rounds: QuizRound[]) => {
    setState((prev) => ({
      ...prev,
      rounds
    }));
  };

  const setCurrentStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: step
    }));
  };

  const saveQuizDraft = async (): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const quizData: CreateQuizRequest = {
        title: state.basicInfo.title,
        description: state.basicInfo.description,
        category: state.basicInfo.category,
        difficulty: state.basicInfo.difficulty,
        quizType: state.basicInfo.quizType,
        quizStatus: 'CONCEPT',
        quizVisibility: state.basicInfo.quizVisibility,
        numOfRounds: state.rounds.length || 1,
        pictureUrl: state.basicInfo.pictureUrl
      };

      let quizId = state.quizId;

      if (quizId) {
        // Update existing quiz
        await quizCreationApiService.updateQuiz(quizId, quizData);
      } else {
        // Create new quiz
        const createdQuiz = await quizCreationApiService.createQuiz(quizData);
        quizId = createdQuiz.id;
        setState((prev) => ({ ...prev, quizId }));
      }

      // Save rounds and questions
      if (quizId) {
        // For existing quiz, get current rounds to manage updates/deletes
        const existingRounds =
          await quizCreationApiService.getRoundsByQuizId(quizId);
        const currentRoundIds = new Set(
          state.rounds.map((r) => r.id).filter(Boolean)
        );

        // Delete rounds that are no longer in the current state
        for (const existingRound of existingRounds) {
          if (!currentRoundIds.has(existingRound.id)) {
            await quizCreationApiService.deleteRound(existingRound.id);
          }
        }
      }

      // Create a copy of rounds to update with new IDs
      const updatedRounds = [...state.rounds];

      for (let i = 0; i < updatedRounds.length; i++) {
        const round = updatedRounds[i];
        let roundId = round.id;

        if (!roundId) {
          // Create new round
          const createdRound = await quizCreationApiService.createRound({
            title: round.title,
            order: round.order,
            quizId: quizId!
          });
          roundId = createdRound.id;
          // Update the round in our copy with the new ID
          updatedRounds[i] = { ...round, id: roundId };
        } else {
          // Update existing round
          await quizCreationApiService.updateRound(roundId, {
            title: round.title,
            order: round.order
          });
        }

        // Save questions for this round
        if (roundId) {
          // Fetch existing questions to manage updates/deletes
          const existingQuestions =
            await quizCreationApiService.getQuestionsByRoundId(roundId);
          const currentQuestionIds = new Set(
            round.questions.map((q) => q.id).filter(Boolean)
          );

          // Delete questions that are no longer in the current state
          for (const existingQuestion of existingQuestions) {
            if (!currentQuestionIds.has(existingQuestion.id)) {
              await quizCreationApiService.deleteQuestion(existingQuestion.id);
            }
          }

          // Create a copy of questions to update with new IDs
          const updatedQuestions = [...round.questions];

          // Create new questions or update existing ones
          for (let j = 0; j < updatedQuestions.length; j++) {
            const question = updatedQuestions[j];
            if (!question.id) {
              // Create new question
              const createdQuestion =
                await quizCreationApiService.createQuestion({
                  text: question.text,
                  type: question.type,
                  value: question.value,
                  answer: question.answer,
                  acceptableAnswers: question.acceptableAnswers,
                  options: question.options,
                  range: question.range,
                  pictureUrl: question.pictureUrl,
                  roundId
                });
              // Update the question in our copy with the new ID
              updatedQuestions[j] = { ...question, id: createdQuestion.id };
            } else {
              // Update existing question
              await quizCreationApiService.updateQuestion(question.id, {
                text: question.text,
                type: question.type,
                value: question.value,
                answer: question.answer,
                acceptableAnswers: question.acceptableAnswers,
                options: question.options,
                range: question.range,
                pictureUrl: question.pictureUrl
              });
            }
          }

          // Update the round with the updated questions
          updatedRounds[i] = {
            ...updatedRounds[i],
            questions: updatedQuestions
          };
        }
      }

      // Update state with all the new IDs
      setState((prev) => ({ ...prev, rounds: updatedRounds }));

      return quizId;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save quiz';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const publishQuiz = async (): Promise<boolean> => {
    const quizId = await saveQuizDraft();

    if (!quizId) return false;

    try {
      await quizCreationApiService.updateQuiz(quizId, {
        quizStatus: 'PUBLISHED'
      });

      setState((prev) => ({ ...prev, isComplete: true }));
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to publish quiz';
      setError(errorMessage);
      return false;
    }
  };

  const loadExistingQuiz = useCallback(async (quizId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const quiz = await quizCreationApiService.getQuizById(quizId);
      const rounds = await quizCreationApiService.getRoundsByQuizId(quizId);

      // Load questions for each round
      const roundsWithQuestions = await Promise.all(
        rounds.map(async (round) => {
          const questions = await quizCreationApiService.getQuestionsByRoundId(
            round.id
          );
          return {
            ...round,
            questions
          };
        })
      );

      setState({
        basicInfo: {
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          difficulty: quiz.difficulty,
          quizType: quiz.quizType,
          quizVisibility: quiz.quizVisibility,
          pictureUrl: quiz.pictureUrl
        },
        rounds: roundsWithQuestions,
        currentStep: 0,
        isComplete: false,
        quizId: quiz.id
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load quiz';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetState = () => {
    setState(initialState);
    setError(null);
  };

  useEffect(() => {
    if (existingQuizId) {
      loadExistingQuiz(existingQuizId);
    }
  }, [existingQuizId, loadExistingQuiz]);

  return {
    state,
    isLoading,
    error,
    updateBasicInfo,
    updateRounds,
    setCurrentStep,
    saveQuizDraft,
    publishQuiz,
    loadExistingQuiz,
    resetState
  };
};
