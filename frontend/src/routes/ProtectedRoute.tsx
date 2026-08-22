import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Redirects unauthenticated users to /login,
 * preserving the current path as `?redirect=` for post-login return.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initialized } = useAuth();
  const location = useLocation();

  // Wait for auth to initialize before making decisions
  if (!initialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        aria-live="polite"
        role="status"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <span className="text-sm text-slate-500">Loading your account...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const returnPath = encodeURIComponent(
      location.pathname + location.search
    );
    return <Navigate to={`/login?redirect=${returnPath}`} replace />;
  }

  return <>{children}</>;
}
