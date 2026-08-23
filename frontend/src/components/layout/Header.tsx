import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogIn,
  Menu,
  X,
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
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const handleScrollTo = (id: string) => {
    setMobileOpen(false);
    setActiveSection(id);
    if (window.location.pathname !== '/') {
      navigate(`/?scroll=${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.pathname === '/organizer') {
      setActiveSection('organizer');
      return;
    }
    if (location.pathname === '/admin') {
      setActiveSection('admin');
      return;
    }
    if (location.pathname === '/my-registrations') {
      setActiveSection('tickets');
      return;
    }

    const handleScroll = () => {
      if (window.location.pathname !== '/') return;
      const sections = ['all-events-section', 'upcoming-events-section', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
          className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-blue-500 rounded-xl"
          aria-label="KSR College of Engineering — Home"
        >
          <img
            src="/assets/logo.png"
            alt="KSR Logo"
            className="h-9 w-auto object-contain flex-shrink-0"
            onError={(e) => {
              // Fallback icon if image path fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
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
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => handleScrollTo('all-events-section')}
            className={`transition-all uppercase font-bold text-xs bg-transparent border-none p-0 cursor-pointer ${
              activeSection === 'all-events-section'
                ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
                : 'text-slate-300 hover:text-blue-400'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => handleScrollTo('upcoming-events-section')}
            className={`transition-all uppercase font-bold text-xs bg-transparent border-none p-0 cursor-pointer ${
              activeSection === 'upcoming-events-section'
                ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
                : 'text-slate-300 hover:text-blue-400'
            }`}
          >
            Upcoming Events
          </button>
          {user && (user.role === 'student' || !user.role) && (
            <Link
              to="/my-registrations"
              className={`transition-all ${
                activeSection === 'tickets'
                  ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
                  : 'text-slate-300 hover:text-blue-400'
              }`}
            >
              My Tickets
            </Link>
          )}
          {user && user.role === 'organizer' && (
            <Link
              to="/organizer"
              className={`transition-all ${
                activeSection === 'organizer'
                  ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5 font-extrabold'
                  : 'text-slate-300 hover:text-blue-400'
              }`}
            >
              Organizer Dashboard
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className={`transition-all ${
                activeSection === 'admin'
                  ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5 font-extrabold'
                  : 'text-slate-300 hover:text-blue-400'
              }`}
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => handleScrollTo('contact')}
            className={`transition-all uppercase font-bold text-xs bg-transparent border-none p-0 cursor-pointer ${
              activeSection === 'contact'
                ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
                : 'text-slate-300 hover:text-blue-400'
            }`}
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
