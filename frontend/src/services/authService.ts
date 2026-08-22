/**
 * authService.ts
 * Supabase Auth operations — sign in, sign up, sign out, profile fetching.
 * Endpoints: Supabase Auth + users + student_profiles tables.
 */

import { supabase } from './supabase';
import type { User, StudentProfile, LoginCredentials, SignupCredentials } from '@/types';

// ─── Auth Operations ─────────────────────────────────────────────────────────

/**
 * POST /auth/v1/token?grant_type=password
 * Sign in with email and password.
 */
export async function signInWithEmail(
  credentials: LoginCredentials
): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: 'No user returned.' };
  }

  // Fetch role from users table
  const user = await getUserById(data.user.id);
  return { user, error: null };
}

/**
 * POST /auth/v1/signup
 * Create a new student account and profile.
 * Generates a unique student_id: CCS-2026-XXXXX
 */
export async function signUpWithEmail(
  credentials: SignupCredentials
): Promise<{ user: User | null; error: string | null }> {
  // 1. Create auth account
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.full_name,
        role: 'student',
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: 'Signup failed. Please try again.' };
  }

  const userId = data.user.id;

  // 2. Generate student ID
  const studentId = `CCS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  // 3. Insert into users table
  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    email: credentials.email,
    role: 'student',
    student_id: studentId,
  });

  if (userError) {
    console.error('[authService] Insert users error:', userError.message);
  }

  // 4. Insert student profile
  const { error: profileError } = await supabase.from('student_profiles').insert({
    user_id: userId,
    full_name: credentials.full_name,
    roll_number: credentials.roll_number,
    department: credentials.department,
    year_of_study: credentials.year_of_study,
    phone: credentials.phone ?? null,
  });

  if (profileError) {
    console.error('[authService] Insert student_profiles error:', profileError.message);
  }

  const user = await getUserById(userId);
  return { user, error: null };
}

/**
 * POST /auth/v1/logout
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// ─── User Fetching ────────────────────────────────────────────────────────────

/**
 * GET /rest/v1/users?id=eq.{userId}
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, student_id, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[authService] getUserById error:', error.message);
    return null;
  }

  return data as User;
}

/**
 * GET /rest/v1/student_profiles?user_id=eq.{userId}
 */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from('student_profiles')
    .select('id, user_id, full_name, roll_number, department, year_of_study, phone')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('[authService] getStudentProfile error:', error.message);
    return null;
  }

  return data as StudentProfile;
}

/**
 * Returns the current Supabase session user.
 */
export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
