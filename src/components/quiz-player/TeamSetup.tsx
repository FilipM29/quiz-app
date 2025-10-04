import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

interface Team {
  id: string;
  name: string;
}

interface TeamSetupProps {
  quizTitle: string;
  onStart: (teams: Team[]) => void;
  onCancel: () => void;
}

export const TeamSetup = ({ quizTitle, onStart, onCancel }: TeamSetupProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState('');

  const handleAddTeam = () => {
    if (teamName.trim()) {
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: teamName.trim()
      };
      setTeams([...teams, newTeam]);
      setTeamName('');
    }
  };

  const handleRemoveTeam = (teamId: string) => {
    setTeams(teams.filter((t) => t.id !== teamId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTeam();
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {quizTitle}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
          Local Multiplayer Setup
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add teams or players who will participate. The quiz master will
          display questions and manually score each team's answers.
        </Typography>

        {/* Add Team Input */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            label="Team/Player Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter team or player name"
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleAddTeam}
            disabled={!teamName.trim()}
            startIcon={<AddIcon />}
            sx={{ minWidth: 100 }}>
            Add
          </Button>
        </Box>

        {/* Teams List */}
        {teams.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Teams ({teams.length})
            </Typography>
            <List
              sx={{
                bgcolor: 'grey.50',
                borderRadius: 1,
                maxHeight: 300,
                overflow: 'auto'
              }}>
              {teams.map((team) => (
                <ListItem
                  key={team.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveTeam(team.id)}
                      size="small">
                      <DeleteIcon />
                    </IconButton>
                  }>
                  <ListItemText primary={team.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {teams.length === 0 && (
          <Box
            sx={{
              p: 3,
              mb: 3,
              bgcolor: 'grey.50',
              borderRadius: 1,
              textAlign: 'center'
            }}>
            <Typography variant="body2" color="text.secondary">
              No teams added yet. Add at least one team to start.
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onStart(teams)}
            disabled={teams.length === 0}
            startIcon={<PlayArrowIcon />}
            sx={{
              bgcolor: 'warning.main',
              '&:hover': { bgcolor: 'warning.dark' }
            }}>
            Start Quiz
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
