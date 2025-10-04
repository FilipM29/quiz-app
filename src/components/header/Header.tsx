import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from '@tanstack/react-router';
import { KeyboardEvent, useState } from 'react';
import { useAuth } from '../../context/auth-context';
import { authService } from '../../services/auth/auth-service';
import { useThemeMode } from '../../theme.tsx';
import { logger } from '../../utils/logger';
import { SidebarNav } from '../navigation/SidebarNav';
import QuizAppLink from '../QuizAppLink.tsx';

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Logout errors are typically not critical, log as warning
      logger.warn('Logout error', error);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery.trim() } });
      setSearchQuery('');
    }
  };

  const handleSearchKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleSidebarToggle}
            sx={{ mr: { xs: 1, sm: 2 } }}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              mr: { xs: 1, sm: 2, md: 4 },
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' }
            }}>
            QuizApp
          </Typography>

          {/* Search bar - hidden on xs, visible sm+ */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <Box sx={{ maxWidth: 320 }}>
              <TextField
                size="small"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          size="small"
                          onClick={handleSearchSubmit}
                          sx={{ color: 'text.secondary' }}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Box>
          </Box>

          {/* Mobile search icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }} />
          <Box sx={{ display: { xs: 'inline-flex', sm: 'none' }, mr: 1 }}>
            <QuizAppLink to="/search" search={{ q: '' }}>
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
            </QuizAppLink>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 }
            }}>
            {/* Home button - hidden on xs */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <QuizAppLink to="/">
                <Button color="inherit">Home</Button>
              </QuizAppLink>
            </Box>

            <IconButton
              onClick={toggleMode}
              color="inherit"
              aria-label="toggle theme">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <>
                    {/* User name - hidden on xs and sm */}
                    <Typography
                      variant="body2"
                      color="inherit"
                      sx={{
                        mx: 1,
                        display: { xs: 'none', md: 'block' }
                      }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Button
                      color="inherit"
                      onClick={handleLogout}
                      sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                      Logout
                    </Button>
                    {/* Mobile logout icon */}
                    <IconButton
                      color="inherit"
                      onClick={handleLogout}
                      sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        Logout
                      </Typography>
                    </IconButton>
                  </>
                ) : (
                  <>
                    {/* Desktop auth buttons */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <QuizAppLink to="/login">
                        <Button color="inherit">Sign In</Button>
                      </QuizAppLink>
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <QuizAppLink to="/register">
                        <Button
                          variant="contained"
                          sx={{
                            ml: 1,
                            bgcolor: 'warning.main',
                            '&:hover': { bgcolor: 'warning.dark' }
                          }}>
                          Sign Up
                        </Button>
                      </QuizAppLink>
                    </Box>
                    {/* Mobile auth button */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                      <QuizAppLink to="/login">
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            bgcolor: 'warning.main',
                            '&:hover': { bgcolor: 'warning.dark' },
                            fontSize: '0.75rem',
                            py: 0.5,
                            px: 1.5
                          }}>
                          Login
                        </Button>
                      </QuizAppLink>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <SidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </Box>
  );
}
