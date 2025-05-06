import { LinkProps, Link as TanStackLink } from '@tanstack/react-router';

const QuizAppLink = ({ children, ...props }: LinkProps) => (
  <TanStackLink
    {...props}
    style={{
      color: 'inherit'
    }}>
    {children}
  </TanStackLink>
);

export default QuizAppLink;
