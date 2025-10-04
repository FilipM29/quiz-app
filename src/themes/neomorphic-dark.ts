import { createTheme } from '@mui/material/styles';

export const neomorphicDarkTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#e2e8f0',
      light: '#f1f5f9',
      dark: '#cbd5e1'
    },
    secondary: {
      main: '#2a2f3e',
      light: '#363d4c',
      dark: '#1e2230'
    },
    background: {
      default: '#2a2f3e',
      paper: '#2a2f3e'
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8'
    },
    divider: 'rgba(226, 232, 240, 0.1)',
    warning: {
      main: '#ff8a50',
      light: '#ffb373',
      dark: '#cc6e40'
    }
  },
  shape: {
    borderRadius: '1.25rem'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#2a2f3e',
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#2a2f3e',
          border: 'none',
          boxShadow: '12px 12px 24px #1e2230, -12px -12px 24px #363d4c',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            boxShadow: '14px 14px 28px #1e2230, -14px -14px 28px #363d4c',
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: '#2a2f3e',
          color: '#e2e8f0',
          border: 'none',
          boxShadow: '6px 6px 12px #1e2230, -6px -6px 12px #363d4c',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 16,
          padding: '12px 24px',
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            background: '#2a2f3e',
            boxShadow: '7px 7px 14px #1e2230, -7px -7px 14px #363d4c',
            transform: 'translateY(-0.5px)'
          },
          '&:active': {
            boxShadow:
              'inset 6px 6px 12px #1e2230, inset -6px -6px 12px #363d4c',
            transform: 'translateY(0px)'
          },
          '&.MuiButton-contained': {
            background: '#ff8a50',
            color: 'white',
            boxShadow:
              '6px 6px 12px rgba(204, 110, 64, 0.3), -6px -6px 12px rgba(255, 179, 115, 0.2)',
            '&:hover': {
              background: '#ff9a60',
              boxShadow:
                '7px 7px 14px rgba(204, 110, 64, 0.35), -7px -7px 14px rgba(255, 179, 115, 0.25)',
              transform: 'translateY(-0.5px)'
            },
            '&:active': {
              background: '#ff7a40',
              boxShadow:
                'inset 4px 4px 8px rgba(204, 110, 64, 0.6), inset -4px -4px 8px rgba(255, 179, 115, 0.4)'
            }
          },
          '&.MuiButton-outlined': {
            backgroundColor: '#2a2f3e',
            borderColor: 'rgba(226, 232, 240, 0.2)',
            color: '#e2e8f0',
            '&:hover': {
              backgroundColor: '#2a2f3e',
              borderColor: 'rgba(226, 232, 240, 0.3)'
            }
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#2a2f3e',
            boxShadow:
              'inset 5px 5px 10px #1e2230, inset -5px -5px 10px #363d4c',
            border: 'none',
            borderRadius: 16,
            color: '#e2e8f0',
            transition: 'all 0.2s ease',
            '& fieldset': {
              border: 'none'
            },
            '&:hover': {
              boxShadow:
                'inset 6px 6px 11px #1e2230, inset -6px -6px 11px #363d4c'
            },
            '&.Mui-focused': {
              boxShadow:
                'inset 8px 8px 16px #1e2230, inset -8px -8px 16px #363d4c'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#94a3b8'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#2a2f3e',
          color: '#e2e8f0',
          boxShadow: '0 4px 20px rgba(30, 34, 48, 0.3)',
          '& .MuiToolbar-root': {
            minHeight: '70px'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background: '#2a2f3e',
          boxShadow: '5px 5px 10px #1e2230, -5px -5px 10px #363d4c',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: '#2a2f3e',
            boxShadow: '6px 6px 12px #1e2230, -6px -6px 12px #363d4c',
            transform: 'translateY(-0.5px)'
          },
          '&:active': {
            boxShadow:
              'inset 5px 5px 10px #1e2230, inset -5px -5px 10px #363d4c'
          }
        }
      }
    }
  }
});
