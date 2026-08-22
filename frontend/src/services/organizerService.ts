/**
 * organizerService.ts
 * Supabase & Backend API operations for the Organizer Portal.
 * Handles Event CRUD, Student Registrations, Payment Verification,
 * Live Attendance, Excel / CSV Export, and QR Code PNG Downloads.
 */

import { supabase } from './supabase';
import type { Event, EventCategory } from '@/types';

export interface OrganizerEventStats extends Event {
  attended_count?: number;
  total_revenue?: number;
}

export interface OrganizerStudentRegistration {
  id: string;
  event_id: string;
  event_title: string;
  event_category?: string;
  student_id: string;
  ticket_code: string;
  student_name: string;
  roll_number: string;
  department: string;
  year_of_study: number;
  phone: string;
  status: string;
  payment_mode?: string;
  payment_proof_url?: string;
  payment_status?: string;
  registered_at: string;
  is_attended: boolean;
  checked_in_at?: string | null;
}

export interface OrganizerReportSummary {
  totalEvents: number;
  totalRegistrations: number;
  totalAttended: number;
  attendanceRate: number;
  totalRevenue: number;
  categoryBreakdown: Record<string, number>;
}

// ─── 1. Organizer Events CRUD ──────────────────────────────────────────────────

/**
 * Uploads an event banner image to Supabase 'event-banners' storage bucket.
 */
