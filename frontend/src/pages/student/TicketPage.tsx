import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getRegistrationById } from '@/services/registrationService';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { EventDetailSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { formatEventDateRange } from '@/utils/dateFormatter';
import type { Registration } from '@/types';

export function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRegistrationById(id)
      .then(reg => {
        if (!reg) { setError(true); return; }
        setRegistration(reg);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
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
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="container-main py-16 flex-1 flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <h1 className="text-xl font-semibold text-navy mb-2">Ticket Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">
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
  const qrPayload = JSON.stringify({
    ticket_code: registration.ticket_code,
    event_id: registration.event_id,
    student_id: registration.student_id,
    registered_at: registration.registered_at,
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="container-main py-8 flex-1 flex justify-center">
        <div className="w-full max-w-md space-y-4">
          {/* Back */}
          <button
            onClick={() => navigate('/my-registrations')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy transition-colors
                       focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
          >
            <ArrowLeft size={16} />
            My Tickets
          </button>

          {/* Digital Ticket Card */}
          <div
            className="bg-navy rounded-2xl overflow-hidden shadow-xl"
            aria-label="Digital event ticket"
          >
            {/* Ticket header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Ticket size={18} className="text-blue-300" />
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wide">
                    Event Pass
                  </span>
                </div>
                {registration.status === 'attended' ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400
                                   bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={12} />
                    Attended
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-blue-300 bg-blue-300/10
                                   border border-blue-300/20 px-2.5 py-1 rounded-full">
                    Valid
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white font-poppins leading-tight">
                {event?.title ?? 'Event'}
              </h2>

              {event?.category && (
                <CategoryBadge
                  category={event.category}
                  className="mt-2"
                />
              )}

              {/* Dashed divider */}
              <div className="mt-4 border-t border-dashed border-white/20" />

              {/* Event info */}
              <div className="mt-4 space-y-2">
                {event?.event_start && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-300" />
                    <span className="text-sm text-white/80">
                      {formatEventDateRange(event.event_start, event.event_end)}
                    </span>
                  </div>
                )}
                {event?.venue && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-300" />
                    <span className="text-sm text-white/80">{event.venue}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Perforated middle */}
            <div className="relative h-6 overflow-hidden">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-white/20" />
              </div>
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-background" />
              <div className="absolute -right-3 top-0 w-6 h-6 rounded-full bg-background" />
            </div>

            {/* QR section */}
            <div className="px-6 pb-6 flex flex-col items-center gap-4">
              <div className="bg-white p-3 rounded-xl">
                <QRCodeSVG
                  value={qrPayload}
                  size={160}
                  bgColor="#FFFFFF"
                  fgColor="#132B5C"
                  level="H"
                  aria-label="Registration QR code for venue check-in"
                />
              </div>

              <div className="text-center">
                <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide mb-1">
                  Ticket Code
                </p>
                <p className="font-mono text-lg font-bold text-white tracking-widest">
                  {registration.ticket_code}
                </p>
              </div>

              {user?.student_id && (
                <div className="text-center">
                  <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide mb-0.5">
                    Student ID
                  </p>
                  <p className="font-mono text-sm text-white/80">{user.student_id}</p>
                </div>
              )}

              <p className="text-xs text-white/40 text-center">
                Scan at the venue entrance to check in
              </p>
            </div>
          </div>

          {/* Actions */}
          <Button
            variant="secondary"
            size="md"
            className="w-full justify-center"
            onClick={() => navigate(`/events/${registration.event_id}`)}
          >
            View Event Details
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
