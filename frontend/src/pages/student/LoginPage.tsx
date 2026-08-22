import { useCallback, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUserById } from '@/services/authService';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!form.email || !form.password) {
        setError('Please fill in all fields.');
        return;
      }

      setLoading(true);
      const { error: loginError } = await login({
        email: form.email,
        password: form.password,
      });
      setLoading(false);

      if (loginError) {
        setError(loginError);
      } else {
        // Fetch current user role for smart redirection
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;
        const profile = userId ? await getUserById(userId) : null;

        if (profile?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (profile?.role === 'organizer') {
          navigate('/organizer', { replace: true });
        } else {
          navigate(redirectTo || '/', { replace: true });
        }
      }
    },
    [form, login, navigate, redirectTo]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header bar */}
      <div className="h-16 bg-white border-b border-border flex items-center px-6">
        <Link
          to="/"
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-blue-500 rounded-lg"
          aria-label="Go back to homepage"
        >
          <div className="w-8 h-8 rounded-xl bg-navy flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-navy">KSR College of Engineering</span>
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-border shadow-card p-8">
            {/* Heading */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-navy mx-auto flex items-center justify-center mb-4">
                <GraduationCap size={22} className="text-white" />
              </div>
              <h1 className="text-xl font-bold font-poppins text-navy">Welcome back</h1>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to your CampusConnect account
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                id="login-email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@ksrce.ac.in"
                autoComplete="email"
                required
                leftIcon={<Mail size={15} />}
              />

              {/* Password */}
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                leftIcon={<Lock size={15} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center mt-2"
                id="login-submit-btn"
              >
                Sign In
              </Button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
              <p className="text-xs text-slate-500">
                New Student?{' '}
                <Link
                  to="/"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Register for an event
                </Link>{' '}
                to get your credentials instantly!
              </p>
              <p className="text-xs text-slate-400">
                Faculty / Organisers: Sign in with your <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded">@ksrce.ac.in</code> email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
