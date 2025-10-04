import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Link,
  Stack,
  Typography
} from '@mui/material';
import type { LinkProps } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import QuizAppLink from '../QuizAppLink';

interface AuthCardProps {
  title: string;
  subheader: string;
  error: string | null;
  isLoading: boolean;
  submitButtonText: string;
  submitDisabled?: boolean;
  children: ReactNode;
  onSubmit: () => void;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: LinkProps['to'];
  footerLinkSearch?: LinkProps['search'];
}

export function AuthCard({
  title,
  subheader,
  error,
  isLoading,
  submitButtonText,
  submitDisabled = false,
  children,
  onSubmit,
  footerText,
  footerLinkText,
  footerLinkTo,
  footerLinkSearch
}: AuthCardProps) {
  return (
    <Container maxWidth="sm">
      <Card elevation={3} sx={{ mt: 4, mb: 4 }}>
        <CardHeader title={title} subheader={subheader} />
        <CardActionArea>
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}>
              <Stack spacing={3}>{children}</Stack>
            </form>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onSubmit}
            disabled={isLoading || submitDisabled}>
            {isLoading ? 'Loading...' : submitButtonText}
          </Button>

          <Typography variant="body2" color="text.secondary">
            {footerText}{' '}
            <QuizAppLink to={footerLinkTo} search={footerLinkSearch}>
              <Link component="span" underline="hover">
                {footerLinkText}
              </Link>
            </QuizAppLink>
          </Typography>
        </CardActions>
      </Card>
    </Container>
  );
}
