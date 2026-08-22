import { useState, useEffect, useMemo } from 'react';
import {
  Ticket, Search, Download, CheckCircle2, XCircle,
  Eye, Check, Copy, Filter, X
} from 'lucide-react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  getOrganizerRegistrations,
  getOrganizerEvents,
  verifyPaymentStatus,
  exportRegistrationsToCSV,
  type OrganizerStudentRegistration,
  type OrganizerEventStats,
} from '@/services/organizerService';

export function OrganizerRegistrationsPage() {
  const [registrations, setRegistrations] = useState<OrganizerStudentRegistration[]>([]);
  const [events, setEvents] = useState<OrganizerEventStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Payment proof modal
  const [previewProof, setPreviewProof] = useState<{ url: string; regId: string; studentName: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regsData, eventsData] = await Promise.all([
        getOrganizerRegistrations(selectedEventId),
        getOrganizerEvents(),
      ]);
      setRegistrations(regsData);
      setEvents(eventsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedEventId]);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => {
      const q = search.toLowerCase();
      const matchSearch =
        r.student_name.toLowerCase().includes(q) ||
        r.roll_number.toLowerCase().includes(q) ||
        r.ticket_code.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.event_title.toLowerCase().includes(q);

      return matchSearch;
    });
  }, [registrations, search]);

  // Handle Verify Payment
  const handleVerifyPayment = async (regId: string, status: 'verified' | 'rejected') => {
    const { success, error } = await verifyPaymentStatus(regId, status);
    if (success) {
      setRegistrations(prev =>
        prev.map(r => (r.id === regId ? { ...r, payment_status: status } : r))
      );
      if (previewProof?.regId === regId) {
        setPreviewProof(null);
      }
    } else {
      alert(`Error updating payment: ${error}`);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExport = () => {
    const eventName = selectedEventId !== 'all'
      ? events.find(e => e.id === selectedEventId)?.title || 'Registrations'
      : 'All_Registrations';
    exportRegistrationsToCSV(filteredRegistrations, eventName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <OrganizerHeader />

      <main className="container-main py-8 flex-1 space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2D52]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
              Student Registrations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time attendee list, Google Pay screenshot verification, and instant Excel export.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
            leftIcon={<Download size={15} />}
            onClick={handleExport}
          >
            Export to Excel (CSV)
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#111C3A] p-4 rounded-2xl border border-[#1E2D52]">
          <div className="sm:col-span-4 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search student, roll number, ticket..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <Filter size={15} className="text-slate-400 flex-shrink-0" />
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Events ({events.length})</option>
              {events.map(e => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end text-xs font-semibold text-slate-400">
            Total Attendees: <span className="text-white font-bold ml-1.5">{filteredRegistrations.length}</span>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-[#111C3A] rounded-2xl border border-[#1E2D52] shadow-xl overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <span className="text-xs">Fetching registrations from Supabase...</span>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Ticket size={24} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">No Registrations Found</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                No students matched the selected event or search criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1329] border-b border-[#1E2D52] text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Ticket Code</th>
                    <th className="py-3.5 px-4">Student Details</th>
                    <th className="py-3.5 px-4">Department & Year</th>
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2D52]/60">
                  {filteredRegistrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      {/* Ticket Code */}
                      <td className="py-4 px-4 font-mono font-bold text-blue-400">
                        <div className="flex items-center gap-1.5">
                          <span>{reg.ticket_code}</span>
                          <button
                            onClick={() => handleCopy(reg.ticket_code)}
                            title="Copy Ticket Code"
                            className="p-1 hover:text-white text-slate-400"
                          >
                            {copiedCode === reg.ticket_code ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-white">{reg.student_name}</p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {reg.roll_number} • {reg.phone}
                        </p>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4">
                        <p className="text-slate-300 truncate max-w-[180px]">{reg.department}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Year {reg.year_of_study}</p>
                      </td>

                      {/* Event Title */}
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-300 line-clamp-1 max-w-[180px]">{reg.event_title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(reg.registered_at).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        {reg.payment_mode === 'free' || !reg.payment_proof_url ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                            Free Entry
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {reg.payment_status === 'verified' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                Verified
                              </span>
                            ) : reg.payment_status === 'rejected' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Proof Pending
                              </span>
                            )}

                            {/* View Screenshot Trigger */}
                            <button
                              onClick={() => setPreviewProof({ url: reg.payment_proof_url!, regId: reg.id, studentName: reg.student_name })}
                              className="p-1.5 rounded-lg bg-[#0B1329] border border-[#1E2D52] hover:border-blue-500 text-blue-400 hover:text-white"
                              title="View Payment Proof Screenshot"
                            >
                              <Eye size={13} />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className="py-4 px-4">
                        {reg.is_attended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            <CheckCircle2 size={12} />
                            Attended
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Not Checked-in</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ─── Payment Proof Screenshot Preview Modal ──────────────────────── */}
        {previewProof && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-slide-in relative">
              <button
                onClick={() => setPreviewProof(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-bold font-poppins text-white mb-1">
                Payment Proof Screenshot
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Submitted by <strong>{previewProof.studentName}</strong>
              </p>

              <div className="max-h-[380px] w-full bg-slate-900 rounded-2xl overflow-hidden border border-[#1E2D52] flex items-center justify-center mb-6">
                <img
                  src={previewProof.url}
                  alt="Payment screenshot"
                  className="max-h-[380px] w-full object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                  leftIcon={<XCircle size={14} />}
                  onClick={() => handleVerifyPayment(previewProof.regId, 'rejected')}
                >
                  Reject Proof
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-green-600 hover:bg-green-500 text-white shadow-lg"
                  leftIcon={<CheckCircle2 size={14} />}
                  onClick={() => handleVerifyPayment(previewProof.regId, 'verified')}
                >
                  Approve Payment
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
