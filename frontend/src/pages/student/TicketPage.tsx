import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Ticket, CheckCircle2, AlertCircle,
  Copy, Check, ShieldCheck, QrCode, Clock, Sparkles
} from 'lucide-react';
import { getRegistrationById } from '@/services/registrationService';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { EventDetailSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { formatEventDateRange } from '@/utils/dateFormatter';
import { StudentQRScannerModal } from '@/components/scanner/StudentQRScannerModal';
import type { Registration } from '@/types';

export function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const loadTicket = () => {
    if (!id) return;
    getRegistrationById(id)
      .then(reg => {
        if (!reg) { setError(true); return; }
        setRegistration(reg);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const handleCopyCode = () => {
    if (!registration?.ticket_code) return;
    navigator.clipboard.writeText(registration.ticket_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
        <Header />
        <main className="container-main py-8 flex-1">
          <EventDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
        <Header />
        <main className="container-main py-16 flex-1 flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Ticket Not Found</h1>
          <p className="text-sm text-slate-400 mb-6">
            This ticket doesn't exist or you don't have permission to view it.
          </p>
          <Button variant="primary" onClick={() => navigate('/my-registrations')}>
            My Registrations
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const event = registration.event;

  // Date Checks for Attendance
  const now = new Date();
  const eventStart = event?.event_start ? new Date(event.event_start) : null;
  const eventEnd = event?.event_end ? new Date(event.event_end) : eventStart ? new Date(eventStart.getTime() + 12 * 60 * 60 * 1000) : null;

  const isSameDate = eventStart
    ? now.getFullYear() === eventStart.getFullYear() &&
      now.getMonth() === eventStart.getMonth() &&
      now.getDate() === eventStart.getDate()
    : false;

  const isPastEvent = eventEnd ? now > eventEnd : false;
  const isUpcoming = eventStart && !isSameDate && now < eventStart;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <Header />

      <main className="container-main py-8 flex-1 flex justify-center">
        <div className="w-full max-w-md space-y-5">
          {/* Back */}
          <button
            onClick={() => navigate('/my-registrations')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to My Tickets
          </button>

          {/* ─── Digital Ticket Card ─── */}
          <div
            className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl overflow-hidden shadow-2xl"
            aria-label="Digital event ticket pass"
          >
            {/* Ticket header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ticket size={18} className="text-blue-400" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Official Student Pass
                  </span>
                </div>
                {registration.status === 'attended' ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                    <CheckCircle2 size={13} />
                    Attended
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                    <ShieldCheck size={13} />
                    Confirmed Pass
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white font-poppins leading-tight">
                {event?.title ?? 'Event'}
              </h2>

              {event?.category && (
                <div className="mt-2">
                  <CategoryBadge category={event.category} />
                </div>
              )}

              {/* Event info */}
              <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-[#1E2D52] pt-3">
                {event?.event_start && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-400" />
                    <span>{formatEventDateRange(event.event_start, event.event_end)}</span>
                  </div>
                )}
                {event?.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-400" />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Perforated divider */}
            <div className="relative h-6 overflow-hidden bg-[#111C3A]">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-[#1E2D52]" />
              </div>
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#0B1329]" />
              <div className="absolute -right-3 top-0 w-6 h-6 rounded-full bg-[#0B1329]" />
            </div>

            {/* Ticket Code Section */}
            <div className="px-6 pb-6 flex flex-col items-center gap-4">
              <div className="w-full bg-[#0B1329] border border-[#1E2D52] rounded-2xl p-4 text-center">
                <p className="text-[11px] text-blue-300 font-bold uppercase tracking-wider mb-1">
                  Unique Ticket Pass Code
                </p>
                <p className="font-mono text-2xl font-extrabold text-white tracking-widest my-1">
                  {registration.ticket_code}
                </p>

                <button
                  onClick={handleCopyCode}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors font-medium"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-green-400" />
                      <span className="text-green-300 font-semibold">Code Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Ticket Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Student Roll / ID */}
              {user?.student_id && (
                <div className="text-center">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
                    Student Roll Number
                  </p>
                  <p className="font-mono text-sm text-white font-bold mt-0.5">{user.student_id}</p>
                </div>
              )}

              {/* ─── Attendance Scanner Card ─── */}
              {registration.status === 'attended' ? (
                <div className="w-full p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    Attendance Verified
                  </div>
                  <p className="text-[11px] text-green-300/80">
                    Your attendance has been recorded for this event.
                  </p>
                </div>
              ) : (
                <div className="w-full bg-gradient-to-r from-blue-950/40 via-[#111C3A] to-indigo-950/40 border border-blue-500/30 rounded-2xl p-4 text-center space-y-3 shadow-lg">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-400">
                    <Sparkles size={14} />
                    Self Attendance Check-In
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    At the venue? Open your camera scanner and point it at the organizer's QR poster to mark attendance.
                  </p>

                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30"
                    leftIcon={<QrCode size={16} />}
                    onClick={() => setScannerOpen(true)}
                  >
                    Scan Venue QR Code
                  </Button>

                  {isUpcoming && (
                    <p className="text-[11px] text-amber-300 flex items-center justify-center gap-1">
                      <Clock size={12} />
                      Attendance opens on {eventStart?.toLocaleDateString()}
                    </p>
                  )}
                  {isPastEvent && (
                    <p className="text-[11px] text-red-400">
                      This event has ended.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details Action */}
          <Button
            variant="secondary"
            size="md"
            className="w-full justify-center bg-[#111C3A] text-white border-[#1E2D52] hover:bg-[#1E2D52]"
            onClick={() => navigate(`/events/${registration.event_id}`)}
          >
            View Event Details Page
          </Button>
        </div>
      </main>

      {/* ─── Scanner Modal ─── */}
      {event && (
        <StudentQRScannerModal
          isOpen={scannerOpen}
          onClose={() => setScannerOpen(false)}
          registration={registration}
          event={event}
          onAttendanceSuccess={loadTicket}
        />
      )}

      <Footer />
    </div>
  );
}
