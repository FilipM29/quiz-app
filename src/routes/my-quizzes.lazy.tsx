import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  Publish as PublishIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { Link, createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionContainer } from '../components/layout/SectionContainer';
import { useToast } from '../context/toast-context';
import { useMyQuizzes } from '../hooks/useMyQuizzes';
import { MyQuiz } from '../types/quiz-creation';

export const Route = createLazyFileRoute('/my-quizzes')({
  component: MyQuizzesComponent
});

function MyQuizzesComponent() {
  const toast = useToast();
  const { quizzes, isLoading, error, deleteQuiz, updateQuizStatus } =
    useMyQuizzes();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<MyQuiz | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    quiz: MyQuiz
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuiz(quiz);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuiz(null);
  };

  const handleDelete = async () => {
    if (!selectedQuiz) return;

    setActionLoading(true);
    try {
      await deleteQuiz(selectedQuiz.id);
      toast.success(`"${selectedQuiz.title}" has been deleted`);
      setDeleteDialogOpen(false);
      handleMenuClose();
    } catch {
      toast.error('Failed to delete quiz. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (
    status: 'CONCEPT' | 'PUBLISHED' | 'ARCHIVED'
  ) => {
    if (!selectedQuiz) return;

    setActionLoading(true);
    try {
      await updateQuizStatus(selectedQuiz.id, status);
      const statusText = status.toLowerCase();
      toast.success(
        `Quiz ${statusText === 'published' ? 'published' : statusText === 'archived' ? 'archived' : 'saved as draft'} successfully`
      );
      handleMenuClose();
    } catch {
      toast.error('Failed to update quiz status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'ARCHIVED':
        return 'default';
      case 'CONCEPT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <SectionContainer
          title="My Quizzes"
          subtitle="Manage your created quizzes"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to="/create"
              disabled>
              Create New Quiz
            </Button>
          }>
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                  <LinearProgress />
                </Card>
              </Grid>
            ))}
          </Grid>
        </SectionContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Alert severity="error">
          Failed to load your quizzes. Please try again later.
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionContainer
        title="My Quizzes"
        subtitle="Manage your created quizzes"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/create">
            Create New Quiz
          </Button>
        }>
        {quizzes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No quizzes yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first quiz to get started!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to="/create">
              Create Your First Quiz
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {quizzes.map((quiz) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quiz.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                  {quiz.pictureUrl && (
                    <Box
                      component="img"
                      src={quiz.pictureUrl}
                      alt={quiz.title}
                      sx={{
                        height: 140,
                        objectFit: 'cover',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  )}

                  <CardContent sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1
                      }}>
                      <Typography variant="h6" sx={{ flex: 1, mr: 1 }}>
                        {quiz.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, quiz)}>
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                      {quiz.description}
                    </Typography>

                    <Box
                      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={quiz.quizStatus}
                        size="small"
                        color={
                          getStatusColor(quiz.quizStatus) as
                            | 'success'
                            | 'default'
                            | 'warning'
                        }
                      />
                      <Chip
                        label={quiz.category}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={
                          quiz.quizVisibility === 'PUBLIC' ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )
                        }
                        label={quiz.quizVisibility.toLowerCase()}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1
                      }}>
                      <Typography variant="body2" color="text.secondary">
                        {quiz.numOfRounds} round
                        {quiz.numOfRounds !== 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {quiz.numOfPlays} play{quiz.numOfPlays !== 1 ? 's' : ''}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Updated {formatDate(quiz.updatedAt)}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {quiz.quizStatus === 'CONCEPT' ? (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        component={Link}
                        to={`/edit/${quiz.id}`}
                        fullWidth>
                        Continue Editing
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        component={Link}
                        to={`/edit/${quiz.id}`}
                        fullWidth>
                        Edit
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}>
          {selectedQuiz?.quizStatus === 'CONCEPT' && (
            <MenuItem onClick={() => handleStatusChange('PUBLISHED')}>
              <PublishIcon sx={{ mr: 1 }} />
              Publish Quiz
            </MenuItem>
          )}

          {selectedQuiz?.quizStatus === 'PUBLISHED' && (
            <MenuItem onClick={() => handleStatusChange('ARCHIVED')}>
              <ArchiveIcon sx={{ mr: 1 }} />
              Archive Quiz
            </MenuItem>
          )}

          {selectedQuiz?.quizStatus === 'ARCHIVED' && (
            <MenuItem onClick={() => handleStatusChange('PUBLISHED')}>
              <PublishIcon sx={{ mr: 1 }} />
              Republish Quiz
            </MenuItem>
          )}

          <MenuItem onClick={() => setDeleteDialogOpen(true)}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Quiz
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Quiz</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedQuiz?.title}"? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              disabled={actionLoading}>
              {actionLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </SectionContainer>
    </PageContainer>
  );
}
