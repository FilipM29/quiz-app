import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { QuizRound } from '../../types/quiz-creation';

interface RoundsStepProps {
  rounds: QuizRound[];
  onUpdate: (rounds: QuizRound[]) => void;
}

export const RoundsStep = ({ rounds, onUpdate }: RoundsStepProps) => {
  const [editingRound, setEditingRound] = useState<QuizRound | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roundTitle, setRoundTitle] = useState('');
  const [errors, setErrors] = useState<string>('');

  const handleAddRound = () => {
    setEditingRound(null);
    setRoundTitle('');
    setErrors('');
    setIsDialogOpen(true);
  };

  const handleEditRound = (round: QuizRound) => {
    setEditingRound(round);
    setRoundTitle(round.title);
    setErrors('');
    setIsDialogOpen(true);
  };

  const handleSaveRound = () => {
    if (!roundTitle.trim()) {
      setErrors('Round title is required');
      return;
    }

    if (roundTitle.length > 100) {
      setErrors('Round title must be less than 100 characters');
      return;
    }

    const newRounds = [...rounds];

    if (editingRound) {
      // Update existing round
      const index = newRounds.findIndex((r) => r.order === editingRound.order);
      if (index !== -1) {
        newRounds[index] = {
          ...editingRound,
          title: roundTitle.trim()
        };
      }
    } else {
      // Add new round
      const newRound: QuizRound = {
        title: roundTitle.trim(),
        order: rounds.length + 1,
        questions: []
      };
      newRounds.push(newRound);
    }

    onUpdate(newRounds);
    setIsDialogOpen(false);
    setEditingRound(null);
    setRoundTitle('');
    setErrors('');
  };

  const handleDeleteRound = (roundToDelete: QuizRound) => {
    const newRounds = rounds
      .filter((r) => r.order !== roundToDelete.order)
      .map((round, index) => ({
        ...round,
        order: index + 1
      }));

    onUpdate(newRounds);
  };

  const moveRound = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= rounds.length) return;

    const newRounds = [...rounds];
    const [movedRound] = newRounds.splice(fromIndex, 1);
    newRounds.splice(toIndex, 0, movedRound);

    // Update order numbers
    const reorderedRounds = newRounds.map((round, index) => ({
      ...round,
      order: index + 1
    }));

    onUpdate(reorderedRounds);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRound(null);
    setRoundTitle('');
    setErrors('');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Quiz Structure
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Organize your quiz into rounds. Each round will contain multiple
        questions. You can reorder rounds by dragging them.
      </Typography>

      {/* Rounds List */}
      <Box sx={{ mb: 3 }}>
        {rounds.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No rounds created yet. Add your first round to get started!
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {rounds.map((round, index) => (
              <Card key={round.order} variant="outlined">
                <CardContent sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Drag Handle */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <IconButton
                        size="small"
                        onClick={() => moveRound(index, index - 1)}
                        disabled={index === 0}>
                        ▲
                      </IconButton>
                      <DragIcon color="action" />
                      <IconButton
                        size="small"
                        onClick={() => moveRound(index, index + 1)}
                        disabled={index === rounds.length - 1}>
                        ▼
                      </IconButton>
                    </Box>

                    {/* Round Info */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">
                        Round {round.order}: {round.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {round.questions.length} question
                        {round.questions.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleEditRound(round)}
                        color="primary"
                        size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteRound(round)}
                        color="error"
                        size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Add Round Button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddRound}
        fullWidth
        sx={{ mb: 2 }}>
        Add Round
      </Button>

      {/* Recommendations */}
      <Alert severity="info">
        <Typography variant="body2">
          <strong>Tips:</strong>
          <br />
          • Most quizzes work well with 3-5 rounds
          <br />
          • Each round should have a clear theme or difficulty level
          <br />• Consider organizing rounds by category, difficulty, or topic
        </Typography>
      </Alert>

      {/* Add/Edit Round Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          {editingRound ? 'Edit Round' : 'Add New Round'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Round Title"
            value={roundTitle}
            onChange={(e) => setRoundTitle(e.target.value)}
            error={!!errors}
            helperText={errors || 'Enter a descriptive title for this round'}
            fullWidth
            margin="normal"
            inputProps={{ maxLength: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveRound} variant="contained">
            {editingRound ? 'Update' : 'Add'} Round
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
