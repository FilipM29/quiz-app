import { createTheme } from '@mui/material/styles';

export const neomorphicLightTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50',
      light: '#34495e',
      dark: '#1a252f'
    },
    secondary: {
      main: '#e6ebee',
      light: '#f0f5f8',
      dark: '#d1d6d9'
    },
    background: {
      default: '#e6ebee',
      paper: '#e6ebee'
    },
    text: {
      primary: '#2c3e50',
      secondary: '#5d6d78'
    },
    divider: 'rgba(44, 62, 80, 0.1)',
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
          backgroundColor: '#e6ebee',
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#e6ebee',
          border: 'none',
          boxShadow:
            '1.25rem 1.25rem 3.75rem #c5c9cc, -1.25rem -1.25rem 3.75rem #ffffff',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            boxShadow:
              '1.375rem 1.375rem 3.125rem #c5c9cc, -1.375rem -1.375rem 3.125rem #ffffff',
            transform: 'translateY(-0.0625rem)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: '#e6ebee',
          color: '#2c3e50',
          border: 'none',
          boxShadow: '0.5rem 0.5rem 1rem #c5c9cc, -0.5rem -0.5rem 1rem #ffffff',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '1rem',
          padding: '0.75rem 1.5rem',
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            background: '#e6ebee',
            boxShadow:
              '0.625rem 0.625rem 1.125rem #c5c9cc, -0.625rem -0.625rem 1.125rem #ffffff',
            transform: 'translateY(-0.0625rem)'
          },
          '&:active': {
            boxShadow:
              'inset 0.5rem 0.5rem 1rem #c5c9cc, inset -0.5rem -0.5rem 1rem #ffffff',
            transform: 'translateY(0rem)'
          },
          '&.MuiButton-contained': {
            background: '#ff8a50',
            color: 'white',
            boxShadow:
              '0.5rem 0.5rem 1rem rgba(204, 110, 64, 0.3), -0.5rem -0.5rem 1rem rgba(255, 179, 115, 0.2)',
            '&:hover': {
              background: '#ff9a60',
              boxShadow:
                '0.625rem 0.625rem 1.125rem rgba(204, 110, 64, 0.35), -0.625rem -0.625rem 1.125rem rgba(255, 179, 115, 0.25)',
              transform: 'translateY(-0.0625rem)'
            },
            '&:active': {
              background: '#ff7a40',
              boxShadow:
                'inset 0.25rem 0.25rem 0.5rem rgba(204, 110, 64, 0.6), inset -0.25rem -0.25rem 0.5rem rgba(255, 179, 115, 0.4)'
            }
          },
          '&.MuiButton-outlined': {
            backgroundColor: '#e6ebee',
            borderColor: 'rgba(44, 62, 80, 0.2)',
            color: '#2c3e50',
            '&:hover': {
              backgroundColor: '#e6ebee',
              borderColor: 'rgba(44, 62, 80, 0.3)'
            }
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#e6ebee',
            boxShadow:
              'inset 0.375rem 0.375rem 0.75rem #c5c9cc, inset -0.375rem -0.375rem 0.75rem #ffffff',
            border: 'none',
            borderRadius: '1rem',
            transition: 'all 0.2s ease',
            '& fieldset': {
              border: 'none'
            },
            '&:hover': {
              boxShadow:
                'inset 0.4375rem 0.4375rem 0.875rem #c5c9cc, inset -0.4375rem -0.4375rem 0.875rem #ffffff'
            },
            '&.Mui-focused': {
              boxShadow:
                'inset 0.625rem 0.625rem 1.25rem #c5c9cc, inset -0.625rem -0.625rem 1.25rem #ffffff'
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#e6ebee',
          color: '#2c3e50',
          boxShadow: '0 0.25rem 1.25rem rgba(197, 201, 204, 0.3)',
          '& .MuiToolbar-root': {
            minHeight: '4.375rem'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background: '#e6ebee',
          boxShadow:
            '0.375rem 0.375rem 0.75rem #c5c9cc, -0.375rem -0.375rem 0.75rem #ffffff',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: '#e6ebee',
            boxShadow:
              '0.5rem 0.5rem 1rem #c5c9cc, -0.5rem -0.5rem 1rem #ffffff',
            transform: 'translateY(-0.0625rem)'
          },
          '&:active': {
            boxShadow:
              'inset 0.375rem 0.375rem 0.75rem #c5c9cc, inset -0.375rem -0.375rem 0.75rem #ffffff'
          }
        }
      }
    }
  }
});
