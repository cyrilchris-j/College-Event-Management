/**
 * registrationService.ts
 * Supabase & Backend operations for direct event registrations, GPay screenshot uploads,
 * digital passes, and atomic booking procedures.
 */

import { supabase } from './supabase';
import type {
  Registration,
  EventCategory,
  DirectRegistrationPayload,
  DirectRegistrationResult,
} from '@/types';

// ─── Payment Proof Screenshot Upload ──────────────────────────────────────────

/**
 * Uploads a payment screenshot to the Supabase 'payment-proofs' storage bucket.
 * Returns public URL of the uploaded image.
 */
export async function uploadPaymentProof(
  file: File,
  eventId: string,
  rollNumber: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${eventId}/${rollNumber.trim().toUpperCase()}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('[uploadPaymentProof] Upload error:', error.message);
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Failed to upload screenshot.' };
  }
}

// ─── Direct Registration ──────────────────────────────────────────────────────

/**
 * POST /api/registrations/direct
 * Direct registration from the event registration form.
 * Auto-creates student account if guest, attaches GPay screenshot, and returns credentials.
 */
export async function registerDirect(
  payload: DirectRegistrationPayload
): Promise<DirectRegistrationResult> {
  try {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${apiBase}/api/registrations/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error || 'Direct registration failed.',
        registration_id: result.registration_id,
        ticket_code: result.ticket_code,
      };
    }

    return {
      success: true,
      registration_id: result.registration_id,
      ticket_code: result.ticket_code,
      is_new_user: result.is_new_user,
      user_credentials: result.user_credentials,
    };
  } catch (err: any) {
    console.error('[registerDirect] Request error:', err);
    return {
      success: false,
      error: err.message || 'Network error connecting to backend API.',
    };
  }
}

// ─── Standard Atomic Registration (Logged-in Student) ─────────────────────────

/**
 * POST /rpc/register_student_for_event
 * Atomically registers a student for an event via PostgreSQL stored procedure.
 */
export async function registerForEvent(
  eventId: string,
  userId: string,
  paymentProofUrl?: string
): Promise<{ registration: Registration | null; error: string | null }> {
  const ticketCode = `CC-${eventId.slice(0, 4).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`;

  const { data: result, error: rpcError } = await supabase.rpc(
    'register_student_for_event',
    {
      p_event_id: eventId,
      p_student_id: userId,
      p_ticket_code: ticketCode,
    }
  );

  if (rpcError) {
    console.error('[registrationService] RPC error:', rpcError.message);
    return { registration: null, error: rpcError.message };
  }

  const res = result as {
    success: boolean;
    error?: string;
    registration_id?: string;
    ticket_code?: string;
  };

  if (!res.success) {
    return { registration: null, error: res.error || 'Registration failed.' };
  }

  if (paymentProofUrl && res.registration_id) {
    await supabase
      .from('registrations')
      .update({
        payment_proof_url: paymentProofUrl,
        payment_mode: 'gpay_upi',
        payment_status: 'pending_verification',
      })
      .eq('id', res.registration_id);
  }

  const registration = await getRegistrationById(res.registration_id!);
  return { registration, error: null };
}

/**
 * GET /rest/v1/registrations?event_id=eq.{eventId}&student_id=eq.{userId}
 */
export async function checkRegistrationStatus(
  eventId: string,
  userId: string
): Promise<Registration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .select('id, event_id, student_id, ticket_code, status, payment_mode, payment_proof_url, payment_status, registered_at')
    .eq('event_id', eventId)
    .eq('student_id', userId)
    .neq('status', 'cancelled')
    .maybeSingle();

  if (error) {
    console.error('[registrationService] checkRegistrationStatus error:', error.message);
    return null;
  }

  return data as Registration | null;
}

/**
 * GET /rest/v1/registrations?student_id=eq.{userId}
 */
export async function getMyRegistrations(userId: string): Promise<Registration[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      id, event_id, student_id, ticket_code, qr_image_url, status,
      payment_mode, payment_proof_url, payment_status, registered_at,
      events (
        id, title, category, event_start, event_end, venue, banner_url, organizer_club, entry_fee, is_paid, status
      )
    `)
    .eq('student_id', userId)
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('[registrationService] getMyRegistrations error:', error.message);
    return [];
  }

  const formatted: Registration[] = (data || []).map((r: any) => ({
    id: r.id,
    event_id: r.event_id,
    student_id: r.student_id,
    ticket_code: r.ticket_code,
    status: r.status,
    payment_mode: r.payment_mode,
    payment_proof_url: r.payment_proof_url,
    payment_status: r.payment_status,
    registered_at: r.registered_at,
    event: r.events
      ? {
          id: r.events.id,
          title: r.events.title,
          description: '',
          category: r.events.category as EventCategory,
          event_start: r.events.event_start,
          event_end: r.events.event_end,
          venue: r.events.venue,
          capacity: 0,
          registered_count: 0,
          banner_url: r.events.banner_url,
          organizer_id: '',
          organizer_name: r.events.organizer_club,
          entry_fee: r.events.entry_fee,
          is_paid: r.events.is_paid,
          status: r.events.status,
          created_at: '',
        }
      : undefined,
  }));

  return formatted;
}

/**
 * GET /rest/v1/registrations?id=eq.{registrationId}
 */
export async function getRegistrationById(
  registrationId: string
): Promise<Registration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      id, event_id, student_id, ticket_code, qr_image_url, status,
      payment_mode, payment_proof_url, payment_status, registered_at,
      events (
        id, title, category, event_start, event_end, venue, banner_url,
        organizer_id, organizer_club, entry_fee, is_paid, capacity, status
      )
    `)
    .eq('id', registrationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('[registrationService] getRegistrationById error:', error.message);
    throw new Error(error.message);
  }

  const reg: any = data;
  return {
    id: reg.id,
    event_id: reg.event_id,
    student_id: reg.student_id,
    ticket_code: reg.ticket_code,
    status: reg.status,
    payment_mode: reg.payment_mode,
    payment_proof_url: reg.payment_proof_url,
    payment_status: reg.payment_status,
    registered_at: reg.registered_at,
    event: reg.events
      ? {
          id: reg.events.id,
          title: reg.events.title,
          description: '',
          category: reg.events.category as EventCategory,
          event_start: reg.events.event_start,
          event_end: reg.events.event_end,
          venue: reg.events.venue,
          capacity: reg.events.capacity,
          registered_count: 0,
          banner_url: reg.events.banner_url,
          organizer_id: reg.events.organizer_id,
          organizer_name: reg.events.organizer_club,
          entry_fee: reg.events.entry_fee,
          is_paid: reg.events.is_paid,
          status: reg.events.status,
          created_at: '',
        }
      : undefined,
  };
}

/**
 * POST /rest/v1/registrations?id=eq.{registrationId}
 */
export async function cancelRegistration(
  registrationId: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('registrations')
    .update({ status: 'cancelled' })
    .eq('id', registrationId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Update registration status to 'attended' when scanned.
 */
export async function markAttendance(
  registrationId: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('registrations')
    .update({ status: 'attended' })
    .eq('id', registrationId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