export async function uploadEventBanner(
  file: File,
  eventTitle: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanTitle = (eventTitle || 'event').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
    const fileName = `${cleanTitle}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('event-banners')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('[uploadEventBanner] Upload error:', error.message);
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('event-banners')
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Failed to upload event banner.' };
  }
}

/**
 * Fetch all events organized by the current organizer
 */
export async function getOrganizerEvents(organizerId?: string): Promise<OrganizerEventStats[]> {
  try {
    let query = supabase
      .from('events')
      .select(`
        id, title, description, short_description, category,
        event_start, event_end, venue, capacity,
        banner_url, organizer_id, organizer_club, registration_deadline,
        entry_fee, is_paid, gpay_number, gpay_upi_id,
        status, created_at,
        registrations (id, status, payment_status)
      `)
      .order('created_at', { ascending: false });

    if (organizerId) {
      query = query.eq('organizer_id', organizerId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[organizerService] getOrganizerEvents error:', error.message);
      return [];
    }

    return (data || []).map((e: any) => {
      const allRegs = e.registrations || [];
      const activeRegs = allRegs.filter((r: any) => r.status !== 'cancelled');
      const registeredCount = activeRegs.length;
      const attendedCount = allRegs.filter((r: any) => r.status === 'attended').length;
      const capacity = e.capacity || 1;
      const percentage = Math.round((registeredCount / capacity) * 100);
      const totalRevenue = e.is_paid
        ? activeRegs.filter((r: any) => r.payment_status === 'verified').length * (Number(e.entry_fee) || 0)
        : 0;

      return {
        id: e.id,
        title: e.title,
        description: e.description,
        short_description: e.short_description,
        category: e.category as EventCategory,
        event_start: e.event_start,
        event_end: e.event_end,
        venue: e.venue,
        capacity: e.capacity,
        registered_count: registeredCount,
        attended_count: attendedCount,
        banner_url: e.banner_url,
        organizer_id: e.organizer_id,
        organizer_name: e.organizer_club,
        registration_deadline: e.registration_deadline,
        entry_fee: Number(e.entry_fee) || 0,
        is_paid: Boolean(e.is_paid || (Number(e.entry_fee) > 0)),
        gpay_number: e.gpay_number || '9876543210',
        gpay_upi_id: e.gpay_upi_id || 'campusconnect@upi',
        status: e.status,
        created_at: e.created_at,
        registration_percentage: percentage,
        total_revenue: totalRevenue,
      };
    });
  } catch (err) {
    console.error('[organizerService] error:', err);
    return [];
  }
}

/**
 * Create a new event
 */
export async function createOrganizerEvent(eventData: Partial<Event> & { organizer_club?: string }): Promise<{ event: Event | null; error: string | null }> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;

    if (!userId) {
      return { event: null, error: 'User not authenticated.' };
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        organizer_id: userId,
        organizer_club: eventData.organizer_name || eventData.organizer_club || 'Campus Organization',
        title: eventData.title!.trim(),
        short_description: eventData.short_description || eventData.description?.slice(0, 140),
        description: eventData.description!.trim(),
        category: eventData.category || 'Technical',
        event_start: eventData.event_start!,
        event_end: eventData.event_end || eventData.event_start,
        venue: eventData.venue!.trim(),
        capacity: Number(eventData.capacity) || 100,
        banner_url: eventData.banner_url || null,
        registration_deadline: eventData.registration_deadline || eventData.event_start,
        entry_fee: Number(eventData.entry_fee) || 0,
        is_paid: Boolean(eventData.is_paid || (Number(eventData.entry_fee) > 0)),
        gpay_number: eventData.gpay_number || '9876543210',
        gpay_upi_id: eventData.gpay_upi_id || 'campusconnect@upi',
        status: eventData.status || 'published',
      })
      .select()
      .single();

    if (error || !data) {
      return { event: null, error: error?.message || 'Failed to create event.' };
    }

    return { event: data as Event, error: null };
  } catch (err: any) {
    return { event: null, error: err.message || 'Error creating event.' };
  }
}

/**
 * Update existing event
 */
export async function updateOrganizerEvent(
  id: string,
  updates: Partial<Event>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete / Cancel an event
 */
export async function deleteOrganizerEvent(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── 2. Student Registrations & Verification ──────────────────────────────────

/**
 * Fetch registrations list with academic profiles
 */
export async function getOrganizerRegistrations(eventId?: string): Promise<OrganizerStudentRegistration[]> {
  try {
    let query = supabase
      .from('registrations')
      .select(`
        id, event_id, student_id, ticket_code, status,
        payment_mode, payment_proof_url, payment_status, registered_at,
        events (
          id, title, category, event_start, venue, entry_fee, is_paid, organizer_id
        ),
        attendance (
          id, checked_in_at, verified_by
        )
      `)
      .order('registered_at', { ascending: false });

    if (eventId && eventId !== 'all') {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[organizerService] getOrganizerRegistrations error:', error.message);
      return [];
    }

    const studentUserIds = [...new Set((data || []).map((r: any) => r.student_id))];
    const { data: profiles } = await supabase
      .from('student_profiles')
      .select('user_id, full_name, roll_number, department, year_of_study, phone')
      .in('user_id', studentUserIds);

    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

    return (data || []).map((r: any) => {
      const p: any = profileMap.get(r.student_id);
      return {
        id: r.id,
        event_id: r.event_id,
        event_title: r.events?.title || 'Event',
        event_category: r.events?.category,
        student_id: r.student_id,
        ticket_code: r.ticket_code,
        student_name: p?.full_name || 'Student Participant',
        roll_number: p?.roll_number || 'N/A',
        department: p?.department || 'General',
        year_of_study: p?.year_of_study || 1,
        phone: p?.phone || 'N/A',
        status: r.status,
        payment_mode: r.payment_mode,
        payment_proof_url: r.payment_proof_url,
        payment_status: r.payment_status || 'free',
        registered_at: r.registered_at,
        is_attended: Boolean(r.attendance && r.attendance.length > 0) || r.status === 'attended',
        checked_in_at: r.attendance?.[0]?.checked_in_at || null,
      };
    });
  } catch (err) {
    console.error('[organizerService] getOrganizerRegistrations error:', err);
    return [];
  }
}

/**
 * Approve or Reject Payment Screenshot
 */
export async function verifyPaymentStatus(
  registrationId: string,
  status: 'verified' | 'rejected' | 'pending_verification'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('registrations')
      .update({ payment_status: status })
      .eq('id', registrationId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── 3. Manual Attendance Verification ────────────────────────────────────────

/**
 * Mark manual attendance by ticket code or student roll number
 */
export async function markManualAttendance(
  eventId: string,
  ticketCodeOrRoll: string
): Promise<{ success: boolean; message?: string; error?: string; registration?: any }> {
  try {
    const queryTerm = ticketCodeOrRoll.trim().toUpperCase();

    // Find registration by ticket_code or student profile roll_number
    let regQuery = supabase
      .from('registrations')
      .select('id, event_id, student_id, ticket_code, status')
      .eq('event_id', eventId);

    if (queryTerm.startsWith('CC-')) {
      regQuery = regQuery.eq('ticket_code', queryTerm);
    } else {
      // Find user ID by roll number
      const { data: student } = await supabase
        .from('student_profiles')
        .select('user_id')
        .eq('roll_number', queryTerm)
        .maybeSingle();

      if (!student) {
        return { success: false, error: `No student found with Roll Number: ${queryTerm}` };
      }
      regQuery = regQuery.eq('student_id', student.user_id);
    }

    const { data: reg, error: regError } = await regQuery.maybeSingle();

    if (regError || !reg) {
      return { success: false, error: 'Registration not found for this event.' };
    }

    // Check if already attended
    const { data: existingAtt } = await supabase
      .from('attendance')
      .select('*')
      .eq('registration_id', reg.id)
      .maybeSingle();

    if (existingAtt) {
      return {
        success: true,
        message: 'Attendee is already checked in!',
        registration: reg,
      };
    }

    // Insert attendance record
    const { data: session } = await supabase.auth.getSession();
    const verifierId = session.session?.user.id;

    await supabase.from('attendance').insert({
      registration_id: reg.id,
      verified_by: verifierId || null,
      checked_in_at: new Date().toISOString(),
    });

    await supabase.from('registrations').update({ status: 'attended' }).eq('id', reg.id);

    return {
      success: true,
      message: 'Attendance successfully verified and marked!',
      registration: reg,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to verify attendance.' };
  }
}

// ─── 4. Excel / CSV Export ────────────────────────────────────────────────────

/**
 * Generates and downloads a clean Excel-compatible CSV file of registrations.
 */
export function exportRegistrationsToCSV(
  registrations: OrganizerStudentRegistration[],
  filenamePrefix = 'Event_Registrations'
) {
  if (!registrations || registrations.length === 0) {
    alert('No registrations available to export.');
    return;
  }

  const headers = [
    'Ticket Code',
    'Student Name',
    'Roll Number',
    'Department',
    'Year of Study',
    'Mobile Number',
    'Event Title',
    'Registration Status',
    'Payment Mode',
    'Payment Status',
    'Payment Proof Link',
    'Registered Date & Time',
    'Attendance Status',
    'Check-in Timestamp',
  ];

  const rows = registrations.map(r => [
    `"${r.ticket_code}"`,
    `"${r.student_name}"`,
    `"${r.roll_number}"`,
    `"${r.department}"`,
    `"${r.year_of_study}"`,
    `"${r.phone}"`,
    `"${r.event_title}"`,
    `"${r.status}"`,
    `"${r.payment_mode || 'free'}"`,
    `"${r.payment_status || 'free'}"`,
    `"${r.payment_proof_url || 'N/A'}"`,
    `"${new Date(r.registered_at).toLocaleString()}"`,
    `"${r.is_attended ? 'Attended' : 'Not Attended'}"`,
    `"${r.checked_in_at ? new Date(r.checked_in_at).toLocaleString() : 'N/A'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const cleanDate = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${cleanDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── 5. Download QR Code as PNG Image ─────────────────────────────────────────

/**
 * Downloads an SVG/Canvas QR Code element as a high-resolution PNG image.
 */
export function downloadQRCodeAsImage(svgElementId: string, eventTitle: string) {
  const svgElement = document.getElementById(svgElementId) as SVGElement | null;
  if (!svgElement) {
    console.error('QR SVG element not found:', svgElementId);
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  // High res size (800x800 for clean printouts)
  canvas.width = 800;
  canvas.height = 950;

  img.onload = () => {
    if (!ctx) return;

    // 1. Draw Background
    ctx.fillStyle = '#0B1329';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Top Banner / Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CampusConnect Check-In Pass', canvas.width / 2, 70);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 24px Poppins, sans-serif';
    const truncatedTitle = eventTitle.length > 35 ? eventTitle.slice(0, 35) + '...' : eventTitle;
    ctx.fillText(truncatedTitle, canvas.width / 2, 115);

    // 3. Draw White Rounded Box for QR
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(100, 160, 600, 600, 24);
    ctx.fill();

    // 4. Draw QR Code
    ctx.drawImage(img, 150, 210, 500, 500);

    // 5. Draw Footer Instructions
    ctx.fillStyle = '#94A3B8';
    ctx.font = '18px Poppins, sans-serif';
    ctx.fillText('KSR College of Engineering • Scan at venue entrance', canvas.width / 2, 820);
    ctx.font = '14px Poppins, sans-serif';
    ctx.fillText('Valid for registered student participants only', canvas.width / 2, 855);

    // 6. Download PNG
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    const cleanName = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 25);
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_${cleanName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}
