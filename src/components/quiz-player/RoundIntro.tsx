import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography
} from '@mui/material';
import { Round } from '../../models/round';

interface RoundIntroProps {
  round: Round;
  roundNumber: number;
  totalRounds: number;
  questionsCount: number;
  onStartRound: () => void;
}

export const RoundIntro = ({
  round,
  roundNumber,
  totalRounds,
  questionsCount,
  onStartRound
}: RoundIntroProps) => {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        {/* Round Header */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={`Round ${roundNumber} of ${totalRounds}`}
            color="primary"
            variant="outlined"
            sx={{ mb: 2, fontSize: '1rem', py: 2 }}
          />
        </Box>

        {/* Round Title */}
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          gutterBottom
          sx={{ mb: 3 }}>
          {round.title}
        </Typography>

        {/* Round Stats */}
        <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Round Information
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                {questionsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {questionsCount === 1 ? 'Question' : 'Questions'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Instructions */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Get ready for the next round! Answer each question carefully - you
          cannot go back once you submit.
        </Typography>

        {/* Start Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={onStartRound}
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: 600,
            bgcolor: 'warning.main',
            '&:hover': { bgcolor: 'warning.dark' }
          }}>
          Start Round
        </Button>
      </CardContent>
    </Card>
  );
};
