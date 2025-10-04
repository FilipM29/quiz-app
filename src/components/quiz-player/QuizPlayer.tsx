import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useQuizSession } from '../../hooks/useQuizSession';
import { QuizPhase } from '../../types/quiz-session';
import { AnswerReveal } from './AnswerReveal';
import { ManualScoring, TeamScore } from './ManualScoring';
import { QuestionCard } from './QuestionCard';
import { QuizResults } from './QuizResults';
import { RoundIntro } from './RoundIntro';
import { RoundSummary } from './RoundSummary';
import { TeamSetup } from './TeamSetup';

interface QuizPlayerProps {
  quizId: string;
}

export const QuizPlayer = ({ quizId }: QuizPlayerProps) => {
  const { user } = useAuth();
  const {
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
    nextQuestionMultiOffline,
    scorePlayers,
    playMode,
    teams
  } = useQuizSession(quizId);

  // Handle auth redirects automatically
  useAuthRedirect(error ? new Error(error) : null);

  // Local state for mode selection
  const [selectedMode, setSelectedMode] = useState<'single' | 'multi' | null>(
    null
  );

  const handleStartQuiz = async (
    mode: 'single' | 'multi',
    teamsData?: Array<{ id: string; name: string }>
  ) => {
    await startQuiz(mode, teamsData);
    // Errors will be caught by useQuizSession and shown in the error state
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Loading quiz...
        </Typography>
      </Box>
    );
  }

  if (error || !session) {
    const errorMessage = error || 'Failed to load quiz';
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error.main">
          {errorMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {error || 'Quiz not found'}
        </Typography>
      </Box>
    );
  }

  // Handle different quiz phases
  if (session.currentPhase === QuizPhase.QUIZ_COMPLETE && results) {
    return (
      <QuizResults
        quizId={quizId}
        {...results}
        quizTitle={session.quiz.title}
        onPlayAgain={resetQuiz}
        teams={teams}
      />
    );
  }

  if (session.currentPhase === QuizPhase.ROUND_SUMMARY) {
    const lastRoundResult =
      session.roundResults[session.roundResults.length - 1];
    return (
      <RoundSummary
        roundResult={lastRoundResult}
        totalRounds={session.rounds.length}
        onNextRound={nextRound}
        teams={teams}
      />
    );
  }

  // Answer Reveal phase (MULTI_OFFLINE only)
  if (session.currentPhase === QuizPhase.ANSWER_REVEAL) {
    const currentRound = session.rounds[session.currentRoundIndex];
    const currentRoundQuestions =
      session.roundQuestions[session.currentRoundIndex];
    return (
      <AnswerReveal
        questions={currentRoundQuestions}
        roundTitle={currentRound.title}
        onScorePlayers={scorePlayers}
      />
    );
  }

  // Manual Scoring phase (MULTI_OFFLINE only)
  if (session.currentPhase === QuizPhase.MANUAL_SCORING) {
    if (!teams) return null;
    const currentRound = session.rounds[session.currentRoundIndex];
    const currentRoundQuestions =
      session.roundQuestions[session.currentRoundIndex];
    return (
      <ManualScoring
        questions={currentRoundQuestions}
        roundTitle={currentRound.title}
        teams={teams}
        onSubmitScores={(scores: TeamScore[]) => scorePlayers(scores)}
      />
    );
  }

  if (session.currentPhase === QuizPhase.ROUND_INTRO) {
    const currentRound = session.rounds[session.currentRoundIndex];
    const currentRoundQuestions =
      session.roundQuestions[session.currentRoundIndex];
    return (
      <RoundIntro
        round={currentRound}
        roundNumber={session.currentRoundIndex + 1}
        totalRounds={session.rounds.length}
        questionsCount={currentRoundQuestions.length}
        onStartRound={startRound}
      />
    );
  }

  if (session.currentPhase === QuizPhase.NOT_STARTED) {
    // Team setup screen for multiplayer
    if (selectedMode === 'multi') {
      return (
        <TeamSetup
          quizTitle={session.quiz.title}
          onStart={(teamsData) => handleStartQuiz('multi', teamsData)}
          onCancel={() => setSelectedMode(null)}
        />
      );
    }

    // Mode selection or single player start
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          {user ? (
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Welcome, {user.firstName}!
            </Typography>
          ) : (
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Playing as Guest
            </Typography>
          )}
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom>
            {session.quiz.title}
          </Typography>

          {session.quiz.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {session.quiz.description}
            </Typography>
          )}

          <Box sx={{ mb: 3 }}>
            <Chip
              label={session.quiz.category}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Quiz Stats */}
          <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quiz Information
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {session.totalQuestions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Questions
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {session.rounds.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rounds
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {session.maxPossibleScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Max Points
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mode Selection or Start */}
          {selectedMode === null ? (
            <>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Select Play Mode
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<PersonIcon />}
                  onClick={() => handleStartQuiz('single')}
                  sx={{ py: 2 }}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      Single Player
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Play and answer questions yourself
                    </Typography>
                  </Box>
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<GroupsIcon />}
                  onClick={() => setSelectedMode('multi')}
                  sx={{ py: 2 }}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      Local Multiplayer
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quiz master mode with teams
                    </Typography>
                  </Box>
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Once you start, you cannot go back to previous questions. Take
                your time and answer carefully!
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={() => handleStartQuiz('single')}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  bgcolor: 'warning.main',
                  '&:hover': { bgcolor: 'warning.dark' }
                }}>
                Start Quiz
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Questions phase
  if (session.currentPhase === QuizPhase.QUESTION) {
    if (!currentQuestion) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No more questions available
          </Typography>
        </Box>
      );
    }

    const progress =
      (session.currentGlobalQuestionIndex / session.totalQuestions) * 100;
    const currentRound = session.rounds[session.currentRoundIndex];

    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {session.currentGlobalQuestionIndex} / {session.totalQuestions}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'warning.main'
              }
            }}
          />
        </Box>

        {/* Score Display */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            Current Score: {session.totalScore} / {session.maxPossibleScore}
          </Typography>
          <Chip
            label={`${currentRound.title} (${session.currentQuestionIndex + 1}/${session.roundQuestions[session.currentRoundIndex].length})`}
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={session.currentQuestionIndex + 1}
          totalQuestions={
            session.roundQuestions[session.currentRoundIndex].length
          }
          onSubmitAnswer={playMode === 'single' ? submitAnswer : undefined}
          readOnly={playMode === 'multi'}
          onNextQuestion={
            playMode === 'multi' ? nextQuestionMultiOffline : undefined
          }
        />
      </Box>
    );
  }

  // Fallback for any unhandled phase
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary">
        Loading quiz phase...
      </Typography>
    </Box>
  );
};
