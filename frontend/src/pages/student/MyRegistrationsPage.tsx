import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, Calendar, MapPin, ArrowRight, Tag,
  CheckCircle2, QrCode
} from 'lucide-react';
import { getMyRegistrations } from '@/services/registrationService';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import type { Registration } from '@/types';
import { formatEventDateRange } from '@/utils/dateFormatter';
import { EventRowSkeleton } from '@/components/ui/Skeleton';
import { StudentQRScannerModal } from '@/components/scanner/StudentQRScannerModal';

export function MyRegistrationsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  // Scanner modal state
  const [activeScanReg, setActiveScanReg] = useState<Registration | null>(null);

  const loadRegistrations = () => {
    if (!user) return;
    setLoading(true);
    getMyRegistrations(user.id)
      .then(setRegistrations)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRegistrations();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <Header />

      <main className="container-main py-8 flex-1 space-y-6">
        {/* Page header */}
        <div className="pb-2 border-b border-[#1E2D52]">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
            My Registered Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {profile?.full_name && `Welcome, ${profile.full_name.split(' ')[0]}! `}
            Access your event passes and scan venue QR codes for attendance.
          </p>
        </div>

        {/* Student ID card */}
        {user?.student_id && (
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-4 flex items-center gap-4 max-w-sm shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[11px] text-blue-300 font-semibold uppercase tracking-wider">
                Campus Student Roll Number
              </p>
              <p className="text-base font-mono font-extrabold text-white">
                {user.student_id}
              </p>
            </div>
          </div>
        )}

        {/* Registrations list */}
        <div className="bg-[#111C3A] rounded-2xl border border-[#1E2D52] shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E2D52] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket size={18} className="text-blue-400" />
              <h2 className="text-sm font-bold text-white">Active Bookings</h2>
            </div>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {registrations.length} {registrations.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map(i => <EventRowSkeleton key={i} />)}
            </div>
          ) : registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Ticket size={28} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No Registrations Found</h3>
              <p className="text-xs text-slate-400 mb-5 max-w-xs leading-relaxed">
                You haven't registered for any campus events yet. Explore upcoming technical fests and workshops!
              </p>
              <Button
                variant="primary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                onClick={() => navigate('/')}
              >
                Explore Events
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#1E2D52]/60">
              {registrations.map(reg => {
                const event = reg.event;
                return (
                  <article
                    key={reg.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#0B1329] border border-[#1E2D52] flex items-center justify-center flex-shrink-0 text-blue-400">
                        <Ticket size={20} />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white truncate max-w-sm">
                            {event?.title ?? 'College Event'}
                          </h3>
                          {event?.category && (
                            <CategoryBadge category={event.category} />
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                          {event?.event_start && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-blue-400" />
                              {formatEventDateRange(event.event_start, event.event_end)}
                            </span>
                          )}
                          {event?.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-blue-400" />
                              {event.venue}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-mono font-bold text-blue-400">
                          Pass Code: {reg.ticket_code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      {reg.status === 'attended' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                          <CheckCircle2 size={13} />
                          Attended
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500/30 text-xs font-semibold"
                          leftIcon={<QrCode size={14} />}
                          onClick={() => setActiveScanReg(reg)}
                        >
                          Scan Attendance
                        </Button>
                      )}

                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                        rightIcon={<ArrowRight size={13} />}
                        onClick={() => navigate(`/ticket/${reg.id}`)}
                      >
                        View Ticket
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ─── Scanner Modal ─── */}
      {activeScanReg && activeScanReg.event && (
        <StudentQRScannerModal
          isOpen={Boolean(activeScanReg)}
          onClose={() => setActiveScanReg(null)}
          registration={activeScanReg}
          event={activeScanReg.event}
          onAttendanceSuccess={loadRegistrations}
        />
      )}

      <Footer />
    </div>
  );
}
