import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, AlertCircle, Search, Download,
  UserCheck, ShieldCheck
} from 'lucide-react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  getOrganizerEvents,
  getOrganizerRegistrations,
  markManualAttendance,
  exportRegistrationsToCSV,
  type OrganizerEventStats,
  type OrganizerStudentRegistration,
} from '@/services/organizerService';

export function OrganizerAttendancePage() {
  const [events, setEvents] = useState<OrganizerEventStats[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [registrations, setRegistrations] = useState<OrganizerStudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Check-in Input
  const [manualInput, setManualInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search in table
  const [searchTable, setSearchTable] = useState('');

  // Load events
  useEffect(() => {
    getOrganizerEvents().then(data => {
      setEvents(data);
      if (data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    });
  }, []);

  // Load registrations for selected event
  const loadAttendees = async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const data = await getOrganizerRegistrations(selectedEventId);
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendees();
  }, [selectedEventId]);

  // Handle Manual Check-in
  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setVerifying(true);
    setStatusMessage(null);

    const { success, message, error } = await markManualAttendance(
      selectedEventId,
      manualInput.trim()
    );

    setVerifying(false);

    if (success) {
      setStatusMessage({ type: 'success', text: message || 'Attendance Verified!' });
      setManualInput('');
      loadAttendees(); // refresh list
    } else {
      setStatusMessage({ type: 'error', text: error || 'Attendance check-in failed.' });
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const attendedList = registrations.filter(r => r.is_attended);
  const totalRegistered = registrations.length;
  const totalAttended = attendedList.length;
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

  // Filtered Table
  const filteredAttendees = attendedList.filter(r => {
    const q = searchTable.toLowerCase();
    return (
      r.student_name.toLowerCase().includes(q) ||
      r.roll_number.toLowerCase().includes(q) ||
      r.ticket_code.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  });

  const handleExportAttendance = () => {
    exportRegistrationsToCSV(attendedList, `Attendance_${selectedEvent?.title || 'Event'}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <OrganizerHeader />

      <main className="container-main py-8 flex-1 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2D52]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
              Event Attendance Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify participant entry, record check-in timestamps, and generate official attendance sheets.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
            leftIcon={<Download size={15} />}
            onClick={handleExportAttendance}
          >
            Export Attendance (CSV)
          </Button>
        </div>

        {/* Event Selector & Stats Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#111C3A] border border-[#1E2D52] rounded-3xl p-6 shadow-xl">
          {/* Left: Event Selection */}
          <div className="lg:col-span-6 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Event for Attendance
            </label>
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              {events.map(e => (
                <option key={e.id} value={e.id}>
                  {e.title} ({e.venue})
                </option>
              ))}
            </select>

            {selectedEvent && (
              <p className="text-xs text-slate-400">
                Venue: <span className="text-slate-300 font-semibold">{selectedEvent.venue}</span> • Capacity: <span className="text-slate-300 font-semibold">{selectedEvent.capacity} seats</span>
              </p>
            )}
          </div>

          {/* Right: Attendance Stats Ring / Numbers */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-3">
            <div className="bg-[#0B1329] rounded-2xl p-4 border border-[#1E2D52] text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Registered</span>
              <p className="text-xl sm:text-2xl font-extrabold text-white mt-1">{totalRegistered}</p>
            </div>

            <div className="bg-[#0B1329] rounded-2xl p-4 border border-[#1E2D52] text-center">
              <span className="text-[11px] font-bold text-green-400 uppercase">Checked In</span>
              <p className="text-xl sm:text-2xl font-extrabold text-green-400 mt-1">{totalAttended}</p>
            </div>

            <div className="bg-[#0B1329] rounded-2xl p-4 border border-[#1E2D52] text-center">
              <span className="text-[11px] font-bold text-blue-400 uppercase">Turnout</span>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-400 mt-1">{attendanceRate}%</p>
            </div>
          </div>
        </div>

        {/* ─── Manual Check-in Form Card ───────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-950/40 via-[#111C3A] to-indigo-950/40 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <UserCheck size={26} />
            </div>

            <h2 className="text-lg font-bold font-poppins text-white">
              Instant Attendee Check-In
            </h2>
            <p className="text-xs text-slate-300">
              Type the participant's <strong>Ticket Code</strong> (e.g. <code>CC-XXXX-XXXXXXXX</code>) or <strong>Roll Number</strong> to mark attendance.
            </p>

            <form onSubmit={handleManualCheckIn} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value.toUpperCase())}
                placeholder="Enter Ticket Code or Roll Number..."
                className="flex-1 h-12 px-4 rounded-xl bg-[#0B1329] border border-blue-500/40 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-center sm:text-left"
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={verifying}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 whitespace-nowrap"
                leftIcon={<ShieldCheck size={16} />}
              >
                Verify & Check In
              </Button>
            </form>

            {statusMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 animate-slide-in ${
                  statusMessage.type === 'success'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Live Checked-in Attendees Table ─────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-400" />
              Verified Attendees List ({attendedList.length})
            </h3>

            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTable}
                onChange={e => setSearchTable(e.target.value)}
                placeholder="Search checked-in students..."
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-[#111C3A] border border-[#1E2D52] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-[#111C3A] rounded-2xl border border-[#1E2D52] shadow-xl overflow-hidden">
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Loading attendee records...
              </div>
            ) : filteredAttendees.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No checked-in attendees recorded for this event yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B1329] border-b border-[#1E2D52] text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Ticket Code</th>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Roll Number</th>
                      <th className="py-3.5 px-4">Department</th>
                      <th className="py-3.5 px-4">Check-in Timestamp</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2D52]/60">
                    {filteredAttendees.map(att => (
                      <tr key={att.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{att.ticket_code}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{att.student_name}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">{att.roll_number}</td>
                        <td className="py-3.5 px-4 text-slate-300">{att.department} (Yr {att.year_of_study})</td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">
                          {att.checked_in_at ? new Date(att.checked_in_at).toLocaleTimeString() : 'Verified'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                            <CheckCircle2 size={12} /> Present
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
