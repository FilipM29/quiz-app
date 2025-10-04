import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { QuizRound } from '../../types/quiz-creation';
import { QuestionEditor } from './QuestionEditor';

interface QuestionsStepProps {
  rounds: QuizRound[];
  onUpdate: (rounds: QuizRound[]) => void;
}

export const QuestionsStep = ({ rounds, onUpdate }: QuestionsStepProps) => {
  const [expandedRound, setExpandedRound] = useState<number | false>(
    rounds.length > 0 ? rounds[0].order : false
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roundToDelete, setRoundToDelete] = useState<QuizRound | null>(null);

  const handleRoundExpand =
    (roundOrder: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedRound(isExpanded ? roundOrder : false);
    };

  const updateRound = (updatedRound: QuizRound) => {
    const newRounds = rounds.map((round) =>
      round.order === updatedRound.order ? updatedRound : round
    );
    onUpdate(newRounds);
  };

  const handleDeleteClick = (round: QuizRound, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent accordion from expanding/collapsing
    setRoundToDelete(round);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!roundToDelete) return;

    // Filter out the deleted round and reorder
    const newRounds = rounds
      .filter((r) => r.order !== roundToDelete.order)
      .map((round, index) => ({
        ...round,
        order: index + 1
      }));

    // If the deleted round was expanded, close it
    if (expandedRound === roundToDelete.order) {
      setExpandedRound(newRounds.length > 0 ? newRounds[0].order : false);
    }

    onUpdate(newRounds);
    setDeleteDialogOpen(false);
    setRoundToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setRoundToDelete(null);
  };

  const getTotalQuestions = () => {
    return rounds.reduce((total, round) => total + round.questions.length, 0);
  };

  const getCompletedQuestions = () => {
    return rounds.reduce((total, round) => {
      return (
        total +
        round.questions.filter((q) => q.text && q.answer && q.value > 0).length
      );
    }, 0);
  };

  if (rounds.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Questions
        </Typography>
        <Alert severity="warning">
          You need to create at least one round before adding questions. Go back
          to the previous step to add rounds.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Questions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add questions to each round. You can create different types of
        questions: exact answers, multiple choice, or numeric ranges.
      </Typography>

      {/* Progress Summary */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <QuizIcon color="primary" />
          <Typography variant="subtitle1">Progress Summary</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`${getCompletedQuestions()} / ${getTotalQuestions()} Questions Complete`}
            color={
              getCompletedQuestions() === getTotalQuestions() &&
              getTotalQuestions() > 0
                ? 'success'
                : 'default'
            }
          />
          <Chip
            label={`${rounds.length} Round${rounds.length !== 1 ? 's' : ''}`}
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Rounds with Questions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {rounds.map((round) => (
          <Accordion
            key={round.order}
            expanded={expandedRound === round.order}
            onChange={handleRoundExpand(round.order)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%'
                }}>
                <Typography variant="h6">
                  Round {round.order}: {round.title}
                </Typography>
                <Chip
                  label={`${round.questions.length} question${round.questions.length !== 1 ? 's' : ''}`}
                  size="small"
                  color={round.questions.length > 0 ? 'primary' : 'default'}
                />
                {round.questions.length > 0 && (
                  <Chip
                    label={`${round.questions.filter((q) => q.text && q.answer && q.value > 0).length} complete`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                <Box sx={{ flex: 1 }} />
                <IconButton
                  onClick={(e) => handleDeleteClick(round, e)}
                  color="error"
                  size="small"
                  disabled={rounds.length === 1}
                  sx={{ mr: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <QuestionEditor round={round} onUpdate={updateRound} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Tips */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Question Tips:</strong>
          <br />• <strong>Exact:</strong> Text answers that must match exactly
          (with acceptable variations)
          <br />• <strong>Multiple Choice:</strong> Select one correct answer
          from options
          <br />• <strong>Range:</strong> Numeric answers within a specified
          range
          <br />• Each question should have a clear point value (typically
          100-1000 points)
        </Typography>
      </Alert>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Delete Round?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>
              Round {roundToDelete?.order}: {roundToDelete?.title}
            </strong>
            ?
            {roundToDelete && roundToDelete.questions.length > 0 && (
              <>
                <br />
                <br />
                <strong>Warning:</strong> This round contains{' '}
                {roundToDelete.questions.length} question
                {roundToDelete.questions.length !== 1 ? 's' : ''} that will also
                be deleted.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained">
            Delete Round
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
