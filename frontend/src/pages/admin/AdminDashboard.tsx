import { useEffect, useRef, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  GraduationCap, Search, Bell, ChevronRight, CalendarDays,
  Users, Building2, Ticket, ClipboardList,
  FileText, Phone, Mail, MapPin, Clock, ShieldCheck,
  TrendingUp, TrendingDown, Eye, X, Download, Filter,
  AlertTriangle, CheckCircle2, ArrowUpRight,
  Zap, Moon, Sun, User as UserIcon, LogOut, Settings,
  ChevronDown, Star, BookOpen,
} from 'lucide-react';
import './admin.css';
import {
  ADMIN_EVENTS, ADMIN_ORGANIZERS, ADMIN_REGISTRATIONS,
  REGISTRATION_CHART_DATA, CATEGORY_CHART_DATA, ATTENDANCE_DATA,
  EVENT_STATUS_CONFIG, CATEGORY_COLORS,
  type AdminEvent, type AdminRegistration,
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

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShown(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
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
        {value}
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
        {/* Banner */}
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
          {/* Header */}
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

          {/* Details grid */}
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

          {/* Registration */}
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

          {/* Attendance */}
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

          {/* Description */}
          <div>
            <Eyebrow>About This Event</Eyebrow>
            <GoldDivider />
            <p className="text-sm leading-relaxed" style={{ color: '#AAB6C7' }}>{event.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
              style={{ background: '#315CFF', color: '#fff' }}
            >
              <Users size={15} />
              View Participants
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#AAB6C7', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ClipboardList size={14} />
                Attendance
              </button>
              <button
                className="py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#AAB6C7', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <FileText size={14} />
                Report
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Report Dialog ────────────────────────────────────────────────────────────
function ReportDialog({ type, onClose }: { type: string; onClose: () => void }) {
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'Excel'>('PDF');
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1600);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="admin-dialog-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-dialog">
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>Report Center</Eyebrow>
              <h3 className="admin-heading text-xl mt-1">Generate {type}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#68778C' }}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {!generated ? (
            <>
              <div>
                <label className="admin-eyebrow block mb-2">Event</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F7F8FA' }}
                >
                  <option>All Events</option>
                  {ADMIN_EVENTS.map(e => <option key={e.id}>{e.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-eyebrow block mb-2">From Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F7F8FA' }}
                  />
                </div>
                <div>
                  <label className="admin-eyebrow block mb-2">To Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F7F8FA' }}
                  />
                </div>
              </div>
              <div>
                <label className="admin-eyebrow block mb-2">Department</label>
                <select
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F7F8FA' }}
                >
                  <option>All Departments</option>
                  <option>Computer Science Engineering</option>
                  <option>Electronics & Communication</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                </select>
              </div>
              <div>
                <label className="admin-eyebrow block mb-2">Format</label>
                <div className="flex gap-2">
                  {(['PDF', 'CSV', 'Excel'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                      style={{
                        background: format === f ? '#315CFF' : 'rgba(255,255,255,0.06)',
                        color: format === f ? '#fff' : '#AAB6C7',
                        border: `1px solid ${format === f ? '#315CFF' : 'rgba(255,255,255,0.1)'}`,
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                style={{ background: '#315CFF', color: '#fff', opacity: generating ? 0.7 : 1 }}
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <FileText size={15} />
                    Generate Report
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(60,203,145,0.15)' }}>
                <CheckCircle2 size={26} style={{ color: '#3CCB91' }} />
              </div>
              <div>
                <p className="text-lg font-semibold" style={{ color: '#F7F8FA' }}>Report Ready</p>
                <p className="text-sm mt-1" style={{ color: '#68778C' }}>{type} — {format} format</p>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#AAB6C7', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Preview
                </button>
                <button
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  style={{ background: '#315CFF', color: '#fff' }}
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Student Drawer ───────────────────────────────────────────────────────────
function StudentDrawer({
  registration,
  onClose,
}: {
  registration: AdminRegistration | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!registration) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [registration, onClose]);

  if (!registration) return null;

  return (
    <>
      <div className="admin-drawer-overlay" onClick={onClose} />
      <aside
        className="admin-drawer"
        role="dialog"
        aria-modal
        aria-label={`Student profile: ${registration.student}`}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Eyebrow>Student Profile</Eyebrow>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#68778C' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold"
              style={{ background: '#315CFF', color: '#fff' }}
            >
              {registration.student.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="admin-heading text-lg leading-tight">{registration.student}</h3>
              <p className="text-sm mt-0.5" style={{ color: '#AAB6C7' }}>{registration.rollNumber}</p>
            </div>
          </div>

          {/* Contact/meta */}
          <div className="space-y-2">
            {[
              { icon: <BookOpen size={14} />, label: 'Department', value: 'Computer Science Engineering' },
              { icon: <Star size={14} />, label: 'Year', value: 'III Year' },
              { icon: <Mail size={14} />, label: 'Email', value: `${registration.rollNumber.toLowerCase()}@ksrce.ac.in` },
              { icon: <Phone size={14} />, label: 'Phone', value: '+91 98765 43210' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="mt-0.5" style={{ color: '#68778C' }}>{item.icon}</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#68778C' }}>{item.label}</p>
                  <p className="text-sm" style={{ color: '#F7F8FA' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Participation stats */}
          <div>
            <Eyebrow>Event Participation</Eyebrow>
            <GoldDivider />
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Registered', value: '8', color: '#315CFF' },
                { label: 'Attended', value: '6', color: '#3CCB91' },
                { label: 'Attendance', value: '75%', color: '#C8A96B' },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#68778C' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Event history */}
          <div>
            <Eyebrow>Recent Events</Eyebrow>
            <GoldDivider />
            <div className="space-y-2 mt-2">
              {[registration, ...(ADMIN_REGISTRATIONS.slice(0, 3))].slice(0, 4).map((reg, i) => (
                <div
                  key={`${reg.id}-${i}`}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F7F8FA' }}>{reg.event}</p>
                    <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#68778C' }}>{reg.ticketCode}</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      color: reg.attended ? '#3CCB91' : '#E36D6D',
                      background: reg.attended ? 'rgba(60,203,145,0.1)' : 'rgba(227,109,109,0.1)',
                    }}
                  >
                    {reg.attended ? 'Attended' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-sm shadow-xl"
      style={{ background: '#142338', border: '1px solid rgba(255,255,255,0.1)', color: '#F7F8FA' }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<AdminRegistration | null>(null);
  const [reportType, setReportType] = useState<string | null>(null);
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

  // Close profile menu on outside click
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
            {/* Logo + Branding */}
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

            {/* Separator */}
            <div className="hidden md:block h-6 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {/* Navigation */}
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

            {/* Right actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Search */}
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#68778C' }}
                aria-label="Search"
              >
                <Search size={15} />
              </button>

              {/* Notifications */}
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

              {/* Theme */}
              <button
                onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#68778C' }}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* Admin Avatar + Menu */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(p => !p)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  aria-label="Admin profile"
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
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
                    role="menu"
                  >
                    {[
                      { icon: <UserIcon size={14} />, label: 'My Profile' },
                      { icon: <Settings size={14} />, label: 'Settings' },
                    ].map(item => (
                      <button
                        key={item.label}
                        role="menuitem"
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: '#AAB6C7' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />
                    <button
                      role="menuitem"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: '#E36D6D' }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECONDARY NAVIGATION — Context strip with breadcrumb + date
      ═══════════════════════════════════════════════════════════════════════ */}
      <div
        className="w-full"
        style={{ background: '#0D1B2A', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="admin-container">
          <div className="flex items-center justify-between h-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#68778C' }}>
              <span style={{ letterSpacing: '0.08em', fontWeight: 600 }}>ADMINISTRATION</span>
              <ChevronRight size={12} />
              <span style={{ letterSpacing: '0.08em', fontWeight: 600 }}>EVENT MANAGEMENT</span>
              <ChevronRight size={12} />
              <span style={{ letterSpacing: '0.08em', fontWeight: 600, color: '#C8A96B' }}>{activeNav.toUpperCase()}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#68778C' }}>
              <CalendarDays size={12} />
              <span>May 20 – May 26, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main scroll area */}
      <main>
        {/* ═══════════════════════════════════════════════════════════════════
            HERO — Campus Command Center + Live Campus Pulse
        ═══════════════════════════════════════════════════════════════════ */}
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

              {/* Left: Editorial intro */}
              <div>
                <Eyebrow>Administration • 2024</Eyebrow>
                <h1 className="admin-heading mt-3 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                  Campus Event<br />
                  <span style={{ color: '#C8A96B', fontStyle: 'italic' }}>Command Center</span>
                </h1>
                <div className="gold-divider" style={{ width: '60px', marginBottom: '1.25rem' }} />
                <p style={{ color: '#AAB6C7', fontSize: '0.9375rem', lineHeight: 1.75, maxWidth: '440px' }}>
                  A complete view of campus events, student participation, organizers and attendance — all in one authoritative system.
                </p>
                <div className="flex items-center gap-3 mt-8 flex-wrap">
                  <button
                    onClick={() => setActiveNav('Events')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
                    style={{ background: '#315CFF', color: '#fff' }}
                  >
                    <CalendarDays size={15} />
                    View Events
                    <ArrowUpRight size={13} />
                  </button>
                  <button
                    onClick={() => setReportType('Full Report')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#AAB6C7', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <FileText size={15} />
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Right: Live Campus Pulse visualization */}
              <div className="relative flex items-center justify-center" style={{ minHeight: 320 }}>
                {/* Outer rings */}
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

                {/* Center pulse card */}
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

                {/* Satellite cards */}
                {[
                  { label: 'Registrations Today', value: '124', x: '-140px', y: '-60px', color: '#315CFF' },
                  { label: 'Checked In', value: '98', x: '130px', y: '-80px', color: '#3CCB91' },
                  { label: 'Organizers', value: '35', x: '-120px', y: '80px', color: '#8B7CFF' },
                  { label: 'Dept. Active', value: '6', x: '130px', y: '75px', color: '#C8A96B' },
                ].map(card => (
                  <div
                    key={card.label}
                    className="absolute text-center px-3 py-2 rounded-xl"
                    style={{
                      background: '#0D1B2A',
                      border: '1px solid rgba(255,255,255,0.08)',
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${card.x}), calc(-50% + ${card.y}))`,
                      minWidth: 90,
                    }}
                  >
                    <p className="text-lg font-bold" style={{ color: card.color }}>{card.value}</p>
                    <p className="text-[9px] leading-tight" style={{ color: '#68778C' }}>{card.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FEATURED LIVE EVENT
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="admin-container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Event visual — 3 cols */}
            <div
              className="lg:col-span-3 rounded-2xl overflow-hidden relative"
              style={{ minHeight: 280, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <img
                src={ADMIN_EVENTS[0].thumbnail}
                alt={ADMIN_EVENTS[0].title}
                className="w-full h-full object-cover"
                style={{ minHeight: 280 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(7,17,31,0.7) 0%, rgba(7,17,31,0.3) 100%)' }}
              />
              {/* Live badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <div className="live-dot" />
                <span
                  className="text-xs font-bold tracking-widest px-3 py-1 rounded-full"
                  style={{ background: 'rgba(60,203,145,0.15)', color: '#3CCB91', border: '1px solid rgba(60,203,145,0.25)' }}
                >
                  LIVE NOW
                </span>
              </div>
              {/* Title overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <CategoryPill category={ADMIN_EVENTS[0].category} />
                <h2 className="admin-heading text-2xl mt-2 text-white">{ADMIN_EVENTS[0].title}</h2>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <MapPin size={12} />{ADMIN_EVENTS[0].venue}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <Clock size={12} />{ADMIN_EVENTS[0].startTime} – {ADMIN_EVENTS[0].endTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Event details — 2 cols */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <Eyebrow>Featured Event</Eyebrow>
                <GoldDivider />
                <h3 className="admin-heading text-xl mt-2">{ADMIN_EVENTS[0].title}</h3>
                <p className="text-sm mt-2" style={{ color: '#AAB6C7', lineHeight: 1.7 }}>
                  {ADMIN_EVENTS[0].description}
                </p>
              </div>

              {/* Organizer */}
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: '#315CFF', color: '#fff' }}
                >
                  GD
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#F7F8FA' }}>{ADMIN_EVENTS[0].organizer}</p>
                  <p className="text-[11px]" style={{ color: '#68778C' }}>Created by {ADMIN_EVENTS[0].createdBy}</p>
                </div>
              </div>

              {/* Registration progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium" style={{ color: '#AAB6C7' }}>
                    {ADMIN_EVENTS[0].registered} / {ADMIN_EVENTS[0].capacity} registered
                  </span>
                  <span className="text-sm font-bold" style={{ color: '#C8A96B' }}>
                    {pct(ADMIN_EVENTS[0].registered, ADMIN_EVENTS[0].capacity)}%
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct(ADMIN_EVENTS[0].registered, ADMIN_EVENTS[0].capacity)}%`,
                      background: 'linear-gradient(90deg, #315CFF, #8B7CFF)',
                    }}
                  />
                </div>
              </div>

              {/* Attendance */}
              <div className="flex items-center gap-3 text-sm" style={{ color: '#AAB6C7' }}>
                <CheckCircle2 size={14} style={{ color: '#3CCB91' }} />
                <span>{ADMIN_EVENTS[0].attended} attended • {pct(ADMIN_EVENTS[0].attended, ADMIN_EVENTS[0].registered)}% attendance rate</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedEvent(ADMIN_EVENTS[0])}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  style={{ background: '#315CFF', color: '#fff' }}
                >
                  <Eye size={14} />
                  View Event
                </button>
                <button
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#AAB6C7', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Users size={14} />
                  Registrations
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            METRIC RAIL
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="w-full"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="admin-container">
            <div className="grid grid-cols-3 md:grid-cols-6 divide-x" style={{ '--tw-divide-opacity': 1 } as any}>
              {[
                {
                  icon: <CalendarDays size={14} />,
                  value: '120',
                  label: 'Total Events',
                  trend: '+12.4% this month',
                  trendUp: true,
                  delay: 0,
                },
                {
                  icon: <Zap size={14} />,
                  value: '18',
                  label: 'Active',
                  trend: '3 Live now',
                  trendUp: true,
                  delay: 80,
                },
                {
                  icon: <Users size={14} />,
                  value: '4,820',
                  label: 'Students',
                  trend: '+320 this sem',
                  trendUp: true,
                  delay: 160,
                },
                {
                  icon: <Building2 size={14} />,
                  value: '35',
                  label: 'Organizers',
                  trend: '+2 new',
                  trendUp: true,
                  delay: 240,
                },
                {
                  icon: <Ticket size={14} />,
                  value: '4,812',
                  label: 'Registrations',
                  trend: '+18.7% this month',
                  trendUp: true,
                  delay: 320,
                },
                {
                  icon: <ShieldCheck size={14} />,
                  value: '95%',
                  label: 'Attendance',
                  trend: '+3.2% vs last sem',
                  trendUp: true,
                  delay: 400,
                },
              ].map(m => (
                <div
                  key={m.label}
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <MetricItem {...m} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CAMPUS EVENTS — Event Table
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="admin-container py-12">
          {/* Section header */}
          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h2 className="admin-heading text-3xl">Campus Events</h2>
              <GoldDivider />
              <p className="text-sm mt-2" style={{ color: '#68778C' }}>
                Everything happening across the institution.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: '#68778C' }}
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search events…"
                  className="pl-8 pr-3 py-2 text-sm rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#F7F8FA',
                    width: 200,
                  }}
                />
              </div>

              {/* Category filter */}
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#AAB6C7',
                }}
              >
                <option value="All">All Categories</option>
                {['Technical', 'Hackathon', 'Workshop', 'Seminar', 'Cultural', 'Exhibition'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#AAB6C7',
                }}
              >
                <option value="All">All Status</option>
                {['Live', 'Open', 'Almost Full', 'Full', 'Closed'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
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
                        className="relative cursor-pointer"
                        style={{ borderLeft: '2px solid transparent', transition: 'background 0.15s, border-color 0.15s' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(49,92,255,0.04)';
                          (e.currentTarget as HTMLTableRowElement).style.borderLeftColor = '#C8A96B';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                          (e.currentTarget as HTMLTableRowElement).style.borderLeftColor = 'transparent';
                        }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        {/* Event */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={event.thumbnail}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                style={{ transition: 'transform 0.3s' }}
                                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.1)'; }}
                                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium whitespace-nowrap" style={{ color: '#F7F8FA', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.title}
                              </p>
                              <CategoryPill category={event.category} />
                            </div>
                          </div>
                        </td>

                        {/* Organizer */}
                        <td>
                          <p className="text-[13px]" style={{ color: '#AAB6C7', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {event.organizer}
                          </p>
                        </td>

                        {/* Date */}
                        <td>
                          <p className="text-[13px] whitespace-nowrap" style={{ color: '#AAB6C7' }}>{event.date}</p>
                        </td>

                        {/* Venue */}
                        <td>
                          <p className="text-[13px] whitespace-nowrap" style={{ color: '#AAB6C7' }}>{event.venue}</p>
                        </td>

                        {/* Registrations */}
                        <td>
                          <div className="w-24">
                            <p className="text-[12px] mb-1" style={{ color: '#AAB6C7' }}>
                              {event.registered} / {event.capacity}
                            </p>
                            <MiniProgress
                              value={regPct}
                              color={regPct >= 90 ? '#E36D6D' : regPct >= 75 ? '#E6A84B' : '#315CFF'}
                            />
                          </div>
                        </td>

                        {/* Attendance */}
                        <td>
                          <span
                            className="text-sm font-bold"
                            style={{ color: attPct >= 85 ? '#3CCB91' : attPct >= 70 ? '#E6A84B' : '#E36D6D' }}
                          >
                            {attPct}%
                          </span>
                        </td>

                        {/* Status */}
                        <td><StatusBadge status={event.status} /></td>

                        {/* Action */}
                        <td>
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedEvent(event); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
                            style={{ background: 'rgba(49,92,255,0.1)', color: '#315CFF', border: '1px solid rgba(49,92,255,0.2)' }}
                          >
                            <Eye size={12} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredEvents.length === 0 && (
              <div className="py-16 text-center" style={{ color: '#68778C' }}>
                <Filter size={28} className="mx-auto mb-3" style={{ opacity: 0.4 }} />
                <p className="text-sm">No events match your filters.</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            ORGANIZER INSIGHTS
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="w-full py-12"
          style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="admin-container">
            <div className="mb-8">
              <Eyebrow>Organizational Intelligence</Eyebrow>
              <h2 className="admin-heading text-3xl mt-2">Who's Driving Campus Events?</h2>
              <GoldDivider />
            </div>

            <div className="space-y-3">
              {ADMIN_ORGANIZERS.map((org, i) => (
                <div
                  key={org.id}
                  className="flex items-center gap-5 px-5 py-4 rounded-xl transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  {/* Rank */}
                  <span
                    className="text-xs font-bold w-6 text-center flex-shrink-0"
                    style={{ color: i === 0 ? '#C8A96B' : '#68778C' }}
                  >
                    {i === 0 ? '★' : `0${i + 1}`}
                  </span>

                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: `${org.color}20`, color: org.color, border: `1px solid ${org.color}30` }}
                  >
                    {org.initials}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#F7F8FA' }}>{org.name}</p>
                    <p className="text-[11px]" style={{ color: '#68778C' }}>{org.type}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-8">
                    {[
                      { label: 'Events', value: org.events },
                      { label: 'Registrations', value: org.registrations.toLocaleString() },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-base font-bold" style={{ color: '#F7F8FA' }}>{s.value}</p>
                        <p className="text-[10px]" style={{ color: '#68778C' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Attendance rate */}
                  <div className="flex items-center gap-3 w-32">
                    <div className="flex-1">
                      <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${org.attendanceRate}%`, background: org.color }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: org.color }}>{org.attendanceRate}%</span>
                  </div>

                  <button
                    className="hidden sm:flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#68778C', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <ChevronRight size={12} />
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            ANALYTICS — Registration Activity + Category Donut + Attendance
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="admin-container py-12">
          <div className="mb-8">
            <Eyebrow>Data Intelligence</Eyebrow>
            <h2 className="admin-heading text-3xl mt-2">Student Participation</h2>
            <GoldDivider />
            <p className="text-sm mt-2" style={{ color: '#68778C' }}>
              4,820 students · 4,812 registrations · 3,980 unique participants · 95% attendance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            {/* Registration Activity Chart — 3 cols */}
            <div
              className="lg:col-span-3 rounded-xl p-5"
              style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Eyebrow>Registration Activity</Eyebrow>
              <p className="text-lg font-semibold mt-1 mb-5" style={{ color: '#F7F8FA' }}>
                Semester Registration Trend
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={REGISTRATION_CHART_DATA} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#315CFF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#315CFF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3CCB91" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3CCB91" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#68778C' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#68778C' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    name="Registrations"
                    stroke="#315CFF"
                    strokeWidth={2}
                    fill="url(#regGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#315CFF' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance"
                    stroke="#3CCB91"
                    strokeWidth={2}
                    fill="url(#attGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#3CCB91' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Donut — 2 cols */}
            <div
              className="lg:col-span-2 rounded-xl p-5"
              style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Eyebrow>Event Categories</Eyebrow>
              <p className="text-lg font-semibold mt-1 mb-2" style={{ color: '#F7F8FA' }}>Distribution</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={CATEGORY_CHART_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {CATEGORY_CHART_DATA.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [`${v}%`, 'Share']}
                    contentStyle={{ background: '#142338', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#F7F8FA' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {CATEGORY_CHART_DATA.map(cat => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="text-xs flex-1" style={{ color: '#AAB6C7' }}>{cat.name}</span>
                    <span className="text-xs font-semibold" style={{ color: '#F7F8FA' }}>{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attendance Performance */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Eyebrow>Attendance Performance</Eyebrow>
            <p className="text-lg font-semibold mt-1 mb-5" style={{ color: '#F7F8FA' }}>Event Comparison</p>
            <div className="space-y-3">
              {ATTENDANCE_DATA.map(item => (
                <div key={item.event} className="flex items-center gap-4">
                  <p className="text-sm w-40 flex-shrink-0" style={{ color: '#AAB6C7' }}>{item.event}</p>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.rate}%`, background: item.color }}
                    />
                  </div>
                  <span className="text-sm font-bold w-10 text-right" style={{ color: item.color }}>{item.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            REGISTRATION INTELLIGENCE
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="w-full py-12"
          style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="admin-container">
            <div className="mb-8">
              <Eyebrow>Intelligence Layer</Eyebrow>
              <h2 className="admin-heading text-3xl mt-2">Registration Intelligence</h2>
              <GoldDivider />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  eyebrow: 'Most Registered',
                  title: 'Campus Hackathon',
                  stat: '180 registrations',
                  icon: <Star size={18} />,
                  iconColor: '#C8A96B',
                  iconBg: 'rgba(200,169,107,0.1)',
                },
                {
                  eyebrow: 'Fastest Growing',
                  title: 'AI Workshop',
                  stat: '+32% this week',
                  icon: <TrendingUp size={18} />,
                  iconColor: '#3CCB91',
                  iconBg: 'rgba(60,203,145,0.1)',
                },
                {
                  eyebrow: 'Almost Full',
                  title: 'Web Dev Bootcamp',
                  stat: '85 / 100 registered',
                  icon: <AlertTriangle size={18} />,
                  iconColor: '#E6A84B',
                  iconBg: 'rgba(230,168,75,0.1)',
                },
                {
                  eyebrow: 'Highest Attendance',
                  title: 'Career Guidance',
                  stat: '92% attendance rate',
                  icon: <CheckCircle2 size={18} />,
                  iconColor: '#3CCB91',
                  iconBg: 'rgba(60,203,145,0.1)',
                },
              ].map(block => (
                <div
                  key={block.eyebrow}
                  className="p-5 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,169,107,0.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: block.iconBg, color: block.iconColor }}
                    >
                      {block.icon}
                    </div>
                    <Eyebrow>{block.eyebrow}</Eyebrow>
                  </div>
                  <p className="font-semibold" style={{ color: '#F7F8FA', fontSize: '0.9375rem' }}>{block.title}</p>
                  <p className="text-sm mt-1" style={{ color: block.iconColor }}>{block.stat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            RECENT REGISTRATIONS TABLE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="admin-container py-12">
          <div className="mb-8">
            <Eyebrow>Student Records</Eyebrow>
            <h2 className="admin-heading text-3xl mt-2">Recent Registrations</h2>
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
                    <th>Student</th>
                    <th>Reg. Number</th>
                    <th>Event</th>
                    <th>Organizer</th>
                    <th>Registered On</th>
                    <th>Ticket</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_REGISTRATIONS.map(reg => (
                    <tr
                      key={reg.id}
                      className="cursor-pointer"
                      style={{ borderLeft: '2px solid transparent', transition: 'background 0.15s, border-color 0.15s' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(49,92,255,0.04)';
                        (e.currentTarget as HTMLTableRowElement).style.borderLeftColor = '#8B7CFF';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
                        (e.currentTarget as HTMLTableRowElement).style.borderLeftColor = 'transparent';
                      }}
                      onClick={() => setSelectedRegistration(reg)}
                    >
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                            style={{ background: '#142338', color: '#8B7CFF' }}
                          >
                            {reg.student.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium" style={{ color: '#F7F8FA', whiteSpace: 'nowrap' }}>{reg.student}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-[12px] font-mono" style={{ color: '#68778C' }}>{reg.rollNumber}</span>
                      </td>
                      <td>
                        <span className="text-[13px]" style={{ color: '#AAB6C7', whiteSpace: 'nowrap' }}>{reg.event}</span>
                      </td>
                      <td>
                        <span className="text-[13px]" style={{ color: '#68778C' }}>{reg.organizer}</span>
                      </td>
                      <td>
                        <span className="text-[12px]" style={{ color: '#68778C', whiteSpace: 'nowrap' }}>{reg.registeredOn}</span>
                      </td>
                      <td>
                        <span className="text-[11px] font-mono" style={{ color: '#68778C' }}>{reg.ticketCode}</span>
                      </td>
                      <td>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: reg.attended ? '#3CCB91' : '#E36D6D',
                            background: reg.attended ? 'rgba(60,203,145,0.1)' : 'rgba(227,109,109,0.1)',
                          }}
                        >
                          {reg.attended ? 'Attended' : 'Absent'}
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: reg.status === 'Confirmed' ? '#3CCB91' : reg.status === 'Pending' ? '#E6A84B' : '#E36D6D',
                            background: reg.status === 'Confirmed' ? 'rgba(60,203,145,0.1)' : reg.status === 'Pending' ? 'rgba(230,168,75,0.1)' : 'rgba(227,109,109,0.1)',
                          }}
                        >
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            REPORT CENTER
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="w-full py-12"
          style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="admin-container">
            <div className="mb-8">
              <Eyebrow>Institutional Reporting</Eyebrow>
              <h2 className="admin-heading text-3xl mt-2">Report Center</h2>
              <GoldDivider />
              <p className="text-sm mt-2" style={{ color: '#68778C' }}>
                Generate institutional event reports in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Event Report', icon: <CalendarDays size={22} />, desc: 'Full overview of all events with capacity and status.', color: '#315CFF', bg: 'rgba(49,92,255,0.1)' },
                { title: 'Registration Report', icon: <Ticket size={22} />, desc: 'All student registrations by event and department.', color: '#8B7CFF', bg: 'rgba(139,124,255,0.1)' },
                { title: 'Attendance Report', icon: <ShieldCheck size={22} />, desc: 'Attendance rates, check-in records and analytics.', color: '#3CCB91', bg: 'rgba(60,203,145,0.1)' },
                { title: 'Organizer Report', icon: <Building2 size={22} />, desc: 'Organizer performance, events and participation.', color: '#C8A96B', bg: 'rgba(200,169,107,0.1)' },
              ].map(report => (
                <div
                  key={report.title}
                  className="p-5 rounded-xl flex flex-col gap-4 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: report.bg, color: report.color }}
                  >
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: '#F7F8FA' }}>{report.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: '#68778C' }}>{report.desc}</p>
                  </div>
                  <button
                    onClick={() => setReportType(report.title)}
                    className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2"
                    style={{ background: `${report.color}18`, color: report.color, border: `1px solid ${report.color}25` }}
                  >
                    <FileText size={13} />
                    Generate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            ATTENTION CENTER
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="admin-container py-10">
          <div className="mb-6">
            <Eyebrow>Action Required</Eyebrow>
            <h2 className="admin-heading text-2xl mt-2">Needs Attention</h2>
            <GoldDivider />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <AlertTriangle size={15} />, text: '3 events are almost full', color: '#E6A84B', action: 'Review' },
              { icon: <Clock size={15} />, text: '2 registration deadlines today', color: '#E36D6D', action: 'Check' },
              { icon: <UserIcon size={15} />, text: '5 organizer profiles incomplete', color: '#8B7CFF', action: 'Update' },
              { icon: <ShieldCheck size={15} />, text: '1 event requires review', color: '#315CFF', action: 'Review' },
            ].map(item => (
              <div
                key={item.text}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: `${item.color}08`, border: `1px solid ${item.color}18` }}
              >
                <span style={{ color: item.color, flexShrink: 0 }}>{item.icon}</span>
                <p className="text-sm flex-1" style={{ color: '#AAB6C7', lineHeight: 1.4 }}>{item.text}</p>
                <button
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg flex-shrink-0 transition-colors"
                  style={{ color: item.color, background: `${item.color}15` }}
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CONTACT / SUPPORT
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="w-full py-10"
          style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="admin-container">
            <div
              className="flex flex-col lg:flex-row items-start lg:items-center gap-8 px-8 py-8 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Gold line decoration */}
              <div
                className="hidden lg:block w-px self-stretch"
                style={{ background: 'linear-gradient(180deg, transparent 0%, #C8A96B 30%, #C8A96B 70%, transparent 100%)', minHeight: 80 }}
              />

              {/* Left: Headline */}
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#C8A96B' }}>Support</p>
                <h3 className="admin-heading text-2xl">Need assistance?</h3>
                <p className="text-sm mt-1" style={{ color: '#68778C' }}>
                  CampusConnect Administration Support
                </p>
                <button
                  className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{ background: 'rgba(200,169,107,0.12)', color: '#C8A96B', border: '1px solid rgba(200,169,107,0.25)' }}
                >
                  <Mail size={14} />
                  Contact Support
                </button>
              </div>

              {/* Right: Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
                {[
                  { icon: <Phone size={14} />, label: 'Phone', value: '+91 98765 43210' },
                  { icon: <Mail size={14} />, label: 'Email', value: 'campusconnect@ksrce.ac.in' },
                  { icon: <MapPin size={14} />, label: 'Office', value: 'KSR College, Tiruchengode – 637 215' },
                  { icon: <Clock size={14} />, label: 'Hours', value: 'Mon – Fri, 9:00 AM – 5:00 PM' },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#C8A96B' }}>{c.icon}</span>
                    <div>
                      <p className="admin-eyebrow" style={{ color: '#68778C' }}>{c.label}</p>
                      <p className="text-sm" style={{ color: '#AAB6C7' }}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer
        className="w-full py-8"
        style={{ background: '#07111F', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="admin-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#315CFF' }}
              >
                <GraduationCap size={14} className="text-white" />
              </div>
              <div>
                <p className="text-[12px] font-bold" style={{ color: '#AAB6C7' }}>KSR COLLEGE OF ENGINEERING</p>
                <p className="text-[10px]" style={{ color: '#68778C' }}>Campus Event Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              {['Privacy', 'Terms', 'Help Center'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="text-[12px] transition-colors"
                  style={{ color: '#68778C' }}
                  onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#AAB6C7'; }}
                  onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = '#68778C'; }}
                >
                  {link}
                </a>
              ))}
            </div>

            <p className="text-[11px]" style={{ color: '#68778C' }}>
              © 2024 KSR College of Engineering
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════
          OVERLAYS — Drawers + Dialog
      ═══════════════════════════════════════════════════════════════════ */}
      <EventDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <StudentDrawer
        registration={selectedRegistration}
        onClose={() => setSelectedRegistration(null)}
      />

      {reportType && (
        <ReportDialog
          type={reportType}
          onClose={() => setReportType(null)}
        />
      )}
    </div>
  );
}
