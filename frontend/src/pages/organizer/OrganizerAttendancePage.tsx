import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download, Printer, CheckCircle2, XCircle, Search, ChevronDown, ShieldCheck, AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { MOCK_ORGANIZER_EVENTS, MOCK_STUDENT_REGISTRATIONS } from './organizerData';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function OrganizerAttendancePage() {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('event') ?? MOCK_ORGANIZER_EVENTS[0].id;

  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [activeTab, setActiveTab] = useState<'present' | 'absent'>('present');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [ticketInput, setTicketInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ status: 'valid' | 'already' | 'invalid'; studentName?: string; time?: string } | null>(null);

  const [presentCount, setPresentCount] = useState(98);
  const totalRegistered = 124;
  const absentCount = totalRegistered - presentCount;
  const attRate = Math.round((presentCount / totalRegistered) * 100);

  const currentEvent = MOCK_ORGANIZER_EVENTS.find(e => e.id === selectedEventId) ?? MOCK_ORGANIZER_EVENTS[0];
  const qrValue = `https://campusconnect.ksrce.ac.in/verify?event=${currentEvent.id}&code=AIW-2024-ATTENDANCE`;

  const presentStudents = MOCK_STUDENT_REGISTRATIONS.filter(s => s.attendanceStatus === 'Attended');
  const absentStudents = MOCK_STUDENT_REGISTRATIONS.filter(s => s.attendanceStatus === 'Not Attended');

  const listToDisplay = activeTab === 'present' ? presentStudents : absentStudents;

  const filteredStudents = listToDisplay.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ticketCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = ticketInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'CC-AIW-7X4P92') {
      setVerifyResult({ status: 'valid', studentName: 'Sabari Christopher' });
    } else if (cleanCode.includes('AIW')) {
      setVerifyResult({ status: 'already', studentName: 'Priya Suresh', time: '10:40 AM' });
    } else {
      setVerifyResult({ status: 'invalid' });
    }
  };

  const markPresent = () => {
    setPresentCount(prev => prev + 1);
    setVerifyResult(null);
    setTicketInput('');
    setVerifyDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <OrganizerHeader />

      <main className="flex-1 container-main py-8 space-y-8">
        {/* HEADER & TOP ACTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-poppins text-white">Attendance Verification</h1>
            <p className="text-xs lg:text-sm text-slate-400 mt-1">Verify registered participants and track live event check-ins.</p>
          </div>

          <button
            onClick={() => setVerifyDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-all self-start md:self-auto"
          >
            <ShieldCheck size={16} /> Verify Ticket Code
          </button>
        </div>

        {/* EVENT SELECTOR */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-5 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Select Event
          </label>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-sm font-semibold text-white bg-slate-800 border border-slate-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {MOCK_ORGANIZER_EVENTS.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} — {event.date} ({event.venue})
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* EVENT QR CODE & LIVE CHECK-IN STREAM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* QR Display Card (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col items-center text-center space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                EVENT ATTENDANCE QR
              </span>
              <h2 className="text-lg font-bold font-poppins text-white mt-2">{currentEvent.title}</h2>
              <p className="text-xs text-slate-400">{currentEvent.date} • {currentEvent.venue}</p>
            </div>

            {/* QR SVG */}
            <div className="bg-white p-4 rounded-2xl border-2 border-purple-500/40 shadow-xl flex flex-col items-center">
              <QRCodeSVG
                value={qrValue}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
                level="H"
              />
              <p className="text-xs font-mono font-bold text-slate-900 mt-3 tracking-widest">
                AIW-2024-ATTENDANCE
              </p>
            </div>

            <p className="text-xs text-slate-400 max-w-xs">
              Display this QR code at the event entrance for participant verification.
            </p>

            <div className="flex gap-3 w-full max-w-xs">
              <button className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <Download size={14} /> Download QR
              </button>
              <button className="flex-1 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                <Printer size={14} /> Print QR
              </button>
            </div>
          </div>

          {/* Live Check-in Feed & Summary (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE ATTENDANCE STREAM
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {presentCount} / {totalRegistered} Checked In
                </span>
              </div>

              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Recent Check-ins</p>
                {[
                  { time: '10:42 AM', name: 'Sabari Christopher', roll: '73152413003' },
                  { time: '10:40 AM', name: 'Priya Suresh', roll: '73152413022' },
                  { time: '10:38 AM', name: 'Abilash Kumar R', roll: '73152413008' },
                  { time: '10:35 AM', name: 'Karthik Murugan', roll: '73152413029' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">({item.roll})</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-center">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Registered</p>
                <p className="text-base font-bold text-white">{totalRegistered}</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-[10px] text-emerald-400 font-semibold uppercase">Present</p>
                <p className="text-base font-bold text-emerald-400">{presentCount}</p>
              </div>
              <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                <p className="text-[10px] text-rose-400 font-semibold uppercase">Absent</p>
                <p className="text-base font-bold text-rose-400">{absentCount}</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-[10px] text-purple-300 font-semibold uppercase">Rate</p>
                <p className="text-base font-bold text-purple-300">{attRate}%</p>
              </div>
            </div>
          </div>

        </div>

        {/* PRESENT / ABSENT PARTICIPANTS TABS */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg w-full md:w-auto border border-slate-700">
              <button
                onClick={() => setActiveTab('present')}
                className={`flex-1 md:flex-none px-5 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'present' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Present ({presentStudents.length})
              </button>
              <button
                onClick={() => setActiveTab('absent')}
                className={`flex-1 md:flex-none px-5 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'absent' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                Absent ({absentStudents.length})
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search student or ticket..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-4 py-3">Register Number</th>
                  <th className="px-4 py-3">Ticket Code</th>
                  <th className="px-4 py-3">{activeTab === 'present' ? 'Check-in Time' : 'Email'}</th>
                  <th className="px-4 py-3">{activeTab === 'present' ? 'Verified By' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-800/60">
                    <td className="px-6 py-3.5 font-semibold text-white">{student.studentName}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{student.rollNumber}</td>
                    <td className="px-4 py-3.5 font-mono text-purple-400 font-semibold">{student.ticketCode}</td>
                    <td className="px-4 py-3.5 text-slate-300">{activeTab === 'present' ? student.checkInTime : student.email}</td>
                    <td className="px-4 py-3.5">
                      {activeTab === 'present' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {student.verifiedBy}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          Not Checked In
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        isOpen={verifyDialogOpen}
        onClose={() => setVerifyDialogOpen(false)}
        title="Verify Ticket Code"
        size="sm"
      >
        <form onSubmit={handleVerifySubmit} className="space-y-4 text-white">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Enter Student Ticket Code</label>
            <input
              type="text"
              placeholder="e.g. CC-AIW-7X4P92"
              value={ticketInput}
              onChange={e => setTicketInput(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono font-bold text-white bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 uppercase"
              required
            />
          </div>

          {verifyResult?.status === 'valid' && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs space-y-2">
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> ✓ Valid Participant
              </p>
              <p className="text-white"><span className="font-semibold text-slate-400">Student:</span> {verifyResult.studentName}</p>
              <p className="text-slate-300"><span className="font-semibold text-slate-400">Event:</span> AI & Innovation Workshop</p>
              <button
                type="button"
                onClick={markPresent}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition-colors shadow-xs mt-1"
              >
                Mark Present & Check In
              </button>
            </div>
          )}

          {verifyResult?.status === 'already' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs space-y-1">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle size={16} /> ⚠ Already Checked In
              </p>
              <p className="text-slate-200">{verifyResult.studentName} checked in at {verifyResult.time}</p>
            </div>
          )}

          {verifyResult?.status === 'invalid' && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs space-y-1">
              <p className="font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle size={16} /> ✕ Invalid Ticket Code
              </p>
              <p className="text-rose-300">No active registration found for this code.</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setVerifyDialogOpen(false)}>Close</Button>
            <Button variant="primary" type="submit">Verify</Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
