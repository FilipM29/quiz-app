import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import { alpha, Box, Chip, Divider, Rating, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Link } from '@tanstack/react-router';
import { useCategories } from '../../context/categories-context';
import { Quiz } from '../../models/quiz';
import { getQuizPlaceholder } from '../../utils/quiz-placeholders';

type Props = {
  quiz: Quiz;
};

export default function QuizCard({ quiz }: Props) {
  const { getCategoryByValue } = useCategories();
  const category = getCategoryByValue(quiz.category) || {
    value: quiz.category,
    label: quiz.category,
    icon: '🧠',
    color: '#6B7280',
    quizCount: 0
  };
  const placeholderImage = getQuizPlaceholder(quiz, category);

  // Format creation date
  const createdDate = new Date(quiz.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card
      sx={{
        width: { xs: 280, sm: 320, md: 320, lg: 340 },
        height: '45vh',
        minHeight: '20rem',
        maxHeight: '28rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        flexShrink: 0
      }}>
      <CardActionArea
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          overflow: 'hidden'
        }}>
        <CardMedia
          component="img"
          sx={{
            height: '35%',
            minHeight: '7.5rem',
            objectFit: 'cover',
            backgroundColor: `${category.color}20`
          }}
          image={placeholderImage}
          alt={quiz.title}
        />
        <CardContent
          sx={{
            flex: '1 1 auto',
            p: { xs: 1.5, md: 2 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, md: 1.5 },
            overflow: 'hidden'
          }}>
          {/* Category chip */}
          <Box>
            <Chip
              label={category.label}
              size="small"
              sx={{
                bgcolor: `${category.color}20`,
                color: category.color,
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            component="div"
            fontWeight="bold"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              minHeight: '2.6em'
            }}>
            {quiz.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              minHeight: '2.8em'
            }}>
            {quiz.description}
          </Typography>

          {/* Stats */}
          <Box sx={{ mt: 'auto' }}>
            <Divider sx={{ mb: { xs: 1, md: 1.5 } }} />
            <Stack direction="column" spacing={1}>
              <Stack
                direction="row"
                spacing={{ xs: 1.5, md: 2 }}
                alignItems="center"
                flexWrap="wrap">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PeopleIcon
                    sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {quiz.numOfPlays || 0}
                  </Typography>
                </Stack>
                {/* Hide date on mobile */}
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <CalendarTodayIcon
                    sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {createdDate}
                  </Typography>
                </Stack>
                {quiz.rating > 0 && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Rating
                      value={quiz.rating}
                      readOnly
                      size="small"
                      icon={<StarIcon sx={{ fontSize: '0.875rem' }} />}
                      emptyIcon={<StarIcon sx={{ fontSize: '0.875rem' }} />}
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({quiz.rating})
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                <Chip
                  label={quiz.difficulty}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    bgcolor: (theme) =>
                      quiz.difficulty === 'EASY'
                        ? alpha(theme.palette.success.main, 0.1)
                        : quiz.difficulty === 'MEDIUM'
                          ? alpha(theme.palette.warning.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                    color:
                      quiz.difficulty === 'EASY'
                        ? 'success.dark'
                        : quiz.difficulty === 'MEDIUM'
                          ? 'warning.dark'
                          : 'error.dark',
                    borderColor:
                      quiz.difficulty === 'EASY'
                        ? 'success.main'
                        : quiz.difficulty === 'MEDIUM'
                          ? 'warning.main'
                          : 'error.main'
                  }}
                />
                <Chip
                  label={quiz.quizType}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ p: { xs: 1.5, md: 2 }, pt: 0, mt: 'auto' }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          fullWidth
          size="small"
          component={Link}
          to={`/play/${quiz.id}`}
          sx={{
            py: { xs: 1, md: 1.2 },
            fontWeight: 600,
            bgcolor: 'warning.main',
            '&:hover': { bgcolor: 'warning.dark' }
          }}>
          Play Quiz
        </Button>
      </CardActions>
    </Card>
  );
}
