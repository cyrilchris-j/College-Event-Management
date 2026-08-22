import { createClient } from '@supabase/supabase-js';

const defaultSupabaseUrl = 'https://tuczdhtpuannsqxcubtj.supabase.co';
const defaultSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Y3pkaHRwdWFubnNxeGN1YnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNzE1ODksImV4cCI6MjEwMjk0NzU4OX0.ueojbkQtbmRSx6cqT9bmgfpPUGC089CHSUi87erZ9-s';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultSupabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
