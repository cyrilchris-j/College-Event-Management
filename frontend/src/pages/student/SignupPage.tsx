import { useCallback, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, GraduationCap, User, Hash, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'Artificial Intelligence and Data Science',
];

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';

  const { signup } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    roll_number: '',
    department: DEPARTMENTS[0],
    year_of_study: 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    (field: string, value: string | number) =>
      setForm(prev => ({ ...prev, [field]: value })),
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!form.full_name || !form.email || !form.password || !form.roll_number) {
        setError('Please fill in all required fields.');
        return;
      }
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }

      setLoading(true);
      const { error: signupError } = await signup({
        ...form,
        year_of_study: Number(form.year_of_study),
      });
      setLoading(false);

      if (signupError) {
        setError(signupError);
      } else {
        navigate(redirectTo, { replace: true });
      }
    },
    [form, signup, navigate, redirectTo]
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

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl border border-border shadow-card p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-navy mx-auto flex items-center justify-center mb-4">
                <GraduationCap size={22} className="text-white" />
              </div>
              <h1 className="text-xl font-bold font-poppins text-navy">Create your account</h1>
              <p className="text-sm text-slate-500 mt-1">
                Join CampusConnect and discover campus events
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full name */}
              <Input
                label="Full Name"
                type="text"
                id="signup-name"
                value={form.full_name}
                onChange={e => update('full_name', e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
                leftIcon={<User size={15} />}
              />

              {/* Email */}
              <Input
                label="College Email"
                type="email"
                id="signup-email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="roll@ksrce.ac.in"
                autoComplete="email"
                required
                leftIcon={<Mail size={15} />}
              />

              {/* Roll number */}
              <Input
                label="Roll Number"
                type="text"
                id="signup-roll"
                value={form.roll_number}
                onChange={e => update('roll_number', e.target.value)}
                placeholder="e.g. 73152413003"
                required
                leftIcon={<Hash size={15} />}
              />

              {/* Department + Year row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-dept" className="text-sm font-medium text-navy">
                    Department <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      id="signup-dept"
                      value={form.department}
                      onChange={e => update('department', e.target.value)}
                      required
                      className="w-full pl-8 pr-3 py-2.5 text-sm text-navy border border-border rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d.split(' ').slice(0, 3).join(' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-year" className="text-sm font-medium text-navy">
                    Year <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="signup-year"
                    value={form.year_of_study}
                    onChange={e => update('year_of_study', Number(e.target.value))}
                    required
                    className="w-full px-3 py-2.5 text-sm text-navy border border-border rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {[1, 2, 3, 4].map(y => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="signup-password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                required
                leftIcon={<Lock size={15} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="pointer-events-auto text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"
                >
                  ⚠ {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center mt-2"
              >
                Create Account
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                  to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors
                             focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
