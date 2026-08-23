import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  User as UserIcon,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  Lock,
} from 'lucide-react';
import { getEventById } from '@/services/eventService';
import { registerDirect, uploadPaymentProof } from '@/services/registrationService';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CategoryBadge } from '@/components/events/CategoryBadge';
import { formatEventDateRange } from '@/utils/dateFormatter';
import type { Event, DirectRegistrationResult } from '@/types';

const DEPARTMENTS = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence and Data Science (AI & DS)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Biomedical Engineering (BME)',
  'Master of Computer Applications (MCA)',
  'Master of Business Administration (MBA)',
  'Other Department',
];

export function EventRegistrationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    department: DEPARTMENTS[0],
    yearOfStudy: '1',
    phone: '',
  });

  // Payment Screenshot State
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Success Result State
  const [registrationResult, setRegistrationResult] = useState<DirectRegistrationResult | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // Pre-fill form if student is already logged in
  useEffect(() => {
    if (user && profile) {
      setForm(prev => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        email: user.email || prev.email,
        rollNumber: profile.roll_number || prev.rollNumber,
        department: profile.department || prev.department,
        yearOfStudy: String(profile.year_of_study || prev.yearOfStudy),
        phone: profile.phone || prev.phone,
      }));
    } else if (user) {
      setForm(prev => ({
        ...prev,
        email: user.email || prev.email,
      }));
    }
  }, [user, profile]);

  // Load Event
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getEventById(id)
      .then(data => {
        if (!data) {
          setError('Event not found.');
          setEvent(null);
        } else {
          setError(null);
          setEvent(data);
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load event details.');
        setEvent(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handle Screenshot Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Copy Credentials
  const handleCopyCredentials = () => {
    if (!registrationResult?.user_credentials) return;
    const text = `CampusConnect Login:\nEmail: ${registrationResult.user_credentials.email}\nPassword: ${registrationResult.user_credentials.password}`;
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 3000);
  };

  // Submit Handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!form.fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!form.email.trim() || !form.email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!form.rollNumber.trim()) {
        setError('Please enter your roll / register number.');
        return;
      }
      if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }

      const isPaid = event?.is_paid || (event?.entry_fee && event.entry_fee > 0);
      if (isPaid && !screenshotFile) {
        setError('Please upload your Google Pay payment screenshot proof to proceed.');
        return;
      }

      setSubmitting(true);

      try {
        let paymentProofUrl: string | null = null;

        // 1. Upload payment screenshot if paid event
        if (isPaid && screenshotFile && event) {
          setUploadProgress(true);
          const { url, error: uploadErr } = await uploadPaymentProof(
            screenshotFile,
            event.id,
            form.rollNumber
          );
          setUploadProgress(false);

          if (uploadErr || !url) {
            setError(uploadErr || 'Failed to upload payment proof screenshot.');
            setSubmitting(false);
            return;
          }
          paymentProofUrl = url;
        }

        // 2. Submit Direct Registration
        const res = await registerDirect({
          event_id: event!.id,
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          roll_number: form.rollNumber.trim(),
          department: form.department,
          year_of_study: parseInt(form.yearOfStudy, 10),
          phone: form.phone.trim(),
          payment_mode: isPaid ? 'gpay_upi' : 'free',
          payment_proof_url: paymentProofUrl || undefined,
        });

        if (!res.success) {
          setError(res.error || 'Failed to complete registration.');
        } else {
          setRegistrationResult(res);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during registration.');
      } finally {
        setSubmitting(false);
      }
    },
    [form, event, screenshotFile]
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="container-main py-12 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <span className="text-sm text-slate-500">Loading registration form...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="container-main py-16 flex-1 flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-navy mb-2">Event Not Available</h1>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Explore Events
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isPaid = event?.is_paid || (event?.entry_fee && event.entry_fee > 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="container-main py-8 flex-1">
        {/* Back Link */}
        <button
          onClick={() => navigate(`/events/${event?.id}`)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-navy transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Event Details
        </button>

        {/* ─── SUCCESS MODAL OVERLAY ─────────────────────────────────────────── */}
        {registrationResult && (
          <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-border animate-slide-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 text-green-600">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold font-poppins text-navy">
                  Registration Confirmed! 🎉
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  You are registered for <strong>{event?.title}</strong>
                </p>
              </div>

              {/* Ticket Code Card */}
              <div className="bg-slate-50 border border-border rounded-xl p-4 mb-6 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Your Digital Ticket Code
                </span>
                <p className="font-mono text-xl font-extrabold text-blue-600 tracking-wider mt-1">
                  {registrationResult.ticket_code}
                </p>
              </div>

              {/* Auto-Created Account Credentials Section */}
              {registrationResult.user_credentials && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-2 text-navy">
                    <Lock size={16} className="text-blue-600" />
                    <h3 className="text-sm font-bold">Your Auto-Created Account Credentials</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    An account has been generated for you to view your tickets and attendance passes anytime!
                  </p>

                  <div className="space-y-2 bg-white p-3 rounded-lg border border-blue-100 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-sans">Email:</span>
                      <span className="font-bold text-navy">{registrationResult.user_credentials.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-sans">Password:</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {registrationResult.user_credentials.password}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyCredentials}
                    className="mt-3 w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    {copiedCredentials ? (
                      <>
                        <Check size={14} /> Credentials Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Login Credentials
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 justify-center"
                  onClick={() => navigate(`/ticket/${registrationResult.registration_id}`)}
                >
                  <Ticket size={16} /> View Digital Pass
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1 justify-center"
                  onClick={() => navigate('/')}
                >
                  Browse Events
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN REGISTRATION FORM ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Left Column: Event Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden sticky top-24">
              {event?.banner_url && (
                <div className="h-44 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={event.banner_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&fit=crop';
                    }}
                  />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <CategoryBadge category={event?.category || 'Technical'} />
                  {isPaid ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      ₹{event?.entry_fee} Entry Fee
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                      Free Entry
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold font-poppins text-navy leading-snug">
                  {event?.title}
                </h2>

                <div className="space-y-2.5 text-xs text-slate-600 border-t border-border pt-4">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={15} className="text-blue-600 flex-shrink-0" />
                    <span>{event && formatEventDateRange(event.event_start, event.event_end)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate">{event?.venue}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap size={15} className="text-blue-600 flex-shrink-0" />
                    <span>Organized by {event?.organizer_name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-border shadow-card p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold font-poppins text-navy">
                  Event Registration
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Fill out your details to reserve your ticket and generate your pass.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-3"
                >
                  <AlertCircle size={18} className="flex-shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Full Name */}
                <Input
                  label="Full Name"
                  id="reg-full-name"
                  value={form.fullName}
                  onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="e.g. Cyril Christopher J"
                  required
                  leftIcon={<UserIcon size={16} />}
                />

                {/* Email Address */}
                <Input
                  label="Email Address"
                  type="email"
                  id="reg-email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. yourname@student.college.edu"
                  required
                  leftIcon={<Mail size={16} />}
                />

                {/* Roll Number & Mobile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Roll / Register Number"
                    id="reg-roll-number"
                    value={form.rollNumber}
                    onChange={e => setForm(p => ({ ...p, rollNumber: e.target.value.toUpperCase() }))}
                    placeholder="e.g. 73152413029"
                    required
                    leftIcon={<BookOpen size={16} />}
                  />

                  <Input
                    label="Mobile Number (WhatsApp)"
                    type="tel"
                    id="reg-phone"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="e.g. 9876543210"
                    required
                    leftIcon={<Phone size={16} />}
                  />
                </div>

                {/* Department Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-department" className="block text-xs font-semibold text-navy">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reg-department"
                    value={form.department}
                    onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full h-11 px-3 rounded-lg border border-border bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year of Study */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-navy">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {['1', '2', '3', '4', '5'].map(yr => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, yearOfStudy: yr }))}
                        className={`h-10 rounded-lg text-xs font-semibold transition-all border ${
                          form.yearOfStudy === yr
                            ? 'bg-navy text-white border-navy shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-border hover:bg-slate-100'
                        }`}
                      >
                        {yr === '5' ? 'PG / 5th' : `Year ${yr}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── PAYMENT SECTION (IF PAID EVENT) ───────────────────────── */}
                {isPaid && (
                  <div className="border-t border-border pt-6 mt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-blue-600" />
                      <h3 className="text-sm font-bold text-navy">Payment Details (Google Pay / UPI)</h3>
                    </div>

                    {/* GPay Number Card */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs uppercase font-semibold tracking-wider text-blue-200">
                          Google Pay & UPI Payment
                        </span>
                        <span className="text-sm font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full">
                          ₹{event?.entry_fee}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-blue-200">GPay Mobile Number</p>
                          <p className="text-lg font-bold font-mono tracking-wider">
                            {event?.gpay_number || '9876543210'}
                          </p>
                        </div>
                        {event?.gpay_upi_id && (
                          <div>
                            <p className="text-xs text-blue-200">UPI ID</p>
                            <p className="text-xs font-mono font-semibold">{event.gpay_upi_id}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-navy">
                        Upload Payment Screenshot <span className="text-red-500">*</span>
                      </label>

                      {screenshotPreview ? (
                        <div className="relative border border-border rounded-xl p-3 bg-slate-50 flex items-center gap-4">
                          <img
                            src={screenshotPreview}
                            alt="Payment preview"
                            className="w-16 h-16 object-cover rounded-lg border border-border"
                          />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-navy">
                              {screenshotFile?.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {(screenshotFile!.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <label
                            htmlFor="screenshot-upload"
                            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer px-2 py-1"
                          >
                            Change
                          </label>
                        </div>
                      ) : (
                        <label
                          htmlFor="screenshot-upload"
                          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-colors"
                        >
                          <UploadCloud size={28} className="text-slate-400 mb-2" />
                          <p className="text-xs font-semibold text-navy">
                            Click to upload payment screenshot
                          </p>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                        </label>
                      )}

                      <input
                        type="file"
                        id="screenshot-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={submitting || uploadProgress}
                    className="w-full justify-center text-sm font-semibold py-3.5 shadow-md"
                  >
                    {submitting ? 'Confirming Registration...' : 'Complete Registration & Get Pass'}
                  </Button>
                  <p className="text-xs text-slate-400 text-center mt-2.5">
                    Your digital pass & login credentials will be generated instantly.
                  </p>
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
