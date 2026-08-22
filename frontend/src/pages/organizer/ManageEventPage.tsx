import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Users, QrCode, Download,
  CheckCircle2, AlertCircle, Edit3, Save, Trash2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { formatEventDateRange } from '@/utils/dateFormatter';
import {
  getEventById,
} from '@/services/eventService';
import {
  updateOrganizerEvent,
  deleteOrganizerEvent,
  downloadQRCodeAsImage,
  getOrganizerRegistrations,
  exportRegistrationsToCSV,
  type OrganizerStudentRegistration,
} from '@/services/organizerService';
import type { Event, EventStatus } from '@/types';

export function ManageEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<OrganizerStudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    venue: '',
    capacity: '100',
    status: 'published' as EventStatus,
  });

  const loadEventData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [eventData, regsData] = await Promise.all([
        getEventById(id),
        getOrganizerRegistrations(id),
      ]);
      if (!eventData) {
        setError('Event not found.');
      } else {
        setEvent(eventData);
        setRegistrations(regsData);
        setEditForm({
          title: eventData.title,
          description: eventData.description,
          venue: eventData.venue,
          capacity: String(eventData.capacity),
          status: eventData.status,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const { success, error: updateError } = await updateOrganizerEvent(id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        venue: editForm.venue.trim(),
        capacity: parseInt(editForm.capacity, 10),
        status: editForm.status,
      });

      if (success) {
        setSaveSuccess(true);
        loadEventData();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(updateError || 'Failed to update event.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !event) return;
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    const { success, error: delError } = await deleteOrganizerEvent(id);
    if (success) {
      navigate('/organizer');
    } else {
      alert(`Delete failed: ${delError}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
        <OrganizerHeader />
        <main className="container-main py-12 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <span className="text-xs text-slate-400">Loading event details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
        <OrganizerHeader />
        <main className="container-main py-16 flex-1 text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold">Event Not Found</h1>
          <p className="text-xs text-slate-400 mt-2 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/organizer')}>
            Back to Dashboard
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const attendedCount = registrations.filter(r => r.is_attended).length;
  const registeredCount = registrations.length;
  const attendanceRate = registeredCount > 0 ? Math.round((attendedCount / registeredCount) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <OrganizerHeader />

      <main className="container-main py-8 flex-1 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate('/organizer')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Events List
        </button>

        {/* ─── Top Header Card ────────────────────────────────────────────── */}
        <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CategoryBadge category={event!.category} />
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                event!.status === 'published'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {event!.status}
              </span>
              {event!.is_paid && (
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  ₹{event!.entry_fee} Entry
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
              {event!.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-400" />
                <span>{formatEventDateRange(event!.event_start, event!.event_end)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-400" />
                <span>{event!.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-blue-400" />
                <span>{event!.registered_count} / {event!.capacity} Seats</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              leftIcon={<Trash2 size={14} />}
              onClick={handleDelete}
            >
              Delete Event
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
              leftIcon={<Download size={14} />}
              onClick={() => exportRegistrationsToCSV(registrations, event!.title)}
            >
              Export Attendees (CSV)
            </Button>
          </div>
        </div>

        {/* ─── Metric Grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Capacity</span>
            <p className="text-2xl font-bold text-white mt-1">{event!.capacity}</p>
          </div>
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-blue-400 uppercase">Registered</span>
            <p className="text-2xl font-bold text-blue-400 mt-1">{registeredCount}</p>
          </div>
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-green-400 uppercase">Attended</span>
            <p className="text-2xl font-bold text-green-400 mt-1">{attendedCount}</p>
          </div>
          <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-4 text-center">
            <span className="text-xs font-semibold text-purple-400 uppercase">Turnout</span>
            <p className="text-2xl font-bold text-purple-400 mt-1">{attendanceRate}%</p>
          </div>
        </div>

        {/* ─── Main Columns: Left = QR & Attendees, Right = Edit Form ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: QR Code Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl p-6 text-center shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                <QrCode size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold font-poppins text-white">
                  Event Venue Check-In QR Pass
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Display this QR at the entrance. Attendees scan this code to check into the hall.
                </p>
              </div>

              {/* White Box for High Contrast QR SVG */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
                <QRCodeSVG
                  id={`event-qr-${event!.id}`}
                  value={JSON.stringify({
                    type: 'campusconnect_hall_checkin',
                    event_id: event!.id,
                    event_title: event!.title,
                    venue: event!.venue,
                  })}
                  size={190}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#0B1329"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20"
                leftIcon={<Download size={16} />}
                onClick={() => downloadQRCodeAsImage(`event-qr-${event!.id}`, event!.title)}
              >
                Download QR as Image (PNG)
              </Button>
            </div>
          </div>

          {/* Right Column: Edit Event Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2D52]">
                <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
                  <Edit3 size={18} className="text-blue-400" />
                  Edit Event Details
                </h3>
              </div>

              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Event details updated successfully!</span>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  label="Event Title"
                  id="edit-title"
                  value={editForm.title}
                  onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Venue Location"
                    id="edit-venue"
                    value={editForm.venue}
                    onChange={e => setEditForm(p => ({ ...p, venue: e.target.value }))}
                    required
                  />

                  <Input
                    label="Seating Capacity"
                    type="number"
                    id="edit-capacity"
                    value={editForm.capacity}
                    onChange={e => setEditForm(p => ({ ...p, capacity: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Event Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm(p => ({ ...p, status: e.target.value as EventStatus }))}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="published">Published (Open for Registration)</option>
                    <option value="closed">Closed (Registrations Halted)</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={saving}
                    className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg"
                    leftIcon={<Save size={16} />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
