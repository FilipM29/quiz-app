import { Alert, Snackbar } from '@mui/material';
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode
} from 'react';

type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  message: string;
  severity: ToastSeverity;
  duration?: number;
}

interface ToastContextType {
  showToast: (
    message: string,
    severity?: ToastSeverity,
    duration?: number
  ) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {}
});

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback(
    (message: string, severity: ToastSeverity = 'info', duration = 6000) => {
      setToast({ message, severity, duration });
    },
    []
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'success', duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'error', duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'warning', duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'info', duration);
    },
    [showToast]
  );

  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={toast?.duration || 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleClose}
          severity={toast?.severity || 'info'}
          variant="filled"
          sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
