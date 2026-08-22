/**
 * registrationService.ts
 * All Supabase operations for event registrations and digital tickets.
 * Utilizes atomic database stored procedures and real-time query joins.
 */

import { supabase } from './supabase';
import type { Registration, EventCategory } from '@/types';

// ─── Registration Operations ──────────────────────────────────────────────────

/**
 * POST /rpc/register_student_for_event
 * Atomically registers a student for an event via PostgreSQL stored procedure.
 * Guarantees zero race conditions, enforces capacity limits, deadline validation,
 * prevents duplicate registrations, and queues confirmation emails.
 */
export async function registerForEvent(
  eventId: string,
  userId: string
): Promise<{ registration: Registration | null; error: string | null }> {
  // Generate unique ticket code: CC-{EVENT_SHORT_ID}-{RANDOM}
  const ticketCode = `CC-${eventId.slice(0, 4).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`;

  // Call atomic database RPC function
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

  const res = result as { success: boolean; error?: string; registration_id?: string; ticket_code?: string };

  if (!res.success) {
    return { registration: null, error: res.error || 'Registration failed.' };
  }

  // Fetch the created registration with event details
  const registration = await getRegistrationById(res.registration_id!);
  return { registration, error: null };
}

/**
 * GET /rest/v1/registrations?event_id=eq.{eventId}&student_id=eq.{userId}
 * Check if a student is already registered for an event.
 */
export async function checkRegistrationStatus(
  eventId: string,
  userId: string
): Promise<Registration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .select('id, event_id, student_id, ticket_code, status, registered_at')
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
 * Fetch all registrations for the logged-in student.
 */
export async function getMyRegistrations(userId: string): Promise<Registration[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      id, event_id, student_id, ticket_code, qr_image_url, status, registered_at,
      events (
        id, title, category, event_start, event_end, venue, banner_url, organizer_club, status
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
          status: r.events.status,
          created_at: '',
        }
      : undefined,
  }));

  return formatted;
}

/**
 * GET /rest/v1/registrations?id=eq.{registrationId}
 * Fetch a single registration by ID (for digital ticket pass).
 */
export async function getRegistrationById(
  registrationId: string
): Promise<Registration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      id, event_id, student_id, ticket_code, qr_image_url, status, registered_at,
      events (
        id, title, category, event_start, event_end, venue, banner_url,
        organizer_id, organizer_club, capacity, status
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
          status: reg.events.status,
          created_at: '',
        }
      : undefined,
  };
}

/**
 * POST /rest/v1/registrations?id=eq.{registrationId}
 * Cancel a registration.
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
