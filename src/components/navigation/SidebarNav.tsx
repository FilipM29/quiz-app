import AddIcon from '@mui/icons-material/Add';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import QuizIcon from '@mui/icons-material/Quiz';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ScienceIcon from '@mui/icons-material/Science';
import SportsIcon from '@mui/icons-material/Sports';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../context/auth-context';
import { useCategories } from '../../hooks/useCategories';
import { isIconUrl } from '../../utils/quiz-placeholders';

interface SidebarNavProps {
  open: boolean;
  onClose: () => void;
}

// Get category icon from database or fallback to MUI icon
const getCategoryIcon = (categoryIcon?: string, categoryValue?: string) => {
  // Use database icon if available
  if (categoryIcon) {
    // Check if it's a URL (image) or emoji
    if (isIconUrl(categoryIcon)) {
      return (
        <img
          src={categoryIcon}
          alt="Category icon"
          style={{
            width: '24px',
            height: '24px',
            objectFit: 'contain'
          }}
        />
      );
    } else {
      // Handle emoji icons
      return (
        <span
          style={{
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          {categoryIcon}
        </span>
      );
    }
  }

  // Fallback to MUI icons based on category value
  const normalizedValue = categoryValue?.toUpperCase() || '';
  switch (normalizedValue) {
    case 'SPORT':
    case 'SPORTS':
      return <SportsIcon />;
    case 'SCIENCE':
    case 'TECHNOLOGY':
    case 'TECH':
      return <ScienceIcon />;
    case 'HISTORY':
      return <HistoryEduIcon />;
    case 'GEOGRAPHY':
    case 'WORLD':
      return <PublicIcon />;
    case 'LITERATURE':
    case 'BOOKS':
      return <AutoStoriesIcon />;
    case 'BUSINESS':
    case 'FINANCE':
      return <BusinessIcon />;
    case 'ENTERTAINMENT':
    case 'MOVIES':
    case 'TV':
      return <TheaterComedyIcon />;
    case 'MUSIC':
      return <MusicNoteIcon />;
    case 'ART':
    case 'ARTS':
      return <PaletteIcon />;
    case 'FOOD':
    case 'COOKING':
      return <RestaurantIcon />;
    default:
      return <CategoryIcon />;
  }
};

export const SidebarNav = ({ open, onClose }: SidebarNavProps) => {
  const { categories, isLoading } = useCategories();
  const { user, isAuthenticated } = useAuth();

  const drawerWidth = 280;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}>
      {/* Header */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          QuizApp
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      {/* User Section */}
      {isAuthenticated && user && (
        <>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Divider />
        </>
      )}

      {/* Navigation */}
      <List>
        {/* Home */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            onClick={onClose}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {/* Quiz Creation Section */}
        {isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/create"
                onClick={onClose}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Create Quiz" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/my-quizzes"
                onClick={onClose}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}>
                <ListItemIcon>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary="My Quizzes" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Categories */}
        <ListItem>
          <ListItemText
            primary="Categories"
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: 'bold',
                color: 'text.secondary',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }
            }}
          />
        </ListItem>

        {isLoading
          ? // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={24} height={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Skeleton variant="text" width="80%" />}
                  />
                </ListItemButton>
              </ListItem>
            ))
          : categories.map((category) => (
              <ListItem key={category.value} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/category/${category.value.toLowerCase()}`}
                  onClick={onClose}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}>
                  <ListItemIcon>
                    {getCategoryIcon(category.icon, category.value)}
                  </ListItemIcon>
                  <ListItemText
                    primary={category.label}
                    secondary={
                      category.quizCount > 0
                        ? `${category.quizCount} quiz${
                            category.quizCount !== 1 ? 'es' : ''
                          }`
                        : undefined
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 QuizApp
        </Typography>
      </Box>
    </Drawer>
  );
};
