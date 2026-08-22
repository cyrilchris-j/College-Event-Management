import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText, Download, Printer, CheckCircle2, ChevronDown, Sparkles
} from 'lucide-react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { MOCK_ORGANIZER_EVENTS, MOCK_REPORT_HISTORY, MOCK_STUDENT_REGISTRATIONS, type GeneratedReport } from './organizerData';

export function OrganizerReportsPage() {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('event') ?? 'all';

  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [reportType, setReportType] = useState('Attendance Report');
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'Excel'>('PDF');
  const [deptFilter, setDeptFilter] = useState('All');

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [history, setHistory] = useState<GeneratedReport[]>(MOCK_REPORT_HISTORY);

  const selectedEvent = selectedEventId === 'all'
    ? MOCK_ORGANIZER_EVENTS[0]
    : MOCK_ORGANIZER_EVENTS.find(e => e.id === selectedEventId) ?? MOCK_ORGANIZER_EVENTS[0];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);

      const newRep: GeneratedReport = {
        id: `rep-${Date.now()}`,
        title: reportType,
        eventTitle: selectedEventId === 'all' ? 'All Events' : selectedEvent.title,
        generatedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        generatedBy: 'Dr. Sarah Johnson',
        format,
        status: 'Ready',
      };
      setHistory(prev => [newRep, ...prev]);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <OrganizerHeader />

      <main className="flex-1 container-main py-8 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-poppins text-white">Reports & History</h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">Generate, review and download official event reports for KSR College administration.</p>
        </div>

        {/* REPORT GENERATOR BUILDER PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (5 cols): Generator Controls */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-5">
            <h2 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <FileText size={18} className="text-purple-400" /> Report Configuration
            </h2>

            {/* 1. SELECT EVENT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">1. Select Event</label>
              <div className="relative">
                <select
                  value={selectedEventId}
                  onChange={e => { setSelectedEventId(e.target.value); setGenerated(false); }}
                  className="w-full pl-3 pr-8 py-2.5 text-xs font-semibold text-white bg-slate-800 border border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="all">All Events (Summary)</option>
                  {MOCK_ORGANIZER_EVENTS.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* 2. REPORT TYPE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">2. Report Type</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Attendance Report',
                  'Event Summary',
                  'Registration Report',
                  'Student Participation Report',
                ].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setReportType(type); setGenerated(false); }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all border ${reportType === type ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. FILTERS */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">3. Optional Filters</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={deptFilter}
                  onChange={e => setDeptFilter(e.target.value)}
                  className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="All">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                </select>
                <select className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200">
                  <option value="All">All Years</option>
                  <option value="3">3rd Year</option>
                </select>
              </div>
            </div>

            {/* 4. FORMAT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">4. Export Format</label>
              <div className="flex gap-2">
                {(['PDF', 'CSV', 'Excel'] as const).map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${format === fmt ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* GENERATE ACTION */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 mt-4"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating report...
                </>
              ) : (
                <>
                  <Sparkles size={15} /> Generate Report
                </>
              )}
            </button>
          </div>

          {/* Right Column (7 cols): Live Report Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest bg-purple-500/20 px-2.5 py-0.5 rounded border border-purple-500/30">
                    REPORT PREVIEW
                  </span>
                  <h3 className="text-xl font-bold font-poppins text-white mt-1">{reportType}</h3>
                </div>

                {generated && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 animate-fade-up">
                    <CheckCircle2 size={14} /> ✓ Report Ready
                  </span>
                )}
              </div>

              {/* REPORT DOCUMENT HEADER PREVIEW */}
              <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-700 pb-2 font-poppins">
                  <span className="font-bold text-white uppercase">KSR COLLEGE OF ENGINEERING</span>
                  <span className="text-slate-400">Tiruchengode – 637 215</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div><span className="font-semibold text-slate-400">Event:</span> {selectedEventId === 'all' ? 'All Campus Events' : selectedEvent.title}</div>
                  <div><span className="font-semibold text-slate-400">Date:</span> {selectedEvent.date}</div>
                  <div><span className="font-semibold text-slate-400">Venue:</span> {selectedEvent.venue}</div>
                  <div><span className="font-semibold text-slate-400">Organizer:</span> {selectedEvent.organizerClub}</div>
                </div>
              </div>

              {/* STATS PREVIEW */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-[10px] text-purple-300 font-semibold uppercase">Registered</p>
                  <p className="text-base font-bold text-purple-300">{selectedEvent.registered}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase">Attended</p>
                  <p className="text-base font-bold text-emerald-400">{selectedEvent.attended}</p>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">
                  <p className="text-[10px] text-rose-400 font-semibold uppercase">Absent</p>
                  <p className="text-base font-bold text-rose-400">{selectedEvent.registered - selectedEvent.attended}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-[10px] text-amber-400 font-semibold uppercase">Rate</p>
                  <p className="text-base font-bold text-amber-400">{Math.round((selectedEvent.attended / selectedEvent.registered) * 100)}%</p>
                </div>
              </div>

              {/* PARTICIPANT TABLE PREVIEW */}
              <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">Reg. No.</th>
                      <th className="p-2.5">Ticket</th>
                      <th className="p-2.5">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {MOCK_STUDENT_REGISTRATIONS.slice(0, 3).map(s => (
                      <tr key={s.id}>
                        <td className="p-2.5 font-medium text-white">{s.studentName}</td>
                        <td className="p-2.5 text-slate-400">{s.rollNumber}</td>
                        <td className="p-2.5 font-mono text-purple-400 font-semibold">{s.ticketCode}</td>
                        <td className="p-2.5 font-semibold text-emerald-400">{s.attendanceStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* DOWNLOAD & EXPORT ACTIONS */}
              {generated && (
                <div className="flex gap-2 pt-2 animate-fade-up">
                  <button className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                    <Download size={14} /> Download {format}
                  </button>
                  <button className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5">
                    <Printer size={14} /> Print
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* REPORT HISTORY TABLE */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 space-y-4">
          <h3 className="text-base font-bold font-poppins text-white">Report History</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-3">Report</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Generated On</th>
                  <th className="px-4 py-3">Generated By</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {history.map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-800/60">
                    <td className="px-6 py-3.5 font-semibold text-white">{rep.title}</td>
                    <td className="px-4 py-3.5 text-slate-300">{rep.eventTitle}</td>
                    <td className="px-4 py-3.5 text-slate-400">{rep.generatedOn}</td>
                    <td className="px-4 py-3.5 text-slate-400">{rep.generatedBy}</td>
                    <td className="px-4 py-3.5 font-bold text-purple-400">{rep.format}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {rep.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button className="px-3 py-1 rounded bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 font-semibold transition-colors flex items-center gap-1 ml-auto">
                        <Download size={12} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
