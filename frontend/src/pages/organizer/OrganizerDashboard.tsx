import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Plus, Users, CheckCircle2, DollarSign,
  ArrowRight, Search, Download, QrCode, Edit3, Trash2, MapPin, X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { formatEventDateRange } from '@/utils/dateFormatter';
import {
  getOrganizerEvents,
  deleteOrganizerEvent,
  downloadQRCodeAsImage,
  exportRegistrationsToCSV,
  getOrganizerRegistrations,
  type OrganizerEventStats,
} from '@/services/organizerService';
import { useAuth } from '@/hooks/useAuth';

export function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState<OrganizerEventStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // QR Modal State
  const [qrModalEvent, setQrModalEvent] = useState<OrganizerEventStats | null>(null);

  // Load events
  const loadData = () => {
    setLoading(true);
    getOrganizerEvents(user?.id)
      .then(setEvents)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Event Delete
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"? This cannot be undone.`)) {
      return;
    }
    const { success, error } = await deleteOrganizerEvent(id);
    if (success) {
      setEvents(prev => prev.filter(e => e.id !== id));
    } else {
      alert(`Error deleting event: ${error}`);
    }
  };

  // Filtered Events
  const filteredEvents = events.filter(e => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Calculate Metrics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((acc, e) => acc + (e.registered_count || 0), 0);
  const totalAttended = events.reduce((acc, e) => acc + (e.attended_count || 0), 0);
  const totalRevenue = events.reduce((acc, e) => acc + (e.total_revenue || 0), 0);

  // Quick Export
  const handleQuickExport = async () => {
    const allRegs = await getOrganizerRegistrations();
    exportRegistrationsToCSV(allRegs, 'All_Events_Registrations');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <OrganizerHeader />

      <main className="container-main py-8 flex-1 space-y-8">
        {/* ─── Hero Welcome & Quick Stats ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2D52]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your college events, monitor live student bookings, and verify attendance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#111C3A] hover:bg-[#1E2D52] text-white border-[#1E2D52]"
              leftIcon={<Download size={15} />}
              onClick={handleQuickExport}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
              leftIcon={<Plus size={15} />}
              onClick={() => navigate('/organizer/events/create')}
            >
              Create New Event
            </Button>
          </div>
        </div>

        {/* ─── Metric Cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Calendar size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">{totalEvents}</p>
            <p className="text-xs text-slate-400 mt-1">Active published & upcoming</p>
          </div>

          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registrations</span>
              <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">{totalRegistrations}</p>
            <p className="text-xs text-slate-400 mt-1">Total student bookings</p>
          </div>

          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attended</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">{totalAttended}</p>
            <p className="text-xs text-slate-400 mt-1">
              {totalRegistrations > 0 ? `${Math.round((totalAttended / totalRegistrations) * 100)}% attendance rate` : 'No attendees yet'}
            </p>
          </div>

          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">₹{totalRevenue}</p>
            <p className="text-xs text-slate-400 mt-1">Verified GPay & UPI fees</p>
          </div>
        </div>

        {/* ─── Search & Category Filters ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111C3A] p-4 rounded-2xl border border-[#1E2D52]">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by event title or venue..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#0B1329] text-slate-400 hover:text-white border border-[#1E2D52]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Events List ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-poppins text-white flex items-center gap-2">
              <Calendar size={18} className="text-blue-400" />
              Your Created Events ({filteredEvents.length})
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span className="text-xs">Loading organizer events from database...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-[#111C3A] rounded-2xl border border-[#1E2D52] p-12 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-4">
                <Calendar size={28} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No Events Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
                {search || selectedCategory !== 'All'
                  ? 'No events matched your current filters. Try changing your search query.'
                  : "You haven't created any events yet. Create your first college event to get started!"}
              </p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => navigate('/organizer/events/create')}
              >
                Create Event Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-[#111C3A] border border-[#1E2D52] hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-200"
                >
                  {/* Card Banner Image */}
                  <div className="relative h-40 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={event.banner_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&fit=crop'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <CategoryBadge category={event.category} />
                    </div>
                    {event.is_paid && (
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-amber-300">
                        ₹{event.entry_fee} Entry Fee
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold font-poppins text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {event.short_description || event.description}
                      </p>
                    </div>

                    {/* Metadata Details */}
                    <div className="space-y-1.5 text-xs text-slate-300 border-t border-[#1E2D52] pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-blue-400 flex-shrink-0" />
                        <span className="truncate">{formatEventDateRange(event.event_start, event.event_end)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-blue-400 flex-shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>

                    {/* Capacity & Attendance Stats */}
                    <div className="bg-[#0B1329] p-3 rounded-xl border border-[#1E2D52] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Registrations:</span>
                        <span className="font-bold text-white">
                          {event.registered_count} / {event.capacity}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(100, event.registration_percentage || 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1E2D52]">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setQrModalEvent(event)}
                          title="View Venue Check-in QR Code"
                          className="p-2 rounded-lg bg-[#0B1329] border border-[#1E2D52] hover:border-blue-500 text-blue-400 hover:text-white transition-colors"
                        >
                          <QrCode size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/organizer/events/${event.id}`)}
                          title="Edit Event"
                          className="p-2 rounded-lg bg-[#0B1329] border border-[#1E2D52] hover:border-blue-500 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          title="Delete Event"
                          className="p-2 rounded-lg bg-[#0B1329] border border-[#1E2D52] hover:border-red-500 text-red-400 hover:text-white transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500/30"
                        rightIcon={<ArrowRight size={13} />}
                        onClick={() => navigate(`/organizer/events/${event.id}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Check-in QR Code Modal ─────────────────────────────────────── */}
        {qrModalEvent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-slide-in text-center relative">
              <button
                onClick={() => setQrModalEvent(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <QrCode size={24} />
              </div>

              <h3 className="text-lg font-bold font-poppins text-white">
                Official Venue Check-In QR
              </h3>
              <p className="text-xs text-blue-300 font-semibold mt-0.5 line-clamp-1">
                {qrModalEvent.title}
              </p>
              <p className="text-xs text-slate-400 mt-1 mb-5">
                Display or print this QR at the venue entrance. Attendees can scan this code to mark attendance.
              </p>

              {/* QR Image Box */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mb-5">
                <QRCodeSVG
                  id={`qr-svg-${qrModalEvent.id}`}
                  value={JSON.stringify({
                    type: 'campusconnect_hall_checkin',
                    event_id: qrModalEvent.id,
                    event_title: qrModalEvent.title,
                    venue: qrModalEvent.venue,
                  })}
                  size={200}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#0B1329"
                />
              </div>

              {/* Download PNG Button */}
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg"
                leftIcon={<Download size={16} />}
                onClick={() => downloadQRCodeAsImage(`qr-svg-${qrModalEvent.id}`, qrModalEvent.title)}
              >
                Download QR Code as Image (PNG)
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
