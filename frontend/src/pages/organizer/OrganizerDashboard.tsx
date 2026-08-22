import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Plus, FileText, QrCode, Ticket, ArrowRight,
  TrendingUp, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { MOCK_ORGANIZER_EVENTS, type OrganizerEvent } from './organizerData';
import { SplitText } from '@/components/reactbits/SplitText';
import { AnimatedCounter } from '@/components/reactbits/AnimatedCounter';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { MagnetButton } from '@/components/reactbits/MagnetButton';
import { ShinyText } from '@/components/reactbits/ShinyText';
import { TiltedCard } from '@/components/reactbits/TiltedCard';

const STATUS_BADGE_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  'Registration Open': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Almost Full': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Full': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  'Completed': { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
  'Draft': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
};

export function OrganizerDashboard() {
  const navigate = useNavigate();
  const [events] = useState<OrganizerEvent[]>(MOCK_ORGANIZER_EVENTS);

  const activeEvents = events.filter(e => e.status !== 'Completed');
  const completedEvents = events.filter(e => e.status === 'Completed');

  const chartData = [
    { name: 'Week 1', registered: 210, attended: 180 },
    { name: 'Week 2', registered: 450, attended: 390 },
    { name: 'Week 3', registered: 820, attended: 670 },
    { name: 'Week 4', registered: 1284, attended: 982 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <OrganizerHeader />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════════
            1. HERO SECTION — Dark Theme Welcome & Today's Event Card
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-900 border-b border-slate-800 py-10 lg:py-12 overflow-hidden relative">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container-main relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Left Column (7 cols): Welcome Text & CTA */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider">
                    <Zap size={13} />
                    <ShinyText text="EVENT ORGANIZER" speed={3} />
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-bold font-poppins text-white mt-3 leading-tight">
                    <SplitText text="Manage your campus events." delay={0.1} />
                  </h1>
                </div>

                <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-xl">
                  Create events, track registrations, verify attendance and generate reports from one unified workspace.
                </p>

                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  <MagnetButton magnetStrength={0.25}>
                    <button
                      onClick={() => navigate('/organizer/events/create')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all"
                    >
                      <Plus size={16} />
                      + Create Event
                    </button>
                  </MagnetButton>

                  <MagnetButton magnetStrength={0.25}>
                    <button
                      onClick={() => navigate('/organizer/reports')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm transition-all"
                    >
                      <FileText size={16} className="text-purple-400" />
                      View Reports
                    </button>
                  </MagnetButton>
                </div>
              </div>

              {/* Right Column (5 cols): Today's Event Visual Card */}
              <div className="lg:col-span-5">
                <TiltedCard maxTilt={8}>
                  <SpotlightCard
                    spotlightColor="rgba(124, 92, 252, 0.2)"
                    className="bg-slate-800/90 text-white rounded-2xl p-6 shadow-2xl border border-slate-700 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-purple-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        TODAY'S EVENT
                      </span>
                      <span className="text-xs text-slate-300 bg-slate-700/80 px-2.5 py-0.5 rounded-full border border-slate-600">
                        Main Auditorium
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-poppins text-white leading-tight mb-2">
                      AI & Innovation Workshop
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-300 mb-5">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-purple-400" /> 10:00 AM – 01:00 PM
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-purple-400" /> May 28, 2024
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5 bg-slate-900/60 rounded-xl p-3 border border-slate-700/60">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Registered</p>
                        <p className="text-lg font-bold text-white">124 <span className="text-xs text-slate-400 font-normal">/ 200</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-400 uppercase font-semibold">Checked In</p>
                        <p className="text-lg font-bold text-emerald-400">98 <span className="text-xs text-emerald-300/70 font-normal">(79%)</span></p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/organizer/events/org-evt-1')}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      Manage Event <ArrowRight size={14} />
                    </button>
                  </SpotlightCard>
                </TiltedCard>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            2. METRIC RAIL — 5 Clean Dark Theme Metrics
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-900 border-b border-slate-800 py-6">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {[
                { label: 'Your Events', val: 12, suffix: '', icon: <Calendar size={18} className="text-purple-400" /> },
                { label: 'Active Events', val: 3, suffix: '', icon: <Zap size={18} className="text-blue-400" /> },
                { label: 'Total Registrations', val: 1284, suffix: '', icon: <Ticket size={18} className="text-emerald-400" /> },
                { label: 'Total Attended', val: 982, suffix: '', icon: <CheckCircle2 size={18} className="text-purple-400" /> },
                { label: 'Attendance Rate', val: 76.5, suffix: '%', decimals: 1, icon: <TrendingUp size={18} className="text-amber-400" />, trend: '+12.4% this month' },
              ].map((m) => (
                <SpotlightCard
                  key={m.label}
                  spotlightColor="rgba(124, 92, 252, 0.15)"
                  className="p-4 sm:px-6 flex flex-col justify-between bg-slate-900"
                >
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                      {m.icon}
                      {m.label}
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold font-poppins text-white">
                      <AnimatedCounter to={m.val} suffix={m.suffix} decimals={m.decimals ?? 0} />
                    </p>
                  </div>
                  {m.trend && (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-2">
                      <TrendingUp size={12} /> {m.trend}
                    </span>
                  )}
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            3. CURRENT EVENTS SECTION (Active/Approaching)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="container-main py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold font-poppins text-white">Current Events</h2>
              <p className="text-xs lg:text-sm text-slate-400 mt-0.5">Events that are currently active or approaching their event date.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.slice(0, 3).map(event => {
              const cfg = STATUS_BADGE_CONFIG[event.status] ?? STATUS_BADGE_CONFIG['Registration Open'];
              const regPct = Math.round((event.registered / event.capacity) * 100);
              return (
                <SpotlightCard
                  key={event.id}
                  spotlightColor="rgba(124, 92, 252, 0.15)"
                  className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl transition-all flex flex-col overflow-hidden"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-800">
                    <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {event.status}
                    </span>
                    <span className="absolute bottom-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-950/80 text-white backdrop-blur-xs">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold font-poppins text-base text-white line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{event.shortDescription}</p>

                      <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-purple-400" /> {event.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-purple-400" /> {event.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-purple-400" /> {event.venue}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">{event.registered} / {event.capacity} Registered</span>
                        <span className="font-bold text-purple-400">{regPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${regPct}%` }} />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => navigate(`/organizer/events/${event.id}`)}
                          className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1"
                        >
                          Manage Event
                        </button>
                        <button
                          onClick={() => navigate(`/organizer/registrations?event=${event.id}`)}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
                        >
                          Registrations
                        </button>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            4. YOUR EVENTS LIST TABLE
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="container-main py-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-poppins text-white">Your Events</h2>
                <p className="text-xs text-slate-400">Comprehensive list of all campus events organized by your club.</p>
              </div>
              <button
                onClick={() => navigate('/organizer/events')}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <th className="px-6 py-3">Event</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Venue</th>
                    <th className="px-4 py-3">Registrations</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {events.map(event => {
                    const cfg = STATUS_BADGE_CONFIG[event.status] ?? STATUS_BADGE_CONFIG['Registration Open'];
                    return (
                      <tr key={event.id} className="hover:bg-purple-950/20 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <img src={event.thumbnail} alt={event.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-white leading-tight">{event.title}</p>
                              <p className="text-xs text-slate-400">{event.organizerClub}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-300 font-medium">{event.category}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-300">{event.date}</td>
                        <td className="px-4 py-3.5 text-xs text-slate-300">{event.venue}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-white">{event.registered} / {event.capacity}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-emerald-400">{event.attended} ({Math.round((event.attended / event.registered) * 100)}%)</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => navigate(`/organizer/events/${event.id}`)}
                            className="px-3 py-1.5 rounded bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 text-xs font-semibold border border-purple-500/30 transition-colors"
                          >
                            Manage
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

        {/* ═══════════════════════════════════════════════════════════════════
            5. REGISTRATION OVERVIEW CHART & QUICK ACTIONS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="container-main py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Recharts Registration Trend (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold font-poppins text-white">Registration & Attendance Trend</h3>
                  <p className="text-xs text-slate-400">Monthly conversion rate overview</p>
                </div>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-500/30">
                  This Month
                </span>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="regGradDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="attGradDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: 8, color: '#FFF' }} />
                    <Area type="monotone" dataKey="registered" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#regGradDark)" name="Registered" />
                    <Area type="monotone" dataKey="attended" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#attGradDark)" name="Attended" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Quick Actions Grid (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold font-poppins text-white">Quick Actions</h3>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { label: 'Create New Event', icon: <Plus size={16} />, path: '/organizer/events/create', color: 'text-purple-400 bg-purple-500/15' },
                  { label: 'View Registrations', icon: <Ticket size={16} />, path: '/organizer/registrations', color: 'text-blue-400 bg-blue-500/15' },
                  { label: 'Verify Attendance', icon: <QrCode size={16} />, path: '/organizer/attendance', color: 'text-emerald-400 bg-emerald-500/15' },
                  { label: 'Generate Reports', icon: <FileText size={16} />, path: '/organizer/reports', color: 'text-amber-400 bg-amber-500/15' },
                ].map(action => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-purple-500/40 hover:bg-slate-800 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${action.color}`}>
                        {action.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">{action.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-purple-400" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            6. EVENT HISTORY (Completed Events)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="container-main py-6 pb-12">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6">
            <h3 className="text-base font-bold font-poppins text-white mb-4">Event History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Registrations</th>
                    <th className="px-4 py-3">Attendance</th>
                    <th className="px-4 py-3">Attendance Rate</th>
                    <th className="px-4 py-3">Report Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {completedEvents.map(event => (
                    <tr key={event.id} className="hover:bg-slate-800/60">
                      <td className="px-4 py-3 font-semibold text-white">{event.title}</td>
                      <td className="px-4 py-3 text-slate-400">{event.date}</td>
                      <td className="px-4 py-3 text-slate-300">{event.registered}</td>
                      <td className="px-4 py-3 text-slate-300">{event.attended}</td>
                      <td className="px-4 py-3 font-bold text-emerald-400">{Math.round((event.attended / event.registered) * 100)}%</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Report Ready
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate('/organizer/reports')}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
