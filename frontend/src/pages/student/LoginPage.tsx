import { useCallback, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, GraduationCap, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const isUnauthorized = searchParams.get('unauthorized') === '1';

  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    isUnauthorized
      ? 'Access Restricted: Please sign in with your @ksrce.ac.in Organizer or Admin account to access this portal.'
      : null
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!form.email || !form.password) {
        setError('Please fill in all fields.');
        return;
      }

      setLoading(true);
      const { user: loggedInUser, error: loginError } = await login({
        email: form.email,
        password: form.password,
      });
      setLoading(false);

      if (loginError || !loggedInUser) {
        setError(loginError || 'Invalid email or password.');
      } else {
        // Smart Role-Based Redirection
        const userRole = loggedInUser.role;

        if (userRole === 'admin') {
          // If redirectTo was an admin page, use it, else default to /admin
          const dest = redirectTo && redirectTo.startsWith('/admin') ? redirectTo : '/admin';
          navigate(dest, { replace: true });
        } else if (userRole === 'organizer') {
          // If redirectTo was an organizer page, use it, else default to /organizer
          const dest = redirectTo && redirectTo.startsWith('/organizer') ? redirectTo : '/organizer';
          navigate(dest, { replace: true });
        } else {
          // Student role
          const dest = redirectTo && !redirectTo.startsWith('/admin') && !redirectTo.startsWith('/organizer')
            ? redirectTo
            : '/my-registrations';
          navigate(dest, { replace: true });
        }
      }
    },
    [form, login, navigate, redirectTo]
  );

  return (
    <div className="min-h-screen bg-[#0B1329] flex flex-col text-white">
      {/* Header bar */}
      <div className="h-16 bg-[#111C3A] border-b border-[#1E2D52] flex items-center px-6">
        <Link
          to="/"
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-blue-500 rounded-lg"
          aria-label="Go back to homepage"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-sm font-bold font-poppins text-white">
            KSR College of Engineering
          </span>
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#111C3A] rounded-3xl border border-[#1E2D52] shadow-2xl p-8 animate-slide-in">
            {/* Heading */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 mx-auto flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h1 className="text-xl font-bold font-poppins text-white">
                Sign in to CampusConnect
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to access your portal
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 leading-relaxed animate-shake"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                id="login-email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="name@ksrce.ac.in"
                leftIcon={<Mail size={16} />}
                autoComplete="email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  leftIcon={<Lock size={16} />}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-8 text-slate-400 hover:text-white p-1 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
                  loading={loading}
                >
                  Sign In
                </Button>
              </div>
            </form>

            {/* Credentials helper card */}
            <div className="mt-6 pt-5 border-t border-[#1E2D52] space-y-2 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Demo Accounts:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-[#1E2D52]">admin@ksrce.ac.in</span>
                <span className="bg-[#0B1329] px-2 py-1 rounded border border-[#1E2D52]">organizer@ksrce.ac.in</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Default Password: <code>Campus@123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
