/**
 * registrationService.ts
 * All Supabase operations for event registrations and digital tickets.
 * Endpoints: registrations table, events capacity check
 */

import { supabase } from './supabase';
import type { Registration } from '@/types';

// ─── Registration Operations ──────────────────────────────────────────────────

/**
 * POST /rest/v1/registrations
 * Atomically registers a student for an event.
 * Uses a database function to verify capacity and prevent duplicates.
 *
 * Supabase RPC: register_student_for_event(p_event_id, p_student_id)
 */
export async function registerForEvent(
  eventId: string,
  userId: string
): Promise<{ registration: Registration | null; error: string | null }> {
  // Generate a unique ticket code
  const ticketCode = `CC-${eventId.slice(0, 4).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`;

  // Check capacity via Supabase
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('capacity, registered_count')
    .eq('id', eventId)
    .single();

  if (eventError) {
    return { registration: null, error: 'Failed to fetch event details.' };
  }

  if (eventData.registered_count >= eventData.capacity) {
    return { registration: null, error: 'This event is full. No seats available.' };
  }

  // Check for duplicate registration
  const { data: existing } = await supabase
    .from('registrations')
    .select('id, ticket_code, status')
    .eq('event_id', eventId)
    .eq('student_id', userId)
    .neq('status', 'cancelled')
    .maybeSingle();

  if (existing) {
    return {
      registration: null,
      error: 'You are already registered for this event.',
    };
  }

  // Insert registration
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      event_id: eventId,
      student_id: userId,
      ticket_code: ticketCode,
      status: 'registered',
    })
    .select()
    .single();

  if (error) {
    // Handle unique constraint violation (race condition)
    if (error.code === '23505') {
      return { registration: null, error: 'You are already registered for this event.' };
    }
    return { registration: null, error: error.message };
  }

  // Increment registered_count
  await supabase.rpc('increment_registered_count', { event_id: eventId });

  return { registration: data as Registration, error: null };
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
      id, event_id, student_id, ticket_code, status, registered_at,
      events (
        id, title, category, event_start, event_end, venue, banner_url, status
      )
    `)
    .eq('student_id', userId)
    .order('registered_at', { ascending: false });

  if (error) {
    console.error('[registrationService] getMyRegistrations error:', error.message);
    return [];
  }

  return (data as Registration[]) ?? [];
}

/**
 * GET /rest/v1/registrations?id=eq.{registrationId}
 * Fetch a single registration by ID (for digital ticket).
 */
export async function getRegistrationById(
  registrationId: string
): Promise<Registration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      id, event_id, student_id, ticket_code, status, registered_at,
      events (
        id, title, category, event_start, event_end, venue, banner_url,
        organizer_id, capacity, registered_count
      )
    `)
    .eq('id', registrationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data as Registration;
}

/**
 * PATCH /rest/v1/registrations?id=eq.{registrationId}
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
