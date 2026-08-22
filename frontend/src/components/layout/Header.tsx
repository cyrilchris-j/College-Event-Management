import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  LogIn,
  Menu,
  X,
  GraduationCap,
  User,
  Ticket,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  searchValue?: string;
}

export function Header({
  onSearchChange,
  onFilterClick: _onFilterClick,
  searchValue = '',
}: HeaderProps) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full bg-white border-b border-border',
        'transition-shadow duration-200',
        scrolled ? 'shadow-sm' : '',
      ].join(' ')}
    >
      <div className="container-main">
        <div className="flex items-center gap-3 h-16">

          {/* ── LEFT: College branding ──────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-3 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-blue-500 rounded-lg"
            aria-label="KSR College of Engineering — Home"
          >
            {/* Logo/crest placeholder */}
            <div
              className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold font-poppins text-navy leading-tight">
                KSR College of Engineering
              </p>
              <p className="text-xs text-slate-500 leading-tight">
                Tiruchengode, Tamil Nadu
              </p>
            </div>
          </Link>

          {/* ── CENTER: Search bar ──────────────────────────────────────── */}
          <div className="flex-1 mx-4 hidden md:block">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                role="searchbox"
                aria-label="Search events"
                value={searchValue}
                onChange={e => onSearchChange?.(e.target.value)}
                placeholder="Search events, workshops, hackathons..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-border
                           rounded-lg text-navy placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* ── RIGHT: Actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto">


            {/* Login / User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={14} className="text-blue-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-navy max-w-[80px] truncate">
                    {profile?.full_name?.split(' ')[0] ?? user.email.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-border shadow-card-hover py-1"
                  >
                    <Link
                      to="/my-registrations"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy hover:bg-blue-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Ticket size={15} className="text-blue-600" />
                      My Tickets
                    </Link>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<LogIn size={14} />}
                onClick={() => navigate('/login')}
                aria-label="Log in to your account"
              >
                Log In
              </Button>
            )}



            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile: Search row ────────────────────────────────────────── */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search events"
              value={searchValue}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder="Search events, workshops..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-border
                         rounded-lg text-navy placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* ── Mobile nav drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden bg-white border-t border-border py-3 px-4 space-y-1"
          aria-label="Mobile navigation"
        >

          {!user && (
            <button
              onClick={() => { navigate('/login'); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <LogIn size={16} />
              Log In
            </button>
          )}
          {user && (
            <>
              <Link
                to="/my-registrations"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-navy rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Ticket size={16} />
                My Tickets
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
