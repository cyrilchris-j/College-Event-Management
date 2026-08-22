import { useEffect, useRef, useState } from 'react';
import {
  GraduationCap, Search, Bell, ChevronRight, CalendarDays,
  Users, Building2, Ticket, MapPin, Clock, ShieldCheck,
  TrendingUp, TrendingDown, X, ArrowUpRight, Zap, ChevronDown, User,
  FileText, Download
} from 'lucide-react';
import './admin.css';
import { SplitText } from '@/components/reactbits/SplitText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { AnimatedCounter } from '@/components/reactbits/AnimatedCounter';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { MagnetButton } from '@/components/reactbits/MagnetButton';
import {
  ADMIN_EVENTS, ADMIN_ORGANIZERS, ADMIN_REGISTRATIONS,
  EVENT_STATUS_CONFIG, CATEGORY_COLORS,
  type AdminEvent
} from './adminData';

// ─── Utility ───────────────────────────────────────────────────────────────────

function pct(r: number, c: number) { return Math.round((r / c) * 100); }

function StatusBadge({ status }: { status: string }) {
  const cfg = EVENT_STATUS_CONFIG[status as keyof typeof EVENT_STATUS_CONFIG] ?? EVENT_STATUS_CONFIG.Open;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {status}
    </span>
  );
}

function CategoryPill({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] ?? '#68778C';
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded"
      style={{ color, background: `${color}18` }}
    >
      {category}
    </span>
  );
}

