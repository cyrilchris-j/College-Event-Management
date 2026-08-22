import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
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
  onSearchChange: _onSearchChange,
  onFilterClick: _onFilterClick,
  searchValue: _searchValue = '',
}: HeaderProps) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    setMobileOpen(false);
    if (window.location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      className="sticky top-4 z-50 w-[95%] max-w-[1280px] mx-auto transition-all duration-300"
    >
      <div className="bg-[#111C3A]/90 backdrop-blur-md rounded-full border border-[#1E2D52] shadow-xl px-5 md:px-8 flex items-center justify-between h-14 w-full">

        {/* ── LEFT: College branding ──────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-blue-500 rounded-lg"
          aria-label="KSR College of Engineering — Home"
        >
          <div
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <GraduationCap size={16} className="text-white" />
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-xs font-bold font-poppins text-white leading-none">
              KSR College of Engineering
            </p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Tiruchengode
            </p>
          </div>
        </Link>

        {/* ── CENTER: Navigation Links ─────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
          <button
            onClick={() => handleScrollTo('all-events-section')}
            className="hover:text-blue-400 transition-colors uppercase font-bold text-xs bg-transparent border-none p-0 cursor-pointer"
          >
            All Events
          </button>
          <button
            onClick={() => handleScrollTo('upcoming-events-section')}
            className="hover:text-blue-400 transition-colors uppercase font-bold text-xs bg-transparent border-none p-0 cursor-pointer"
          >
            Upcoming Events
          </button>
          {user && (
            <Link to="/my-registrations" className="hover:text-blue-400 transition-colors">
              My Tickets
            </Link>
          )}
          <button
            onClick={() => handleScrollTo('contact')}
            className="hover:text-blue-400 transition-colors uppercase font-bold text-xs bg-transparent border-none p-0 cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* ── RIGHT: Actions ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* User menu or Auth buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1329] border border-[#1E2D52] hover:border-blue-500 transition-all duration-150"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                aria-label="User menu"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className="hidden sm:block text-xs font-semibold text-white max-w-[80px] truncate">
                  {profile?.full_name?.split(' ')[0] ?? user.email.split('@')[0]}
                </span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 bg-[#111C3A] rounded-xl border border-[#1E2D52] shadow-xl py-1 text-white z-50"
                >
                  <Link
                    to="/my-registrations"
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-[#1E2D52] transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Ticket size={15} className="text-blue-400" />
                    My Tickets
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/20 transition-colors text-left"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 border border-[#1E2D52] bg-[#0b1329] hover:bg-[#1E2D52] text-white"
                onClick={() => navigate('/login')}
                aria-label="Log in to your account"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#1E2D52] transition-colors"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile nav drawer ────────────────────────────────────────────── */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden bg-[#111C3A]/95 backdrop-blur-md border border-[#1E2D52] rounded-2xl py-3 px-4 mt-2 space-y-1 shadow-xl text-white"
          aria-label="Mobile navigation"
        >
          <button
            onClick={() => handleScrollTo('all-events-section')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-[#1E2D52] transition-colors text-left bg-transparent border-none"
          >
            All Events
          </button>
          <button
            onClick={() => handleScrollTo('upcoming-events-section')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-[#1E2D52] transition-colors text-left bg-transparent border-none"
          >
            Upcoming Events
          </button>
          {!user && (
            <button
              onClick={() => { navigate('/login'); setMobileOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-400 rounded-lg hover:bg-[#1E2D52] transition-colors text-left bg-transparent border-none"
            >
              <LogIn size={16} />
              Log In
            </button>
          )}
          {user && (
            <>
              <Link
                to="/my-registrations"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg hover:bg-[#1E2D52] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Ticket size={16} />
                My Tickets
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-950/20 transition-colors text-left bg-transparent border-none"
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
