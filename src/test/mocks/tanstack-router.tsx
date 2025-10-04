import { vi } from 'vitest';
import { ReactNode } from 'react';

// Mock Link component that renders as a regular anchor tag
export const Link = ({ to, children, ...props }: { to: string; children: ReactNode; [key: string]: any }) => {
  return <a href={to} {...props}>{children}</a>;
};

// Mock router hooks
export const useNavigate = vi.fn();
export const useParams = vi.fn(() => ({}));
export const useSearch = vi.fn(() => ({}));
export const useRouter = vi.fn();