function MiniProgress({ value, color = '#3B82F6' }: { value: number; color?: string }) {
  const clipped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px]" style={{ color: '#AAB6C7' }}>{clipped}%</span>
      </div>
      <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${clipped}%`, background: color }}
        />
      </div>
    </div>
  );
}

function BlueDivider() {
  return (
    <div className="blue-divider" style={{ width: '48px', margin: '8px 0' }} />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="admin-eyebrow">{children}</span>;
}

function MetricItem({
  icon, value, label, trend, trendUp = true, delay = 0,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const numericVal = parseFloat(value.replace(/,/g, '').replace('%', '')) || 0;
  const suffix = value.includes('%') ? '%' : value.includes('+') ? '+' : '';

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShown(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <SpotlightCard
      spotlightColor="rgba(59, 130, 246, 0.15)"
      className="h-full"
    >
      <div
        ref={ref}
        className="flex flex-col gap-1.5 px-6 py-5"
        style={{ opacity: shown ? 1 : 0, transition: `opacity 0.5s ease ${delay}ms` }}
      >
        <div className="flex items-center gap-2 mb-0.5" style={{ color: '#68778C' }}>
          {icon}
          <span className="admin-eyebrow" style={{ color: '#68778C', letterSpacing: '0.1em' }}>
            {label}
          </span>
        </div>
        <div
          className="text-3xl font-bold font-inter tracking-tight"
          style={{ color: '#F7F8FA', fontVariantNumeric: 'tabular-nums' }}
        >
          {shown ? (
            <AnimatedCounter to={numericVal} suffix={suffix} duration={1.5} />
          ) : (
            value
          )}
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 text-[11px] font-medium"
            style={{ color: trendUp ? '#3CCB91' : '#E36D6D' }}
          >
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

function EventDrawer({
  event,
  onClose,
}: {
  event: AdminEvent | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!event) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [event, onClose]);

  if (!event) return null;
  const registrationPct = pct(event.registered, event.capacity);

  return (
    <>
      <div className="admin-drawer-overlay" onClick={onClose} />
      <aside
        className="admin-drawer"
        role="dialog"
        aria-modal
        aria-label={`Event details: ${event.title}`}
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, #0D172A)' }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#AAB6C7' }}
            aria-label="Close drawer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <CategoryPill category={event.category} />
              <StatusBadge status={event.status} />
            </div>
            <h2 className="admin-heading text-2xl mb-1">{event.title}</h2>
            <p className="text-sm" style={{ color: '#AAB6C7' }}>
              Organized by <span style={{ color: '#F7F8FA', fontWeight: 500 }}>{event.organizer}</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#68778C' }}>
              Created by {event.createdBy}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <CalendarDays size={14} />, label: 'Date', value: event.date },
              { icon: <Clock size={14} />, label: 'Time', value: `${event.startTime} – ${event.endTime}` },
              { icon: <MapPin size={14} />, label: 'Venue', value: event.venue },
              { icon: <Users size={14} />, label: 'Capacity', value: `${event.capacity} participants` },
            ].map(item => (
              <div
                key={item.label}
                className="p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-1.5 mb-1" style={{ color: '#68778C' }}>
                  {item.icon}
                  <span className="admin-eyebrow" style={{ color: '#68778C' }}>{item.label}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: '#F7F8FA' }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Eyebrow>Registration</Eyebrow>
              <span className="text-sm font-semibold" style={{ color: '#F7F8FA' }}>
                {event.registered} / {event.capacity}
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${registrationPct}%`,
                  background: registrationPct >= 90 ? '#E36D6D' : registrationPct >= 75 ? '#E6A84B' : '#3CCB91',
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <Eyebrow>Attendance</Eyebrow>
              <p className="text-2xl font-bold mt-1" style={{ color: '#3CCB91' }}>
                {pct(event.attended, event.registered)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: '#68778C' }}>Checked In</p>
              <p className="text-xl font-bold" style={{ color: '#F7F8FA' }}>{event.attended}</p>
            </div>
          </div>

          <div>
            <Eyebrow>About This Event</Eyebrow>
            <BlueDivider />
            <p className="text-sm leading-relaxed" style={{ color: '#AAB6C7' }}>{event.description}</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              style={{ background: '#3B82F6', color: '#fff' }}
            >
              <Users size={15} />
              View Participants
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const filteredEvents = ADMIN_EVENTS.filter(ev => {
    const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'All' || ev.category === filterCategory;
    const matchStatus = filterStatus === 'All' || ev.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const navItems = ['Overview', 'Events', 'Students', 'Organizers', 'Registrations', 'Reports'];

  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="admin-page">
      {/* ═══════════════════════════════════════════════════════════════════════
          FLOATING GLASS CAPSULE HEADER — Matches exact design from reference image
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 w-full pt-3 px-4 sm:px-8 bg-[#070D18]/90 backdrop-blur-md pb-2">
        <div className="max-w-7xl mx-auto rounded-full border border-blue-500/20 bg-[#0B1528]/85 backdrop-blur-md shadow-2xl px-6 py-2.5 flex items-center justify-between gap-6">

          {/* Left: Round Blue Logo & College Title */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => setActiveNav('Overview')}>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <GraduationCap size={19} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-xs sm:text-sm font-bold tracking-tight text-white font-poppins">
                KSR College of Engineering
              </p>
              <p className="text-[10px] text-slate-400">Tiruchengode</p>
            </div>
          </div>

          {/* Center: Navigation Tabs (NO Underline, Vibrant Blue on Hover/Active) */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Admin navigation">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`admin-nav-item ${activeNav === item ? 'active' : ''}`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right: Rounded Outlined Button & User Menu */}
          <div className="flex items-center gap-3 ml-auto lg:ml-0 flex-shrink-0">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Search"
            >
              <Search size={15} />
            </button>

            <button
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(p => !p)}
                className="px-4 py-1.5 rounded-full border border-blue-500/40 text-xs font-semibold text-white hover:bg-blue-600/20 transition-all flex items-center gap-2"
              >
                <User size={13} className="text-blue-400" />
                <span>SIGN OUT</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl py-2 shadow-2xl bg-[#0D172A] border border-slate-700/80 z-60 text-white"
                >
                  <div className="px-4 py-2 border-b border-slate-700/60 text-xs">
                    <p className="font-semibold text-white">Administrator</p>
                    <p className="text-[10px] text-slate-400">admin@ksrce.ac.in</p>
                  </div>
                  <button
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => setProfileMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* SECONDARY BREADCRUMB STRIP */}
      <div
        className="w-full"
        style={{ background: '#0D172A', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="admin-container">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#68778C' }}>
              <span style={{ letterSpacing: '0.08em', fontWeight: 600 }}>ADMINISTRATION</span>
              <ChevronRight size={12} />
              <span style={{ letterSpacing: '0.08em', fontWeight: 600 }}>EVENT MANAGEMENT</span>
              <ChevronRight size={12} />
              <span style={{ letterSpacing: '0.08em', fontWeight: 600, color: '#3B82F6' }}>{activeNav.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#68778C' }}>
              <CalendarDays size={12} />
              <span>May 20 – May 26, 2024</span>
            </div>
          </div>
        </div>
      </div>

      <main>
        {/* ═══════════════════════════════════════════════════════════════════════
            DYNAMIC TAB SECTION RENDERING
        ═══════════════════════════════════════════════════════════════════════ */}

        {/* TAB 1: OVERVIEW */}
        {activeNav === 'Overview' && (
          <>
            {/* HERO SECTION */}
            <section
              className="w-full"
              style={{
                background: 'radial-gradient(ellipse at 60% 0%, rgba(59,130,246,0.12) 0%, transparent 60%), #070D18',
                paddingTop: '3.5rem',
                paddingBottom: '3.5rem',
              }}
            >
              <div className="admin-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <Eyebrow>
                      <ShinyText text="Administration • 2024" speed={4} />
                    </Eyebrow>
                    <h1 className="admin-heading mt-3 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                      <SplitText text="Campus Event" className="block" />
                      <span style={{ color: '#3B82F6' }}>
                        <SplitText text="Command Center" delay={0.2} />
                      </span>
                    </h1>
                    <BlueDivider />
                    <p style={{ color: '#AAB6C7', fontSize: '0.9375rem', lineHeight: 1.75, maxWidth: '440px' }}>
                      A complete view of campus events, student participation, organizers and attendance — all in one authoritative system.
                    </p>
                    <div className="flex items-center gap-3 mt-8 flex-wrap">
                      <MagnetButton magnetStrength={0.25}>
                        <button
                          onClick={() => setActiveNav('Events')}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 shadow-lg shadow-blue-500/20"
                          style={{ background: '#3B82F6', color: '#fff' }}
                        >
                          <CalendarDays size={15} />
                          View Events
                          <ArrowUpRight size={13} />
                        </button>
                      </MagnetButton>
                    </div>
                  </div>

                  {/* Right: Live Campus Pulse visualization */}
                  <div className="relative flex items-center justify-center" style={{ minHeight: 300 }}>
                    {[220, 170, 120].map((size, i) => (
                      <div
                        key={size}
                        className="absolute rounded-full"
                        style={{
                          width: size,
                          height: size,
                          border: `1px solid rgba(59,130,246,${0.08 + i * 0.04})`,
                          animation: `ripple ${3 + i}s ease-out infinite`,
                          animationDelay: `${i * 0.5}s`,
                        }}
                      />
                    ))}

                    <div
                      className="relative z-10 rounded-2xl p-6 text-center"
                      style={{ background: '#0D172A', border: '1px solid rgba(255,255,255,0.1)', minWidth: 200 }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="live-dot" />
                        <span className="text-xs font-bold tracking-widest" style={{ color: '#3CCB91' }}>LIVE</span>
                      </div>
                      <p className="text-4xl font-bold font-inter mt-1" style={{ color: '#F7F8FA' }}>18</p>
                      <p className="text-xs mt-1" style={{ color: '#68778C' }}>Active Events</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* METRIC RAIL */}
            <section
              className="w-full"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="admin-container">
                <div className="grid grid-cols-2 md:grid-cols-6 divide-x" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {[
                    { icon: <CalendarDays size={14} />, value: '120', label: 'Total Events', trend: '+12.4% this month', trendUp: true, delay: 0 },
                    { icon: <Zap size={14} />, value: '18', label: 'Active', trend: '3 Live now', trendUp: true, delay: 80 },
                    { icon: <Users size={14} />, value: '4,820', label: 'Students', trend: '+320 this sem', trendUp: true, delay: 160 },
                    { icon: <Building2 size={14} />, value: '35', label: 'Organizers', trend: '+2 new', trendUp: true, delay: 240 },
                    { icon: <Ticket size={14} />, value: '4,812', label: 'Registrations', trend: '+18.7% this month', trendUp: true, delay: 320 },
                    { icon: <ShieldCheck size={14} />, value: '95%', label: 'Attendance', trend: '+3.2% vs last sem', trendUp: true, delay: 400 },
                  ].map(m => (
                    <div key={m.label} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <MetricItem {...m} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: EVENTS */}
        {(activeNav === 'Overview' || activeNav === 'Events') && (
          <section className="admin-container py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="admin-heading text-2xl lg:text-3xl">Campus Events</h2>
                <p className="text-xs text-slate-400 mt-1">Manage and monitor all active and upcoming campus events.</p>
              </div>

              {/* Controls & Search */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Symposium">Symposium</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Live">Live</option>
                  <option value="Open">Open</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <th>Event</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Venue</th>
                      <th>Registrations</th>
                      <th>Attendance</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map(event => {
                      const regPct = pct(event.registered, event.capacity);
                      const attPct = pct(event.attended, event.registered);
                      return (
                        <tr
                          key={event.id}
                          className="cursor-pointer"
                          style={{ transition: 'background 0.15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(59,130,246,0.06)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                                <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-medium" style={{ color: '#F7F8FA' }}>{event.title}</p>
                                <CategoryPill category={event.category} />
                              </div>
                            </div>
                          </td>
                          <td><p className="text-[13px]" style={{ color: '#AAB6C7' }}>{event.organizer}</p></td>
                          <td><p className="text-[13px]" style={{ color: '#AAB6C7' }}>{event.date}</p></td>
                          <td><p className="text-[13px]" style={{ color: '#AAB6C7' }}>{event.venue}</p></td>
                          <td>
                            <div className="w-24">
                              <MiniProgress value={regPct} />
                            </div>
                          </td>
                          <td><span className="text-sm font-bold" style={{ color: '#3CCB91' }}>{attPct}%</span></td>
                          <td><StatusBadge status={event.status} /></td>
                          <td>
                            <button
                              onClick={e => { e.stopPropagation(); setSelectedEvent(event); }}
                              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                              style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: STUDENTS */}
        {activeNav === 'Students' && (
          <section className="admin-container py-10">
            <div className="mb-6">
              <h2 className="admin-heading text-2xl lg:text-3xl">Student Directory</h2>
              <p className="text-xs text-slate-400 mt-1">Directory of registered students across all departments and events.</p>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#0D172A] border border-slate-800 shadow-xl">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr className="bg-slate-900/60">
                      <th>Student Name</th>
                      <th>Register Number</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>Email</th>
                      <th>Registered Events</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {[
                      { name: 'Sabari Christopher', roll: '73152413003', dept: 'CSE', year: 'III', email: 'sabari@ksrce.ac.in', events: 4, status: 'Active' },
                      { name: 'Priya Suresh', roll: '73152413022', dept: 'ECE', year: 'III', email: 'priya@ksrce.ac.in', events: 3, status: 'Active' },
                      { name: 'Abilash Kumar R', roll: '73152413008', dept: 'IT', year: 'II', email: 'abilash@ksrce.ac.in', events: 5, status: 'Active' },
                      { name: 'Karthik Murugan', roll: '73152413029', dept: 'EEE', year: 'IV', email: 'karthik@ksrce.ac.in', events: 2, status: 'Active' },
                      { name: 'Divya Bharathi', roll: '73152413014', dept: 'CSE', year: 'III', email: 'divya@ksrce.ac.in', events: 6, status: 'Active' },
                    ].map(st => (
                      <tr key={st.roll} className="hover:bg-blue-950/20">
                        <td className="font-semibold text-white">{st.name}</td>
                        <td className="font-mono text-slate-400">{st.roll}</td>
                        <td className="text-slate-300">{st.dept}</td>
                        <td className="text-slate-300">{st.year}</td>
                        <td className="text-slate-400">{st.email}</td>
                        <td className="font-bold text-blue-400">{st.events} Events</td>
                        <td>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {st.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: ORGANIZERS */}
        {activeNav === 'Organizers' && (
          <section className="admin-container py-10">
            <div className="mb-6">
              <h2 className="admin-heading text-2xl lg:text-3xl">Club & Event Organizers</h2>
              <p className="text-xs text-slate-400 mt-1">Institutional club coordinators and faculty organizers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ADMIN_ORGANIZERS.map(org => (
                <SpotlightCard key={org.id} spotlightColor="rgba(59, 130, 246, 0.15)" className="bg-[#0D172A] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl border font-bold flex items-center justify-center text-lg"
                      style={{ color: org.color, borderColor: `${org.color}40`, background: `${org.color}15` }}
                    >
                      {org.initials}
                    </div>
                    <div>
                      <h3 className="font-bold font-poppins text-white text-base leading-tight">{org.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{org.type}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex justify-between"><span className="text-slate-400">Total Events:</span> <span className="font-bold text-blue-400">{org.events}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Total Registrations:</span> <span className="font-bold text-white">{org.registrations}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Attendance Rate:</span> <span className="font-bold text-emerald-400">{org.attendanceRate}%</span></div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: REGISTRATIONS */}
        {activeNav === 'Registrations' && (
          <section className="admin-container py-10">
            <div className="mb-6">
              <h2 className="admin-heading text-2xl lg:text-3xl">All Registrations</h2>
              <p className="text-xs text-slate-400 mt-1">Live campus registration activity across all events.</p>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#0D172A] border border-slate-800 shadow-xl">
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr className="bg-slate-900/60">
                      <th>Student</th>
                      <th>Register No.</th>
                      <th>Event</th>
                      <th>Organizer</th>
                      <th>Ticket Code</th>
                      <th>Registered Date</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {ADMIN_REGISTRATIONS.map(reg => (
                      <tr key={reg.id} className="hover:bg-blue-950/20">
                        <td className="font-semibold text-white">{reg.student}</td>
                        <td className="font-mono text-slate-400">{reg.rollNumber}</td>
                        <td className="text-slate-200">{reg.event}</td>
                        <td className="text-slate-400">{reg.organizer}</td>
                        <td className="font-mono font-bold text-blue-400">{reg.ticketCode}</td>
                        <td className="text-slate-400">{reg.registeredOn}</td>
                        <td>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${reg.attended ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                            {reg.attended ? 'Attended' : 'Not Attended'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 6: REPORTS */}
        {activeNav === 'Reports' && (
          <section className="admin-container py-10 space-y-6">
            <div>
              <h2 className="admin-heading text-2xl lg:text-3xl">Administrative Reports</h2>
              <p className="text-xs text-slate-400 mt-1">Generate and download official reports for institutional audit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Campus Event Summary Report', desc: 'Complete overview of all events, attendance rates and organizer stats.', format: 'PDF / Excel' },
                { title: 'Student Participation Report', desc: 'Detailed log of student participation by department and year.', format: 'PDF / CSV' },
                { title: 'Organizer Performance Audit', desc: 'Analysis of event capacity vs attendance by club.', format: 'PDF' },
              ].map(rep => (
                <SpotlightCard key={rep.title} spotlightColor="rgba(59, 130, 246, 0.15)" className="bg-[#0D172A] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <FileText size={24} className="text-blue-400" />
                    <h3 className="font-bold font-poppins text-white text-base">{rep.title}</h3>
                    <p className="text-xs text-slate-400">{rep.desc}</p>
                  </div>
                  <button className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                    <Download size={14} /> Download Report ({rep.format})
                  </button>
                </SpotlightCard>
              ))}
            </div>
          </section>
        )}
      </main>

      <EventDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
