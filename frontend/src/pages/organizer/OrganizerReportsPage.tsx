import { useState, useEffect } from 'react';
import {
  Download, TrendingUp, Users, Calendar, Award,
  DollarSign
} from 'lucide-react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import {
  getOrganizerEvents,
  getOrganizerRegistrations,
  exportRegistrationsToCSV,
  type OrganizerEventStats,
  type OrganizerStudentRegistration,
} from '@/services/organizerService';

export function OrganizerReportsPage() {
  const [events, setEvents] = useState<OrganizerEventStats[]>([]);
  const [registrations, setRegistrations] = useState<OrganizerStudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getOrganizerEvents(), getOrganizerRegistrations()])
      .then(([eventsData, regsData]) => {
        setEvents(eventsData);
        setRegistrations(regsData);
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute Analytics
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalAttended = registrations.filter(r => r.is_attended).length;
  const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0;
  const totalRevenue = events.reduce((acc, e) => acc + (e.total_revenue || 0), 0);

  // Department Breakdown
  const departmentCounts: Record<string, number> = {};
  registrations.forEach(r => {
    const dept = r.department || 'Other';
    departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
  });

  // Category Breakdown
  const categoryCounts: Record<string, number> = {};
  events.forEach(e => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + (e.registered_count || 0);
  });

  const handleExportFullReport = () => {
    exportRegistrationsToCSV(registrations, 'CampusConnect_Comprehensive_Report');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <OrganizerHeader />

      <main className="container-main py-8 flex-1 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2D52]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
              Event Analytics & Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comprehensive participation insights, department breakdowns, and official CSV exports.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
            leftIcon={<Download size={15} />}
            onClick={handleExportFullReport}
          >
            Export Comprehensive Report (CSV)
          </Button>
        </div>

        {/* ─── Metric Cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Events Created</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Calendar size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">{totalEvents}</p>
            <p className="text-xs text-slate-400 mt-1">Active college programs</p>
          </div>

          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">{totalRegistrations}</p>
            <p className="text-xs text-slate-400 mt-1">Student event entries</p>
          </div>

          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Turnout Rate</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">{attendanceRate}%</p>
            <p className="text-xs text-slate-400 mt-1">{totalAttended} confirmed present</p>
          </div>

          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Collected</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold font-poppins text-white mt-3">₹{totalRevenue}</p>
            <p className="text-xs text-slate-400 mt-1">Verified entry fees</p>
          </div>
        </div>

        {/* ─── Breakdown Columns ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              Department Participation Distribution
            </h3>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading breakdown...</div>
            ) : Object.keys(departmentCounts).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No participation data available.</div>
            ) : (
              <div className="space-y-3 pt-2">
                {Object.entries(departmentCounts).map(([dept, count]) => {
                  const percentage = Math.round((count / totalRegistrations) * 100);
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300 truncate max-w-[280px]">{dept}</span>
                        <span className="font-mono text-white font-bold">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
              <Award size={18} className="text-purple-400" />
              Registrations by Event Category
            </h3>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading breakdown...</div>
            ) : Object.keys(categoryCounts).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No category data recorded.</div>
            ) : (
              <div className="space-y-3 pt-2">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const percentage = totalRegistrations > 0 ? Math.round((count / totalRegistrations) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{cat}</span>
                        <span className="font-mono text-white font-bold">{count} participants</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
