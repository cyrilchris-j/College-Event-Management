import { useEffect, useRef, useState } from 'react';
import {
  GraduationCap, Search, Bell, ChevronRight, CalendarDays,
  Users, Building2, Ticket, MapPin, Clock, ShieldCheck,
  TrendingUp, TrendingDown, X, ArrowUpRight, Zap, ChevronDown
} from 'lucide-react';
import './admin.css';
import { SplitText } from '@/components/reactbits/SplitText';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { AnimatedCounter } from '@/components/reactbits/AnimatedCounter';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { MagnetButton } from '@/components/reactbits/MagnetButton';
import {
  ADMIN_EVENTS,
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

// ─── Event Progress Bar ─────────────────────────────────────────────────────────
function MiniProgress({ value, color = '#315CFF' }: { value: number; color?: string }) {
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

// ─── Gold Divider ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="gold-divider" style={{ width: '48px', margin: '8px 0' }} />
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="admin-eyebrow">{children}</span>;
}

// ─── Metric Item (for rail) ─────────────────────────────────────────────────
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
      spotlightColor="rgba(200, 169, 107, 0.12)"
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

// ─── Event Drawer ─────────────────────────────────────────────────────────────
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
            style={{ background: 'linear-gradient(to bottom, transparent 40%, #0D1B2A)' }}
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
            <GoldDivider />
            <p className="text-sm leading-relaxed" style={{ color: '#AAB6C7' }}>{event.description}</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              style={{ background: '#315CFF', color: '#fff' }}
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

// ─── Main Admin Dashboard (Dark Luxury Theme) ─────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [searchQuery] = useState('');
  const [filterCategory] = useState('All');
  const [filterStatus] = useState('All');
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
          HEADER — Institutional horizontal navigation
      ═══════════════════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: 'rgba(13,27,42,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="admin-container">
          <div className="flex items-center gap-8 h-16">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#315CFF' }}
              >
                <GraduationCap size={18} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[13px] font-bold tracking-tight" style={{ color: '#F7F8FA', fontFamily: 'Inter, sans-serif' }}>
                  KSR COLLEGE OF ENGINEERING
                </p>
                <p className="text-[10px]" style={{ color: '#68778C' }}>Tiruchengode, Tamil Nadu</p>
              </div>
            </div>

            <div className="hidden md:block h-6 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

            <nav className="hidden md:flex items-center gap-7" aria-label="Admin navigation">
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

            <div className="flex items-center gap-3 ml-auto">
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#68778C' }}
                aria-label="Search"
              >
                <Search size={15} />
              </button>

              <button
                className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#68778C' }}
                aria-label="Notifications"
              >
                <Bell size={15} />
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#E36D6D' }}
                />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(p => !p)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: '#C8A96B', color: '#07111F' }}
                  >
                    A
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[12px] font-semibold leading-tight" style={{ color: '#F7F8FA' }}>Admin</p>
                    <p className="text-[10px]" style={{ color: '#68778C' }}>Administrator</p>
                  </div>
                  <ChevronDown size={12} style={{ color: '#68778C' }} />
                </button>

                {profileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl py-1 shadow-xl"
                    style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.08)', zIndex: 60 }}
                  >
                    <button
                      onClick={() => setProfileMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs transition-colors"
                      style={{ color: '#AAB6C7' }}
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => setProfileMenuOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs transition-colors"
                      style={{ color: '#E36D6D' }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECONDARY STRIP */}
      <div
        className="w-full"
        style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="admin-container">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#68778C' }}>
              <span style={{ letterSpacing: '0.08em', fontWeight: 600 }}>ADMINISTRATION</span>
              <ChevronRight size={12} />
              <span style={{ letterSpacing: '0.08em', fontWeight: 600 }}>EVENT MANAGEMENT</span>
              <ChevronRight size={12} />
              <span style={{ letterSpacing: '0.08em', fontWeight: 600, color: '#C8A96B' }}>{activeNav.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#68778C' }}>
              <CalendarDays size={12} />
              <span>May 20 – May 26, 2024</span>
            </div>
          </div>
        </div>
      </div>

      <main>
        {/* HERO SECTION */}
        <section
          className="w-full"
          style={{
            background: 'radial-gradient(ellipse at 60% 0%, rgba(49,92,255,0.08) 0%, transparent 60%), #07111F',
            paddingTop: '4rem',
            paddingBottom: '4rem',
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
                  <span style={{ color: '#C8A96B', fontStyle: 'italic' }}>
                    <SplitText text="Command Center" delay={0.2} />
                  </span>
                </h1>
                <div className="gold-divider" style={{ width: '60px', marginBottom: '1.25rem' }} />
                <p style={{ color: '#AAB6C7', fontSize: '0.9375rem', lineHeight: 1.75, maxWidth: '440px' }}>
                  A complete view of campus events, student participation, organizers and attendance — all in one authoritative system.
                </p>
                <div className="flex items-center gap-3 mt-8 flex-wrap">
                  <MagnetButton magnetStrength={0.25}>
                    <button
                      onClick={() => setActiveNav('Events')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 shadow-lg shadow-blue-500/20"
                      style={{ background: '#315CFF', color: '#fff' }}
                    >
                      <CalendarDays size={15} />
                      View Events
                      <ArrowUpRight size={13} />
                    </button>
                  </MagnetButton>
                </div>
              </div>

              {/* Right: Live Campus Pulse visualization */}
              <div className="relative flex items-center justify-center" style={{ minHeight: 320 }}>
                {[220, 170, 120].map((size, i) => (
                  <div
                    key={size}
                    className="absolute rounded-full"
                    style={{
                      width: size,
                      height: size,
                      border: `1px solid rgba(49,92,255,${0.06 + i * 0.04})`,
                      animation: `ripple ${3 + i}s ease-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}

                <div
                  className="relative z-10 rounded-2xl p-6 text-center"
                  style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', minWidth: 200 }}
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

        {/* CAMPUS EVENTS TABLE */}
        <section className="admin-container py-12">
          <div className="mb-8">
            <h2 className="admin-heading text-3xl">Campus Events</h2>
            <GoldDivider />
          </div>

          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
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
                        onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(49,92,255,0.04)'; }}
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
                            className="px-3 py-1.5 rounded-lg text-[12px] font-medium"
                            style={{ background: 'rgba(49,92,255,0.1)', color: '#315CFF', border: '1px solid rgba(49,92,255,0.2)' }}
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
      </main>

      <EventDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
