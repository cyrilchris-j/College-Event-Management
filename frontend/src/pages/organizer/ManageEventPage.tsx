import { useNavigate, useParams } from 'react-router-dom';
import {
  Ticket, QrCode, FileText, Edit, ArrowLeft, ExternalLink
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { MOCK_ORGANIZER_EVENTS } from './organizerData';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { AnimatedCounter } from '@/components/reactbits/AnimatedCounter';

export function ManageEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = MOCK_ORGANIZER_EVENTS.find(e => e.id === id) ?? MOCK_ORGANIZER_EVENTS[0];
  const regPct = Math.round((event.registered / event.capacity) * 100);
  const attPct = Math.round((event.attended / event.registered) * 100);
  const remaining = event.capacity - event.registered;

  const trendData = [
    { day: 'Day 1', registered: 20, attended: 0 },
    { day: 'Day 2', registered: 45, attended: 0 },
    { day: 'Day 3', registered: 85, attended: 0 },
    { day: 'Day 4', registered: 124, attended: 98 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <OrganizerHeader />

      <main className="flex-1 container-main py-8 space-y-8">
        {/* Navigation back */}
        <button
          onClick={() => navigate('/organizer')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {/* 1. MANAGE EVENT HEADER */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {event.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {event.status}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-poppins text-white">{event.title}</h1>
            <p className="text-xs text-slate-400">Organized by {event.organizerClub} • Created by {event.createdBy}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/organizer/events/create')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Edit size={14} /> Edit Event
            </button>
            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ExternalLink size={14} /> View Public Page
            </button>
            <button
              onClick={() => navigate(`/organizer/reports?event=${event.id}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-md"
            >
              <FileText size={14} /> Generate Report
            </button>
          </div>
        </div>

        {/* 2. EVENT SUMMARY & PERFORMANCE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (7 cols): Event Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
              <img src={event.thumbnail} alt={event.title} className="w-full h-56 object-cover" />
              <div className="p-6 space-y-4">
                <h3 className="text-base font-bold font-poppins text-white">About This Event</h3>
                <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">{event.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Date</p>
                    <p className="font-semibold text-white mt-0.5">{event.date}</p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Time</p>
                    <p className="font-semibold text-white mt-0.5">{event.time}</p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Venue</p>
                    <p className="font-semibold text-white mt-0.5">{event.venue}</p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Capacity</p>
                    <p className="font-semibold text-white mt-0.5">{event.capacity} Max</p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Deadline</p>
                    <p className="font-semibold text-white mt-0.5">{event.deadline}</p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Contact</p>
                    <p className="font-semibold text-white mt-0.5">{event.contactPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Event Performance Metrics */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 space-y-5">
              <h3 className="text-base font-bold font-poppins text-white">Event Performance</h3>

              {/* Progress 1: Registered */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Registered</span>
                  <span className="text-purple-400">{event.registered} / {event.capacity} ({regPct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${regPct}%` }} />
                </div>
              </div>

              {/* Progress 2: Attendance */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Attendance</span>
                  <span className="text-emerald-400">{event.attended} / {event.registered} ({attPct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${attPct}%` }} />
                </div>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                  <p className="text-2xl font-bold font-poppins text-purple-300">
                    <AnimatedCounter to={attPct} suffix="%" />
                  </p>
                  <p className="text-[10px] font-semibold text-purple-400 uppercase mt-0.5">Attendance Rate</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-2xl font-bold font-poppins text-amber-300">
                    <AnimatedCounter to={remaining} />
                  </p>
                  <p className="text-[10px] font-semibold text-amber-400 uppercase mt-0.5">Remaining Seats</p>
                </div>
              </div>

              {/* Trend Chart */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-400 mb-2">Registration & Attendance Trend</p>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: 8, color: '#FFF' }} />
                      <Area type="monotone" dataKey="registered" stroke="#8B5CF6" fill="#8B5CF630" name="Registered" />
                      <Area type="monotone" dataKey="attended" stroke="#10B981" fill="#10B98130" name="Attended" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. EVENT QUICK ACTIONS CARDS */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-poppins text-white">Event Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'View Registrations',
                desc: 'Track every student who registered.',
                icon: <Ticket size={20} className="text-blue-400" />,
                action: 'Open',
                path: `/organizer/registrations?event=${event.id}`,
              },
              {
                title: 'Attendance',
                desc: 'Verify and track participants.',
                icon: <QrCode size={20} className="text-emerald-400" />,
                action: 'Open',
                path: `/organizer/attendance?event=${event.id}`,
              },
              {
                title: 'Generate Report',
                desc: 'Create event reports and export data.',
                icon: <FileText size={20} className="text-purple-400" />,
                action: 'Generate',
                path: `/organizer/reports?event=${event.id}`,
              },
              {
                title: 'Edit Event',
                desc: 'Update event details and schedule.',
                icon: <Edit size={20} className="text-amber-400" />,
                action: 'Edit',
                path: '/organizer/events/create',
              },
            ].map(card => (
              <SpotlightCard
                key={card.title}
                spotlightColor="rgba(124, 92, 252, 0.15)"
                className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-5 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <h4 className="font-bold text-white text-sm font-poppins">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
                <button
                  onClick={() => navigate(card.path)}
                  className="w-full py-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-colors"
                >
                  {card.action}
                </button>
              </SpotlightCard>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
