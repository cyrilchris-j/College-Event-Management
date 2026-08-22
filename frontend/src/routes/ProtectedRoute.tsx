import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Redirects unauthenticated or unauthorized users to /login,
 * preserving the current path as `?redirect=` for post-login return.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, initialized } = useAuth();
  const location = useLocation();

  // Wait for auth to initialize before making decisions
  if (!initialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#0B1329]"
        aria-live="polite"
        role="status"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400">Verifying session permissions...</span>
        </div>
      </div>
    );
  }

  // Not logged in ➔ Redirect to login
  if (!user) {
    const returnPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnPath}`} replace />;
  }

  // Role verification (if specific roles are required)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const returnPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnPath}&unauthorized=1`} replace />;
  }

  return <>{children}</>;
}
