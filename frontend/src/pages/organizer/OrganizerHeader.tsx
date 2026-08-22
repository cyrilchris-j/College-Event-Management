import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap, Search, Bell, Plus, User, Settings, LogOut, ChevronDown,
  LayoutDashboard, Calendar, Ticket, QrCode, FileText,
} from 'lucide-react';
import { MagnetButton } from '@/components/reactbits/MagnetButton';
import { ShinyText } from '@/components/reactbits/ShinyText';

export function OrganizerHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
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

  const navItems = [
    { label: 'Dashboard', path: '/organizer', icon: <LayoutDashboard size={15} /> },
    { label: 'My Events', path: '/organizer/events', icon: <Calendar size={15} /> },
    { label: 'Registrations', path: '/organizer/registrations', icon: <Ticket size={15} /> },
    { label: 'Attendance', path: '/organizer/attendance', icon: <QrCode size={15} /> },
    { label: 'Reports', path: '/organizer/reports', icon: <FileText size={15} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="container-main">
        <div className="flex items-center gap-6 h-16">
          {/* Logo & College Branding */}
          <Link
            to="/organizer"
            className="flex items-center gap-3 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-purple-500 rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold font-poppins text-white leading-tight">
                KSR College of Engineering
              </p>
              <p className="text-xs text-slate-400 leading-tight">
                Tiruchengode, Tamil Nadu
              </p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 mx-4 hidden md:block max-w-md">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="search"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search events, registrations, students..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800/90 border border-slate-700
                           rounded-lg text-white placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Notification bell */}
            <button
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            </button>

            {/* Organizer Avatar & Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-xs">
                  GD
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">Dr. Sarah Johnson</p>
                  <p className="text-[10px] text-purple-400 font-medium leading-tight">Event Organizer</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-fade-up text-white"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-slate-700/60">
                    <p className="text-xs font-semibold text-white">Google Developer Club</p>
                    <p className="text-[10px] text-slate-400">Club Coordinator</p>
                  </div>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={14} /> Profile
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={14} /> Settings
                  </button>
                  <div className="border-t border-slate-700/60 my-1" />
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/20 transition-colors"
                    onClick={() => { setProfileOpen(false); navigate('/'); }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation & Prominent CTA ────────────────────────────────── */}
      <div className="bg-slate-900/90 border-t border-slate-800">
        <div className="container-main flex items-center justify-between h-12">
          {/* Navigation tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1" aria-label="Organizer navigation">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/organizer' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={[
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800',
                  ].join(' ')}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Prominent + Create Event CTA */}
          <div className="flex-shrink-0 ml-4">
            <MagnetButton magnetStrength={0.25}>
              <button
                onClick={() => navigate('/organizer/events/create')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all"
              >
                <Plus size={15} />
                <ShinyText text="+ Create Event" speed={3} />
              </button>
            </MagnetButton>
          </div>
        </div>
      </div>
    </header>
  );
}
