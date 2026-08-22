import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft,
  AlertCircle, CheckCircle2, Ticket,
} from 'lucide-react';
import { getEventById } from '@/services/eventService';
import { checkRegistrationStatus } from '@/services/registrationService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { ToastContainer } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { RegistrationProgress } from '@/components/events/RegistrationProgress';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventDetailSkeleton } from '@/components/ui/Skeleton';
import { formatEventDateRange, formatTimeRange, getDeadlineLabel } from '@/utils/dateFormatter';
import { getEventThumbnail, getRegistrationStatus } from '@/utils/eventHelpers';
import type { Event, Registration } from '@/types';

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, removeToast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // ── Load event ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEventById(id)
      .then(data => {
        if (!data) { setNotFound(true); return; }
        setEvent(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Check existing registration ────────────────────────────────────────
  useEffect(() => {
    if (!id || !user) return;
    checkRegistrationStatus(id, user.id).then(setRegistration);
  }, [id, user]);

  const handleRegisterClick = useCallback(() => {
    if (registration) {
      navigate(`/ticket/${registration.id}`);
      return;
    }
    navigate(`/events/${id}/register`);
  }, [registration, id, navigate]);

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

  if (notFound || !event) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="container-main py-16 flex-1 flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-red-400 mb-4" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-navy mb-2">Event Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Events
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const status = getRegistrationStatus(event);
  const thumbnail = getEventThumbnail(event);
  const deadlineLabel = getDeadlineLabel(event.registration_deadline);
  const canRegister = status === 'open' || status === 'almost_full';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="container-main py-8 flex-1">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy
                     transition-colors mb-6 focus-visible:outline-2 focus-visible:outline-blue-500 rounded"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={16} />
          Back to Events
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main Detail Column ───────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Banner */}
            <div className="w-full h-52 lg:h-72 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={thumbnail}
                alt={`${event.title} event banner`}
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop';
                }}
              />
            </div>

            {/* Title row */}
            <div className="bg-white rounded-xl border border-border shadow-card p-6">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <CategoryBadge category={event.category} />
                {deadlineLabel && (
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200
                                   font-semibold px-2.5 py-1 rounded-full">
                    {deadlineLabel}
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold font-poppins text-navy leading-tight mb-3">
                {event.title}
              </h1>
              {event.organizer_name && (
                <p className="text-sm text-slate-500">
                  Organized by{' '}
                  <span className="font-medium text-navy">{event.organizer_name}</span>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-border shadow-card p-6">
              <h2 className="text-base font-semibold text-navy mb-3">About This Event</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Event details grid */}
            <div className="bg-white rounded-xl border border-border shadow-card p-6">
              <h2 className="text-base font-semibold text-navy mb-4">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Calendar size={16} className="text-blue-600" />,
                    label: 'Date',
                    value: formatEventDateRange(event.event_start, event.event_end),
                  },
                  {
                    icon: <Clock size={16} className="text-blue-600" />,
                    label: 'Time',
                    value: formatTimeRange(event.event_start, event.event_end),
                  },
                  {
                    icon: <MapPin size={16} className="text-blue-600" />,
                    label: 'Venue',
                    value: event.venue,
                  },
                  {
                    icon: <Users size={16} className="text-blue-600" />,
                    label: 'Capacity',
                    value: `${event.capacity.toLocaleString()} participants`,
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-border"
                  >
                    <span
                      className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-navy">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar: Registration Card ───────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-xl border border-border shadow-card p-5 sticky top-20">
              <h2 className="text-base font-semibold text-navy mb-4">Registration</h2>

              <RegistrationProgress event={event} showCount />

              <div className="mt-5">
                {registration ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 border
                                    border-green-200 rounded-lg px-3 py-2.5">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-semibold">You're Registered!</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="md"
                      leftIcon={<Ticket size={15} />}
                      className="w-full justify-center"
                      onClick={() => navigate(`/ticket/${registration.id}`)}
                    >
                      View My Ticket
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant={canRegister ? 'primary' : 'ghost'}
                    size="md"
                    className="w-full justify-center"
                    disabled={!canRegister}
                    onClick={handleRegisterClick}
                    aria-label={
                      !canRegister
                        ? 'Registration is closed or event is full'
                        : 'Register for this event'
                    }
                  >
                    {status === 'full'
                      ? '✗ Event Full'
                      : status === 'closed'
                      ? '— Registration Closed'
                      : 'Register Now'}
                  </Button>
                )}
              </div>

              {event.registration_deadline && (
                <p className="text-xs text-slate-400 text-center mt-3">
                  Deadline: {formatEventDateRange(event.registration_deadline)}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
