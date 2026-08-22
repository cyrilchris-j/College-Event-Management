import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Users, Upload, Plus, Trash2, CheckCircle2, ArrowLeft, Eye
} from 'lucide-react';
import { OrganizerHeader } from './OrganizerHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { MagnetButton } from '@/components/reactbits/MagnetButton';

interface ScheduleItem {
  time: string;
  title: string;
}

export function CreateEventPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('100');
  const [deadline, setDeadline] = useState('');
  const [club, setClub] = useState('Google Developer Student Club');
  const [organizerName, setOrganizerName] = useState('Dr. Sarah Johnson');
  const [contactEmail, setContactEmail] = useState('gdsc@ksrce.ac.in');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [bannerUrl] = useState('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=300&fit=crop');

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { time: '10:00 AM', title: 'Registration & Welcome' },
    { time: '10:30 AM', title: 'Main Session' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublished, setIsPublished] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const addScheduleItem = () => {
    setSchedule(prev => [...prev, { time: '12:00 PM', title: 'New Agenda Item' }]);
  };

  const removeScheduleItem = (index: number) => {
    setSchedule(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Event title is required.';
    if (!shortDesc.trim()) errs.shortDesc = 'Short description is required.';
    if (!description.trim()) errs.description = 'Full description is required.';
    if (!date) errs.date = 'Event date is required.';
    if (!startTime) errs.startTime = 'Start time is required.';
    if (!endTime) errs.endTime = 'End time is required.';
    if (!venue.trim()) errs.venue = 'Venue location is required.';
    if (!capacity || parseInt(capacity) <= 0) errs.capacity = 'Valid capacity is required.';
    if (!deadline) errs.deadline = 'Registration deadline is required.';

    if (date && deadline && new Date(deadline) > new Date(date)) {
      errs.deadline = 'Deadline must be before or on event date.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsPublished(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <OrganizerHeader />

      <main className="flex-1 container-main py-8 max-w-4xl">
        <button
          onClick={() => navigate('/organizer')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        {isPublished ? (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-8 lg:p-12 text-center space-y-6 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-poppins text-white">✓ Event Published Successfully!</h1>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                <span className="font-semibold text-purple-300">{title}</span> has been published and is now open for campus registrations.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigate('/organizer')}
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/organizer/events/org-evt-1')}
                className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors shadow-md"
              >
                Manage Event
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-2xl lg:text-3xl font-bold font-poppins text-white">Create New Event</h1>
              <p className="text-xs lg:text-sm text-slate-400 mt-1">Create and publish your next campus event for KSR students.</p>
            </div>

            {/* SECTION 1: EVENT INFORMATION */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 space-y-5">
              <h2 className="text-base font-bold font-poppins text-purple-400 flex items-center gap-2">
                <Calendar size={18} /> 1. Event Information
              </h2>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Event Banner Image</label>
                <div className="relative h-44 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/60 flex flex-col items-center justify-center text-center p-4 hover:border-purple-500/50 transition-colors">
                  <img src={bannerUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-30" />
                  <Upload size={24} className="text-purple-400 z-10 mb-2" />
                  <p className="text-xs font-semibold text-white z-10">Click or drag image to upload banner</p>
                  <p className="text-[10px] text-slate-400 z-10 mt-1">Recommended: 1200 x 600 px (Max 5MB)</p>
                </div>
              </div>

              <Input
                label="Event Title"
                placeholder="e.g. AI & Innovation Workshop 2024"
                value={title}
                onChange={e => setTitle(e.target.value)}
                error={errors.title}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Short Description"
                    placeholder="Brief summary for event cards..."
                    value={shortDesc}
                    onChange={e => setShortDesc(e.target.value)}
                    error={errors.shortDesc}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-800 text-white"
                  >
                    {['Technical', 'Hackathon', 'Workshop', 'Seminar', 'Cultural', 'Exhibition', 'Sports'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Textarea
                label="Full Event Description"
                rows={4}
                placeholder="Detailed information about speakers, agenda, prerequisites..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                error={errors.description}
                required
              />
            </div>

            {/* SECTION 2: DATE & VENUE */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 space-y-5">
              <h2 className="text-base font-bold font-poppins text-purple-400 flex items-center gap-2">
                <MapPin size={18} /> 2. Date & Venue Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Event Date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  error={errors.date}
                  required
                />
                <Input
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  error={errors.startTime}
                  required
                />
                <Input
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  error={errors.endTime}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Venue Location"
                  placeholder="e.g. Main Auditorium / Lab 3"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  error={errors.venue}
                  required
                />
                <Input
                  label="Maximum Capacity"
                  type="number"
                  placeholder="e.g. 200"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  error={errors.capacity}
                  required
                />
                <Input
                  label="Registration Deadline"
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  error={errors.deadline}
                  required
                />
              </div>
            </div>

            {/* SECTION 3: ORGANIZER INFORMATION */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 space-y-5">
              <h2 className="text-base font-bold font-poppins text-purple-400 flex items-center gap-2">
                <Users size={18} /> 3. Organizer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Organizer / Club Name"
                  value={club}
                  onChange={e => setClub(e.target.value)}
                  required
                />
                <Input
                  label="Faculty / Student In-charge"
                  value={organizerName}
                  onChange={e => setOrganizerName(e.target.value)}
                  required
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  required
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* SECTION 4: EVENT SCHEDULE BUILDER */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-poppins text-purple-400 flex items-center gap-2">
                  <Clock size={18} /> 4. Event Schedule
                </h2>
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 bg-purple-500/15 border border-purple-500/30 px-3 py-1.5 rounded-lg"
                >
                  <Plus size={14} /> Add Agenda Item
                </button>
              </div>

              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                    <input
                      type="text"
                      value={item.time}
                      onChange={e => {
                        const newSched = [...schedule];
                        newSched[index].time = e.target.value;
                        setSchedule(newSched);
                      }}
                      className="w-28 text-xs font-semibold text-white bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => {
                        const newSched = [...schedule];
                        newSched[index].title = e.target.value;
                        setSchedule(newSched);
                      }}
                      className="flex-1 text-xs text-white bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(index)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/organizer')}
                className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-5 py-2.5 rounded-lg border border-slate-700 text-white hover:bg-slate-800 text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <Eye size={15} /> Preview
              </button>
              <MagnetButton magnetStrength={0.25}>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-md shadow-purple-600/30 transition-all"
                >
                  Publish Event
                </button>
              </MagnetButton>
            </div>
          </form>
        )}
      </main>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Event Preview"
        size="md"
      >
        <div className="space-y-4 text-white">
          <img src={bannerUrl} alt="Banner" className="w-full h-40 object-cover rounded-xl" />
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {category}
          </span>
          <h2 className="text-xl font-bold font-poppins text-white">{title || 'Untitled Event'}</h2>
          <p className="text-xs text-slate-300 leading-relaxed">{description || 'No description provided.'}</p>
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800 p-3 rounded-lg border border-slate-700">
            <div><span className="font-semibold text-slate-400">Date:</span> {date || 'N/A'}</div>
            <div><span className="font-semibold text-slate-400">Venue:</span> {venue || 'N/A'}</div>
            <div><span className="font-semibold text-slate-400">Capacity:</span> {capacity}</div>
            <div><span className="font-semibold text-slate-400">Organizer:</span> {club}</div>
          </div>
          <Button variant="primary" className="w-full justify-center mt-2" onClick={() => setPreviewOpen(false)}>
            Close Preview
          </Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
