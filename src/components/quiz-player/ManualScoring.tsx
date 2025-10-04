import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { Question } from '../../models/question';

export interface TeamScore {
  teamId: string;
  teamName: string;
  points: number;
}

interface ManualScoringProps {
  questions: Question[];
  roundTitle: string;
  teams: Array<{ id: string; name: string; score: number }>;
  onSubmitScores: (scores: TeamScore[]) => void;
}

export const ManualScoring = ({
  questions,
  roundTitle,
  teams,
  onSubmitScores
}: ManualScoringProps) => {
  const maxRoundPoints = questions.reduce((sum, q) => sum + q.value, 0);

  // Initialize scores with full round points as default
  const [scores, setScores] = useState<Record<string, number>>(
    teams.reduce(
      (acc, team) => {
        acc[team.id] = maxRoundPoints;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const handleScoreChange = (teamId: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setScores({ ...scores, [teamId]: numValue });
    }
  };

  const handleSubmit = () => {
    const teamScores: TeamScore[] = teams.map((team) => ({
      teamId: team.id,
      teamName: team.name,
      points: scores[team.id] || 0
    }));
    onSubmitScores(teamScores);
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Score Teams - {roundTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Enter the total points earned by each team for this round.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Default is full round points ({maxRoundPoints} points total from{' '}
          {questions.length} questions).
        </Typography>

        {/* Round Summary */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300'
          }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Round Summary:
          </Typography>
          <Typography variant="body2" fontWeight="500">
            {questions.length} Questions · {maxRoundPoints} Total Points
          </Typography>
        </Box>

        {/* Team Scoring Inputs */}
        <Box sx={{ mb: 3 }}>
          {teams.map((team) => (
            <Box
              key={team.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300'
              }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="500">
                  {team.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current Total: {team.score} pts
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  type="number"
                  value={scores[team.id]}
                  onChange={(e) => handleScoreChange(team.id, e.target.value)}
                  size="small"
                  inputProps={{
                    min: 0,
                    max: maxRoundPoints,
                    step: 1
                  }}
                  sx={{ width: 100 }}
                />
                <Typography variant="body2" color="text.secondary">
                  / {maxRoundPoints} pts
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setScores(
                teams.reduce(
                  (acc, team) => {
                    acc[team.id] = maxRoundPoints;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              )
            }>
            All Full Points
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setScores(
                teams.reduce(
                  (acc, team) => {
                    acc[team.id] = Math.floor(maxRoundPoints / 2);
                    return acc;
                  },
                  {} as Record<string, number>
                )
              )
            }>
            All Half Points
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setScores(
                teams.reduce(
                  (acc, team) => {
                    acc[team.id] = 0;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              )
            }>
            All Zero Points
          </Button>
        </Box>

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          endIcon={<ArrowForwardIcon />}
          sx={{
            py: 1.5,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}>
          Submit Scores & Continue
        </Button>
      </CardContent>
    </Card>
  );
};
