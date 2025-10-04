import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../context/auth-context';
import { Question, QuestionType } from '../models/question';
import { Quiz } from '../models/quiz';
import { Round } from '../models/round';
import { PlaySession } from '../services/api/play-api';
import {
  QuizPhase,
  QuizSession,
  RoundResult,
  UserAnswer
} from '../types/quiz-session';
import { logger } from '../utils/logger';
import { useAuthenticatedApi } from './useAuthenticatedApi';

export const useQuizSession = (quizId: string) => {
  const { user } = useAuth();
  const { quizApiService, playApiService } = useAuthenticatedApi();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [playSession, setPlaySession] = useState<PlaySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState<'single' | 'multi' | null>(null);
  const [teams, setTeams] = useState<Array<{
    id: string;
    name: string;
    score: number;
  }> | null>(null);

  // Fetch quiz data
  const { data: quiz, error: quizError } = useSWR<Quiz>(
    quizId ? `quiz-${quizId}` : null,
    () => quizApiService.getQuizById(quizId),
    { revalidateOnFocus: false }
  );

  // Fetch quiz rounds
  const { data: rawRounds, error: roundsError } = useSWR<Round[]>(
    quizId ? `quiz-rounds-${quizId}` : null,
    () => quizApiService.getQuizRounds(quizId),
    { revalidateOnFocus: false }
  );

  // TODO: TEMPORARY CLIENT-SIDE WORKAROUND - Remove after backend fix
  // Backend is returning duplicate rounds for the same quiz (same order value)
  // This deduplication keeps the most recent round for each order
  // See BACKEND_TODO.md for required database constraint fix
  const rounds = useMemo(() => {
    if (!rawRounds) return undefined;

    // Check if we actually have duplicates
    const orderCounts = new Map<number, number>();
    rawRounds.forEach((r) => {
      orderCounts.set(r.order, (orderCounts.get(r.order) || 0) + 1);
    });

    const hasDuplicates = Array.from(orderCounts.values()).some(
      (count) => count > 1
    );

    if (hasDuplicates) {
      logger.warn('Duplicate rounds detected from backend:', {
        totalRounds: rawRounds.length,
        uniqueOrders: orderCounts.size,
        duplicateOrders: Array.from(orderCounts.entries())
          .filter(([, count]) => count > 1)
          .map(([order]) => order)
      });
    }

    return rawRounds
      .reduce((acc, round) => {
        const existingIndex = acc.findIndex((r) => r.order === round.order);
        if (existingIndex === -1) {
          acc.push(round);
        } else {
          // Keep the round with the most recent ID (assuming newer rounds have larger IDs)
          if (round.id > acc[existingIndex].id) {
            acc[existingIndex] = round;
          }
        }
        return acc;
      }, [] as Round[])
      .sort((a, b) => a.order - b.order);
  }, [rawRounds]);

  // Fetch all questions for all rounds
  const { data: allQuestions, error: questionsError } = useSWR<Question[][]>(
    rounds ? `quiz-questions-${quizId}` : null,
    async () => {
      if (!rounds) return [];
      const questionPromises = rounds.map((round) =>
        quizApiService.getRoundQuestions(round.id)
      );
      return Promise.all(questionPromises);
    },
    { revalidateOnFocus: false }
  );

  // Initialize quiz session
  useEffect(() => {
    if (quiz && rounds && allQuestions && !session) {
      const flattenedQuestions = allQuestions.flat();

      // Handle case where there are no questions
      if (flattenedQuestions.length === 0) {
        setError('This quiz has no questions available');
        setIsLoading(false);
        return;
      }

      const maxScore = flattenedQuestions.reduce((sum, q) => sum + q.value, 0);

      const newSession: QuizSession = {
        quiz,
        rounds,
        roundQuestions: allQuestions,
        allQuestions: flattenedQuestions,
        currentRoundIndex: 0,
        currentQuestionIndex: 0,
        currentGlobalQuestionIndex: 0,
        totalQuestions: flattenedQuestions.length,
        userAnswers: [],
        totalScore: 0,
        maxPossibleScore: maxScore,
        currentPhase: QuizPhase.NOT_STARTED,
        isComplete: false,
        startedAt: new Date(),
        roundResults: []
      };

      setSession(newSession);
      setIsLoading(false);
    }
  }, [quiz, rounds, allQuestions, session]);

  // Handle errors
  useEffect(() => {
    if (quizError || roundsError || questionsError) {
      setError('Failed to load quiz data');
      setIsLoading(false);
    }
  }, [quizError, roundsError, questionsError]);

  // Submit answer
  const submitAnswer = useCallback(
    async (userAnswer: string) => {
      if (!session) return;

      // Get current question inline to avoid dependency issues
      if (session.currentPhase !== QuizPhase.QUESTION) return;
      const currentRoundQuestions =
        session.roundQuestions[session.currentRoundIndex];
      if (!currentRoundQuestions) return;
      const currentQuestion =
        currentRoundQuestions[session.currentQuestionIndex];
      if (!currentQuestion) return;

      // Check answer inline to avoid dependency issues
      const isCorrect = (() => {
        if (!userAnswer.trim()) return false;
        const normalizedUserAnswer = userAnswer.trim().toLowerCase();

        switch (currentQuestion.type) {
          case QuestionType.OPTIONS:
            return (
              normalizedUserAnswer === currentQuestion.answer.toLowerCase()
            );
          case QuestionType.EXACT:
            return currentQuestion.acceptableAnswers.some(
              (acceptable) => acceptable.toLowerCase() === normalizedUserAnswer
            );
          default:
            return (
              normalizedUserAnswer === currentQuestion.answer.toLowerCase()
            );
        }
      })();

      const pointsEarned = isCorrect ? currentQuestion.value : 0;

      const newUserAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        question: currentQuestion,
        userAnswer,
        isCorrect,
        pointsEarned
      };

      // Only submit to backend if there's an active play session (authenticated users)
      if (playSession) {
        try {
          // Submit answer to backend
          await playApiService.submitAnswer({
            sessionId: playSession.id,
            questionId: currentQuestion.id,
            answer: userAnswer
          });

          // Move to next question in the backend
          await playApiService.nextQuestion(playSession.id);
        } catch (error) {
          logger.error('Failed to submit answer', error);
          setError('Failed to submit answer');
          return;
        }
      }

      setSession((prev) => {
        if (!prev) return prev;

        const updatedAnswers = [...prev.userAnswers, newUserAnswer];
        const newTotalScore = prev.totalScore + pointsEarned;
        const nextGlobalIndex = prev.currentGlobalQuestionIndex + 1;

        const currentRoundQuestions =
          prev.roundQuestions[prev.currentRoundIndex];
        const isLastQuestionInRound =
          prev.currentQuestionIndex >= currentRoundQuestions.length - 1;
        const isLastRound = prev.currentRoundIndex >= prev.rounds.length - 1;

        let newPhase = prev.currentPhase;
        const newRoundIndex = prev.currentRoundIndex;
        let newQuestionIndex = prev.currentQuestionIndex;
        let newRoundResults = prev.roundResults;

        if (isLastQuestionInRound) {
          // Completed current round - create round result
          const roundAnswers = updatedAnswers.filter((answer) =>
            currentRoundQuestions.some((q) => q.id === answer.questionId)
          );

          const roundResult: RoundResult = {
            roundIndex: prev.currentRoundIndex,
            round: prev.rounds[prev.currentRoundIndex],
            questionsInRound: currentRoundQuestions,
            answersInRound: roundAnswers,
            roundScore: roundAnswers.reduce(
              (sum, a) => sum + a.pointsEarned,
              0
            ),
            maxRoundScore: currentRoundQuestions.reduce(
              (sum, q) => sum + q.value,
              0
            ),
            correctAnswers: roundAnswers.filter((a) => a.isCorrect).length,
            totalQuestions: currentRoundQuestions.length
          };

          newRoundResults = [...prev.roundResults, roundResult];

          if (isLastRound) {
            newPhase = QuizPhase.QUIZ_COMPLETE;
            // Finish the session in the backend when quiz is complete (only for authenticated users)
            if (playSession) {
              playApiService.finishSession(playSession.id).catch((error) => {
                logger.error('Failed to finish session', error);
              });
            }
          } else {
            newPhase = QuizPhase.ROUND_SUMMARY;
          }
        } else {
          // Move to next question in same round
          newQuestionIndex = prev.currentQuestionIndex + 1;
        }

        const isComplete = nextGlobalIndex >= prev.totalQuestions;

        return {
          ...prev,
          userAnswers: updatedAnswers,
          totalScore: newTotalScore,
          currentGlobalQuestionIndex: nextGlobalIndex,
          currentRoundIndex: newRoundIndex,
          currentQuestionIndex: newQuestionIndex,
          currentPhase: newPhase,
          roundResults: newRoundResults,
          isComplete,
          completedAt: isComplete ? new Date() : undefined
        };
      });
    },
    [session, playSession, playApiService]
  );

  // Start quiz (create play session and move from NOT_STARTED to ROUND_INTRO)
  const startQuiz = useCallback(
    async (
      mode: 'single' | 'multi',
      teamsData?: Array<{ id: string; name: string }>
    ) => {
      if (!session) return;

      try {
        setPlayMode(mode);

        if (mode === 'multi' && teamsData) {
          // Initialize teams with scores
          const initializedTeams = teamsData.map((team) => ({
            ...team,
            score: 0
          }));
          setTeams(initializedTeams);

          // Create backend session for MULTI_OFFLINE
          if (user) {
            const newPlaySession = await playApiService.startSession({
              quizId,
              playType: 'MULTI_OFFLINE'
            });

            setPlaySession(newPlaySession);

            // Note: Teams are LOCAL players only - they don't join the backend session
            // Only the host (quiz master) is in the session
            // Teams are tracked in frontend state for local scoring

            // Start the game
            await playApiService.startGame(newPlaySession.id);
          }
        } else {
          // Single player mode
          if (user) {
            const newPlaySession = await playApiService.startSession({
              quizId,
              playType: 'SINGLE_ONLINE'
            });

            setPlaySession(newPlaySession);

            // Start the game immediately for single player
            await playApiService.startGame(newPlaySession.id);
          }
        }

        // Always advance phase (works for both modes)
        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentPhase: QuizPhase.ROUND_INTRO
          };
        });
      } catch (error) {
        logger.error('Failed to start play session', error);
        setError('Failed to start quiz session');
      }
    },
    [session, user, quizId, playApiService]
  );

  // Start current round (move from ROUND_INTRO to QUESTION)
  const startRound = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentPhase: QuizPhase.QUESTION
      };
    });
  }, []);

  // Move to next round (from ROUND_SUMMARY to ROUND_INTRO of next round)
  const nextRound = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentRoundIndex: prev.currentRoundIndex + 1,
        currentQuestionIndex: 0,
        currentPhase: QuizPhase.ROUND_INTRO
      };
    });
  }, []);

  // Memoize computed values to prevent infinite loops
  const currentQuestion = useMemo(() => {
    if (!session || session.currentPhase !== QuizPhase.QUESTION) return null;
    const currentRoundQuestions =
      session.roundQuestions[session.currentRoundIndex];
    if (!currentRoundQuestions) return null;
    return currentRoundQuestions[session.currentQuestionIndex] || null;
  }, [session]);

  const results = useMemo(() => {
    if (!session || !session.isComplete) return null;

    const correctAnswers = session.userAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    const accuracy = (correctAnswers / session.totalQuestions) * 100;
    const scorePercentage =
      (session.totalScore / session.maxPossibleScore) * 100;

    return {
      totalQuestions: session.totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy * 100) / 100,
      totalScore: session.totalScore,
      maxPossibleScore: session.maxPossibleScore,
      scorePercentage: Math.round(scorePercentage * 100) / 100,
      userAnswers: session.userAnswers,
      timeTaken: session.completedAt
        ? Math.round(
            (session.completedAt.getTime() - session.startedAt.getTime()) / 1000
          )
        : 0
    };
  }, [session]);

  // Reset quiz session for replay
  const resetQuiz = useCallback(() => {
    setSession(null);
    setPlaySession(null);
    setError(null);
    setPlayMode(null);
    setTeams(null);
    // Session will be reinit by useEffect when null
  }, []);

  // Show answer (MULTI_OFFLINE: move from QUESTION to ANSWER_REVEAL)
  const showAnswer = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentPhase: QuizPhase.ANSWER_REVEAL
      };
    });
  }, []);

  // Next question for MULTI_OFFLINE: advance to next question or show answers
  const nextQuestionMultiOffline = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;

      const currentRoundQuestions = prev.roundQuestions[prev.currentRoundIndex];
      const isLastQuestionInRound =
        prev.currentQuestionIndex >= currentRoundQuestions.length - 1;

      if (isLastQuestionInRound) {
        // Last question in round - show all answers
        return {
          ...prev,
          currentPhase: QuizPhase.ANSWER_REVEAL
        };
      } else {
        // Not last question - advance to next question
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          currentGlobalQuestionIndex: prev.currentGlobalQuestionIndex + 1
        };
      }
    });
  }, []);

  // Score players (MULTI_OFFLINE: handle round-based scoring)
  const scorePlayers = useCallback(
    async (
      scores?: Array<{ teamId: string; teamName: string; points: number }>
    ) => {
      if (!session) return;

      try {
        // If scores provided, we're in MANUAL_SCORING phase completing a round
        if (scores) {
          // Update team scores
          setTeams((prevTeams) => {
            if (!prevTeams) return prevTeams;
            return prevTeams.map((team) => {
              const scoreData = scores.find((s) => s.teamId === team.id);
              if (scoreData) {
                return {
                  ...team,
                  score: team.score + scoreData.points
                };
              }
              return team;
            });
          });

          // Create RoundResult for the completed round
          const currentRoundQuestions =
            session.roundQuestions[session.currentRoundIndex];
          const maxRoundScore = currentRoundQuestions.reduce(
            (sum, q) => sum + q.value,
            0
          );

          const roundResult: RoundResult = {
            roundIndex: session.currentRoundIndex,
            round: session.rounds[session.currentRoundIndex],
            questionsInRound: currentRoundQuestions,
            answersInRound: [], // Not applicable for MULTI_OFFLINE
            roundScore:
              scores.reduce((sum, s) => sum + s.points, 0) / scores.length, // Average for display
            maxRoundScore,
            correctAnswers: 0, // Not tracked in MULTI_OFFLINE
            totalQuestions: currentRoundQuestions.length
          };

          const isLastRound =
            session.currentRoundIndex >= session.rounds.length - 1;

          setSession((prev) => {
            if (!prev) return prev;

            const newRoundResults = [...prev.roundResults, roundResult];

            if (isLastRound) {
              // Quiz complete
              return {
                ...prev,
                roundResults: newRoundResults,
                currentPhase: QuizPhase.QUIZ_COMPLETE,
                isComplete: true,
                completedAt: new Date()
              };
            } else {
              // Move to round summary
              return {
                ...prev,
                roundResults: newRoundResults,
                currentPhase: QuizPhase.ROUND_SUMMARY
              };
            }
          });
        } else {
          // Just move from ANSWER_REVEAL to MANUAL_SCORING
          setSession((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              currentPhase: QuizPhase.MANUAL_SCORING
            };
          });
        }
      } catch (error) {
        logger.error('Failed to score players', error);
        setError('Failed to score players');
      }
    },
    [session]
  );

  return {
    session,
    currentQuestion,
    isLoading,
    error,
    submitAnswer,
    startQuiz,
    startRound,
    nextRound,
    resetQuiz,
    results,
    showAnswer,
    nextQuestionMultiOffline,
    scorePlayers,
    playMode,
    teams
  };
};
