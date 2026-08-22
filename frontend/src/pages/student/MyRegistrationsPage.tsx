import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ArrowRight, Tag } from 'lucide-react';
import { getMyRegistrations } from '@/services/registrationService';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import type { Registration } from '@/types';
import { formatEventDateRange } from '@/utils/dateFormatter';
import { EventRowSkeleton } from '@/components/ui/Skeleton';

const STATUS_COLORS = {
  registered: 'text-blue-700 bg-blue-50 border-blue-200',
  attended: 'text-green-700 bg-green-50 border-green-200',
  cancelled: 'text-slate-500 bg-slate-100 border-slate-200',
};

export function MyRegistrationsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyRegistrations(user.id)
      .then(setRegistrations)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="container-main py-8 flex-1">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-poppins text-navy">My Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">
            {profile?.full_name && `Welcome back, ${profile.full_name.split(' ')[0]}! `}
            All your event registrations in one place.
          </p>
        </div>

        {/* Student ID card */}
        {user?.student_id && (
          <div className="mb-6 bg-navy rounded-xl p-4 flex items-center gap-4 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Tag size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-200 font-semibold uppercase tracking-wide">
                Campus Student ID
              </p>
              <p className="text-lg font-bold font-poppins text-white">
                {user.student_id}
              </p>
            </div>
          </div>
        )}

        {/* Registrations list */}
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Ticket size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-navy">Registered Events</h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
              {registrations.length}
            </span>
          </div>

          {loading ? (
            <div role="status" aria-label="Loading registrations">
              {[1, 2, 3].map(i => <EventRowSkeleton key={i} />)}
            </div>
          ) : registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Ticket size={28} className="text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-navy mb-1">No registrations yet</h3>
              <p className="text-sm text-slate-500 mb-4">
                You haven't registered for any events. Start exploring!
              </p>
              <Button variant="primary" size="sm" onClick={() => navigate('/')}>
                Browse Events
              </Button>
            </div>
          ) : (
            registrations.map(reg => {
              const event = reg.event;
              return (
                <article
                  key={reg.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0
                             hover:bg-blue-50/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Ticket size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">
                      {event?.title ?? 'Event'}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {event?.category && (
                        <CategoryBadge category={event.category} className="text-[10px]" />
                      )}
                      {event?.event_start && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar size={11} />
                          {formatEventDateRange(event.event_start, event.event_end)}
                        </span>
                      )}
                      {event?.venue && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={11} />
                          {event.venue}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">{reg.ticket_code}</p>
                  </div>
                  <span
                    className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border capitalize
                                ${STATUS_COLORS[reg.status]}`}
                  >
                    {reg.status}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<ArrowRight size={13} />}
                    onClick={() => navigate(`/ticket/${reg.id}`)}
                    aria-label={`View ticket for ${event?.title}`}
                  >
                    View Ticket
                  </Button>
                </article>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
