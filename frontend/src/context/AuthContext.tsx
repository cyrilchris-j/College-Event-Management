/**
 * AuthContext.tsx
 * Provides authentication state and actions across the app.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '@/services/supabase';
import {
  signInWithEmail,
  signOut as authSignOut,
  signUpWithEmail,
  getUserById,
  getStudentProfile,
} from '@/services/authService';
import type {
  AuthState,
  User,
  StudentProfile,
  LoginCredentials,
  SignupCredentials,
} from '@/types';

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ error: string | null }>;
  signup: (credentials: SignupCredentials) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    initialized: false,
  });

  // ── Load user from existing session ──────────────────────────────────────
  const loadUser = useCallback(async (supabaseUserId: string) => {
    try {
      const [user, profile] = await Promise.all([
        getUserById(supabaseUserId),
        getStudentProfile(supabaseUserId),
      ]);
      setState(prev => ({
        ...prev,
        user,
        profile,
        loading: false,
        initialized: true,
      }));
    } catch {
      setState(prev => ({
        ...prev,
        user: null,
        profile: null,
        loading: false,
        initialized: true,
      }));
    }
  }, []);

  // ── Listen to Supabase auth state changes ────────────────────────────────
  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadUser(data.session.user.id);
      } else {
        setState(prev => ({ ...prev, loading: false, initialized: true }));
      }
    });

    // Listen for changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUser(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setState({ user: null, profile: null, loading: false, initialized: true });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Silently refresh user if needed
          const user: User | null = await getUserById(session.user.id);
          setState(prev => ({ ...prev, user }));
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [loadUser]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ error: string | null }> => {
      setState(prev => ({ ...prev, loading: true }));
      const { user, error } = await signInWithEmail(credentials);
      if (error || !user) {
        setState(prev => ({ ...prev, loading: false }));
        return { error: error ?? 'Login failed.' };
      }
      const profile: StudentProfile | null = await getStudentProfile(user.id);
      setState({ user, profile, loading: false, initialized: true });
      return { error: null };
    },
    []
  );

  const signup = useCallback(
    async (credentials: SignupCredentials): Promise<{ error: string | null }> => {
      setState(prev => ({ ...prev, loading: true }));
      const { user, error } = await signUpWithEmail(credentials);
      if (error || !user) {
        setState(prev => ({ ...prev, loading: false }));
        return { error: error ?? 'Signup failed.' };
      }
      const profile: StudentProfile | null = await getStudentProfile(user.id);
      setState({ user, profile, loading: false, initialized: true });
      return { error: null };
    },
    []
  );

  const logout = useCallback(async () => {
    await authSignOut();
    setState({ user: null, profile: null, loading: false, initialized: true });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}
