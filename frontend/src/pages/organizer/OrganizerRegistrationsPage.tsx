import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, CheckCircle2, XCircle, ChevronDown, Mail, Phone, BookOpen, X
} from 'lucide-react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { MOCK_ORGANIZER_EVENTS, MOCK_STUDENT_REGISTRATIONS, type StudentRegistration } from './organizerData';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';

export function OrganizerRegistrationsPage() {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('event') ?? MOCK_ORGANIZER_EVENTS[0].id;

  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [attendanceFilter, setAttendanceFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);

  const currentEvent = MOCK_ORGANIZER_EVENTS.find(e => e.id === selectedEventId) ?? MOCK_ORGANIZER_EVENTS[0];

  const filteredRegistrations = MOCK_STUDENT_REGISTRATIONS.filter(reg => {
    const matchSearch = reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = deptFilter === 'All' || reg.department === deptFilter;
    const matchAtt = attendanceFilter === 'All' || reg.attendanceStatus === attendanceFilter;
    return matchSearch && matchDept && matchAtt;
  });

  const totalRegistered = currentEvent.registered;
  const totalAttended = currentEvent.attended;
  const totalNotAttended = totalRegistered - totalAttended;
  const attRate = Math.round((totalAttended / totalRegistered) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <OrganizerHeader />

      <main className="flex-1 container-main py-8 space-y-6">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-poppins text-white">Registrations</h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">View and manage students registered for your campus events.</p>
        </div>

        {/* EVENT SELECTOR COMBOBOX */}
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
                  {event.title} ({event.date}) — {event.registered} registered
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* REGISTRATION METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SpotlightCard spotlightColor="rgba(124, 92, 252, 0.15)" className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium">Total Registered</p>
            <p className="text-2xl font-bold font-poppins text-white mt-1">{totalRegistered}</p>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.15)" className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-emerald-400 font-medium">Attended</p>
            <p className="text-2xl font-bold font-poppins text-emerald-400 mt-1">{totalAttended}</p>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(239, 68, 68, 0.15)" className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-rose-400 font-medium">Not Attended</p>
            <p className="text-2xl font-bold font-poppins text-rose-400 mt-1">{totalNotAttended}</p>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.15)" className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-amber-400 font-medium">Attendance Rate</p>
            <p className="text-2xl font-bold font-poppins text-amber-400 mt-1">{attRate}%</p>
          </SpotlightCard>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search student or ticket code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="IT">IT</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
            </select>

            <select
              value={attendanceFilter}
              onChange={e => setAttendanceFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Attendance</option>
              <option value="Attended">Attended</option>
              <option value="Not Attended">Not Attended</option>
            </select>
          </div>
        </div>

        {/* STUDENT REGISTRATION TABLE */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-4 py-3">Register Number</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Registered On</th>
                  <th className="px-4 py-3">Ticket Code</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-white">{reg.studentName}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{reg.rollNumber}</td>
                    <td className="px-4 py-3.5 text-slate-300">{reg.department}</td>
                    <td className="px-4 py-3.5 text-slate-300">{reg.year}</td>
                    <td className="px-4 py-3.5 text-slate-400">{reg.email}</td>
                    <td className="px-4 py-3.5 text-slate-400">{reg.registeredOn}</td>
                    <td className="px-4 py-3.5 font-mono text-purple-400 font-semibold">
                      <DecryptedText text={reg.ticketCode} speed={30} animateOnHover />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${reg.attendanceStatus === 'Attended' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {reg.attendanceStatus === 'Attended' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {reg.attendanceStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {reg.registrationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedStudent(reg)}
                        className="px-3 py-1.5 rounded bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 font-semibold transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* STUDENT DETAIL DRAWER */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setSelectedStudent(null)} />
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl p-6 overflow-y-auto space-y-6 animate-fade-up z-10 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold font-poppins text-white">Student Detail Profile</h2>
              <button onClick={() => setSelectedStudent(null)} className="p-1 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-base">
                {selectedStudent.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{selectedStudent.studentName}</h3>
                <p className="text-xs font-mono text-purple-400 font-medium">{selectedStudent.rollNumber}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300"><BookOpen size={14} className="text-purple-400" /> <span className="font-semibold text-white">Department:</span> {selectedStudent.department} ({selectedStudent.year})</div>
              <div className="flex items-center gap-2 text-slate-300"><Mail size={14} className="text-purple-400" /> <span className="font-semibold text-white">Email:</span> {selectedStudent.email}</div>
              <div className="flex items-center gap-2 text-slate-300"><Phone size={14} className="text-purple-400" /> <span className="font-semibold text-white">Phone:</span> {selectedStudent.phone}</div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">EVENT REGISTRATION</h4>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Event:</span> <span className="font-semibold text-white">{currentEvent.title}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Ticket Code:</span> <span className="font-mono font-bold text-purple-400">{selectedStudent.ticketCode}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Registered On:</span> <span className="font-medium text-white">{selectedStudent.registeredOn}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Attendance:</span> <span className="font-bold text-emerald-400">{selectedStudent.attendanceStatus} {selectedStudent.checkInTime && `(${selectedStudent.checkInTime})`}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
