import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, User, LogOut, ChevronDown,
  LayoutDashboard, Calendar, Ticket, QrCode, FileText, Globe,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function OrganizerHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const navItems = [
    { label: 'Dashboard', path: '/organizer', icon: <LayoutDashboard size={15} /> },
    { label: 'My Events', path: '/organizer/events', icon: <Calendar size={15} /> },
    { label: 'Registrations', path: '/organizer/registrations', icon: <Ticket size={15} /> },
    { label: 'Attendance', path: '/organizer/attendance', icon: <QrCode size={15} /> },
    { label: 'Reports', path: '/organizer/reports', icon: <FileText size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1329] border-b border-[#1E2D52] text-white shadow-xl">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo & College Branding */}
          <Link
            to="/organizer"
            className="flex items-center gap-3 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-blue-500 rounded-xl"
          >
            <img src="/assets/logo.png" alt="KSR Logo" className="h-9 w-auto object-contain flex-shrink-0" />
            <div className="hidden sm:block leading-tight">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold font-poppins text-white leading-tight">
                  KSR College of Engineering
                </p>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Organizer Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-tight mt-0.5">
                Campus Event Management Portal
              </p>
            </div>
          </Link>

          {/* Nav items desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#111C3A] p-1 rounded-xl border border-[#1E2D52]">
            {navItems.map(item => {
              const active =
                item.path === '/organizer'
                  ? location.pathname === '/organizer'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Create Event Button */}
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex shadow-md bg-blue-600 hover:bg-blue-500 text-white"
              leftIcon={<Plus size={15} />}
              onClick={() => navigate('/organizer/events/create')}
            >
              Create Event
            </Button>

            {/* Public Portal Link */}
            <Link
              to="/"
              title="View Public Campus Site"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111C3A] transition-colors border border-transparent hover:border-[#1E2D52]"
            >
              <Globe size={18} />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#111C3A] border border-[#1E2D52] hover:border-blue-500 transition-colors"
                aria-expanded={profileOpen}
                aria-label="Organizer user menu"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  <User size={14} />
                </div>
                <span className="hidden sm:block text-xs font-semibold text-white max-w-[100px] truncate">
                  {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Organizer'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-[#111C3A] rounded-xl border border-[#1E2D52] shadow-2xl py-1 text-white z-50 animate-slide-in"
                >
                  <div className="px-4 py-3 border-b border-[#1E2D52]">
                    <p className="text-xs font-bold text-white truncate">
                      {profile?.full_name || 'Faculty / Organizer'}
                    </p>
                    <p className="text-[11px] text-blue-300 font-mono truncate mt-0.5">
                      {user?.email || 'organizer@ksrce.ac.in'}
                    </p>
                  </div>

                  <Link
                    to="/"
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-[#1E2D52] hover:text-white transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Globe size={14} />
                    View Student Feed
                  </Link>

                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/30 transition-colors text-left"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2.5 border-t border-[#1E2D52] overflow-x-auto gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
