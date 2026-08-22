import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Users, DollarSign, Image,
  Sparkles, CheckCircle2, AlertCircle, Building, UploadCloud,
  Globe, Laptop, Users2, User
} from 'lucide-react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createOrganizerEvent, uploadEventBanner } from '@/services/organizerService';
import type { EventCategory } from '@/types';

const CATEGORIES: EventCategory[] = [
  'Technical',
  'Hackathon',
  'Workshop',
  'Seminar',
  'Cultural',
  'Sports',
  'Exhibition',
];

export function CreateEventPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Banner file upload state
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Technical' as EventCategory,
    organizerClub: 'KSRCE Technical Club',
    eventMode: 'offline' as 'offline' | 'online' | 'hybrid',
    participationType: 'solo' as 'solo' | 'team',
    teamSize: '3',
    eventStart: '',
    eventEnd: '',
    registrationDeadline: '',
    venue: '',
    capacity: '100',
    bannerUrl: '',
    isPaid: false,
    entryFee: '0',
    gpayNumber: '9876543210',
    gpayUpiId: 'campusconnect@upi',
  });

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Please provide an event title.');
      return;
    }
    if (!form.description.trim()) {
      setError('Please provide an event description.');
      return;
    }
    if (!form.eventStart) {
      setError('Please select the event start date and time.');
      return;
    }
    if (!form.venue.trim()) {
      setError('Please specify the event venue / meeting link.');
      return;
    }
    if (!form.capacity || parseInt(form.capacity, 10) <= 0) {
      setError('Capacity must be at least 1 seat.');
      return;
    }

    setSubmitting(true);

    try {
      let finalBannerUrl = form.bannerUrl;

      // 1. Upload Banner Image if file was selected
      if (bannerFile) {
        setUploadingImage(true);
        const { url, error: uploadErr } = await uploadEventBanner(bannerFile, form.title);
        setUploadingImage(false);

        if (uploadErr || !url) {
          setError(uploadErr || 'Failed to upload event banner.');
          setSubmitting(false);
          return;
        }
        finalBannerUrl = url;
      }

      // 2. Create Event
      const { event, error: createError } = await createOrganizerEvent({
        title: form.title,
        short_description: form.shortDescription || form.description.slice(0, 120),
        description: form.description,
        category: form.category,
        organizer_name: form.organizerClub,
        event_mode: form.eventMode,
        participation_type: form.participationType,
        team_size: form.participationType === 'team' ? parseInt(form.teamSize, 10) || 3 : 1,
        event_start: new Date(form.eventStart).toISOString(),
        event_end: form.eventEnd ? new Date(form.eventEnd).toISOString() : new Date(form.eventStart).toISOString(),
        registration_deadline: form.registrationDeadline
          ? new Date(form.registrationDeadline).toISOString()
          : new Date(form.eventStart).toISOString(),
        venue: form.venue,
        capacity: parseInt(form.capacity, 10),
        banner_url: finalBannerUrl || undefined,
        is_paid: form.isPaid,
        entry_fee: form.isPaid ? parseFloat(form.entryFee) || 0 : 0,
        gpay_number: form.gpayNumber,
        gpay_upi_id: form.gpayUpiId,
        status: 'published',
      });

      if (createError || !event) {
        setError(createError || 'Failed to create event.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/organizer');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while creating event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1329] text-white">
      <OrganizerHeader />

      <main className="container-main py-8 flex-1">
        {/* Back Link */}
        <button
          onClick={() => navigate('/organizer')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to Organizer Dashboard
        </button>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
              Create New College Event
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure event format (Solo/Team, Online/Offline), upload banner images, and set seating capacities.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-3">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center gap-3">
              <CheckCircle2 size={18} className="flex-shrink-0" />
              <span>Event successfully created and published! Redirecting to dashboard...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── 1. Basic Info ── */}
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-6 space-y-5 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Sparkles size={16} /> 1. Basic Event Information
              </h2>

              <div className="space-y-4">
                <Input
                  label="Event Title"
                  id="event-title"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Autonomous AI Hackathon 2026"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={e => setForm(p => ({ ...p, category: e.target.value as EventCategory }))}
                      className="w-full h-11 px-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Organizing Club / Association"
                    id="event-club"
                    value={form.organizerClub}
                    onChange={e => setForm(p => ({ ...p, organizerClub: e.target.value }))}
                    placeholder="e.g. KSRCE ACM Student Chapter"
                    leftIcon={<Building size={15} />}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Full Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe agenda, prerequisites, prizes, and schedule highlights..."
                    className="w-full p-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
                    required
                  />
                </div>

                <Input
                  label="Short Tagline (Optional)"
                  id="event-short-desc"
                  value={form.shortDescription}
                  onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))}
                  placeholder="One sentence summary for event preview cards"
                />
              </div>
            </div>

            {/* ── 2. Mode of Event & Participation Type ── */}
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-6 space-y-5 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Globe size={16} /> 2. Event Mode & Participation Format
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Event Mode (Offline, Online, Hybrid) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Event Mode <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'offline', label: 'Offline', icon: <Building size={14} />, desc: 'On-Campus Venue' },
                      { id: 'online', label: 'Online', icon: <Laptop size={14} />, desc: 'Virtual / Meet' },
                      { id: 'hybrid', label: 'Hybrid', icon: <Globe size={14} />, desc: 'Dual Mode' },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, eventMode: mode.id as any }))}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          form.eventMode === mode.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                            : 'bg-[#0B1329] border-[#1E2D52] text-slate-400 hover:text-white'
                        }`}
                      >
                        {mode.icon}
                        <span className="text-xs font-bold">{mode.label}</span>
                        <span className="text-[10px] opacity-75">{mode.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Participation Type (Solo vs Team) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Participation Format <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, participationType: 'solo' }))}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        form.participationType === 'solo'
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                          : 'bg-[#0B1329] border-[#1E2D52] text-slate-400 hover:text-white'
                      }`}
                    >
                      <User size={16} />
                      <span className="text-xs font-bold">Solo / Individual</span>
                      <span className="text-[10px] opacity-75">1 participant per ticket</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, participationType: 'team' }))}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        form.participationType === 'team'
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                          : 'bg-[#0B1329] border-[#1E2D52] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Users2 size={16} />
                      <span className="text-xs font-bold">Team Event</span>
                      <span className="text-[10px] opacity-75">Group registration</span>
                    </button>
                  </div>

                  {form.participationType === 'team' && (
                    <div className="pt-2 animate-slide-in">
                      <Input
                        label="Maximum Team Size (Members)"
                        type="number"
                        id="team-size"
                        value={form.teamSize}
                        onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))}
                        placeholder="e.g. 4"
                        min="2"
                        max="10"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── 3. Schedule & Venue (React Calendar / DateTime) ── */}
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-6 space-y-5 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Calendar size={16} /> 3. Schedule & Venue Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Event Start Date & Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.eventStart}
                    onChange={e => setForm(p => ({ ...p, eventStart: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Event End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={form.eventEnd}
                    onChange={e => setForm(p => ({ ...p, eventEnd: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={form.registrationDeadline}
                    onChange={e => setForm(p => ({ ...p, registrationDeadline: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B1329] border border-[#1E2D52] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={form.eventMode === 'online' ? 'Meeting Link / Platform' : 'Venue / Hall Location'}
                  id="event-venue"
                  value={form.venue}
                  onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
                  placeholder={form.eventMode === 'online' ? 'e.g. Google Meet: meet.google.com/xyz' : 'e.g. Main Auditorium, KSRCE Campus'}
                  leftIcon={<MapPin size={15} />}
                  required
                />

                <Input
                  label="Total Seating Capacity"
                  type="number"
                  id="event-capacity"
                  value={form.capacity}
                  onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                  placeholder="e.g. 150"
                  leftIcon={<Users size={15} />}
                  required
                />
              </div>
            </div>

            {/* ── 4. Image Upload (Direct File Selector / Supabase Storage) ── */}
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-6 space-y-5 shadow-lg">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Image size={16} /> 4. Event Banner Image Upload
              </h2>

              <div className="space-y-4">
                {/* File Upload Box */}
                {bannerPreview ? (
                  <div className="relative border border-[#1E2D52] rounded-2xl overflow-hidden bg-slate-900 group">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label
                        htmlFor="banner-file-input"
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer hover:bg-blue-500"
                      >
                        Change Image
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setBannerFile(null);
                          setBannerPreview(null);
                          setForm(p => ({ ...p, bannerUrl: '' }));
                        }}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="banner-file-input"
                    className="border-2 border-dashed border-[#1E2D52] hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#0B1329] hover:bg-blue-950/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-3">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-xs font-bold text-white">
                      Click or drag to upload event banner image
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PNG, JPG, JPEG or WEBP (Recommended: 1200 x 600 px)
                    </p>
                  </label>
                )}

                <input
                  type="file"
                  id="banner-file-input"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                  className="hidden"
                />

                {/* Direct Image URL Alternative */}
                <div className="pt-2">
                  <p className="text-[11px] text-slate-400 mb-1.5">Or paste a direct banner image URL:</p>
                  <Input
                    id="event-banner-url"
                    value={form.bannerUrl}
                    onChange={e => {
                      setForm(p => ({ ...p, bannerUrl: e.target.value }));
                      if (e.target.value) setBannerPreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>
            </div>

            {/* ── 5. Payment & Fee Settings ── */}
            <div className="bg-[#111C3A] border border-[#1E2D52] rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                    <DollarSign size={16} /> 5. Entry Fee & Google Pay Settings
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enable if participants need to pay an entry fee via Google Pay / UPI.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPaid}
                    onChange={e => setForm(p => ({ ...p, isPaid: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {form.isPaid && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1E2D52] animate-slide-in">
                  <Input
                    label="Entry Fee Amount (₹)"
                    type="number"
                    id="event-fee"
                    value={form.entryFee}
                    onChange={e => setForm(p => ({ ...p, entryFee: e.target.value }))}
                    placeholder="e.g. 150"
                    required={form.isPaid}
                  />

                  <Input
                    label="Google Pay Mobile Number"
                    type="tel"
                    id="event-gpay"
                    value={form.gpayNumber}
                    onChange={e => setForm(p => ({ ...p, gpayNumber: e.target.value }))}
                    placeholder="9876543210"
                    required={form.isPaid}
                  />

                  <Input
                    label="UPI ID"
                    id="event-upi"
                    value={form.gpayUpiId}
                    onChange={e => setForm(p => ({ ...p, gpayUpiId: e.target.value }))}
                    placeholder="organizer@upi"
                    required={form.isPaid}
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate('/organizer')}
                className="bg-[#111C3A] text-white border-[#1E2D52]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={submitting || uploadingImage}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 px-8"
              >
                {uploadingImage ? 'Uploading Banner...' : submitting ? 'Publishing Event...' : 'Publish Event'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
