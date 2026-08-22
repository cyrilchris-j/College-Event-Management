/**
 * eventService.ts
 * All Supabase API calls related to events.
 * Endpoint: Supabase REST → `events` table
 */

import { supabase } from './supabase';
import type { Event, EventCategory, SortOption } from '@/types';

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * GET /rest/v1/events?status=eq.published
 * Fetches all published events with optional category filter, search, and sort.
 */
export async function getPublishedEvents(params?: {
  category?: EventCategory | 'All';
  sort?: SortOption;
  search?: string;
}): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select(`
      id, title, description, short_description, category,
      event_start, event_end, venue, capacity,
      banner_url, organizer_id, organizer_club, registration_deadline,
      entry_fee, is_paid, gpay_number, gpay_upi_id,
      status, created_at,
      registrations (count)
    `)
    .eq('status', 'published');

  if (params?.category && params.category !== 'All') {
    query = query.eq('category', params.category);
  }

  if (params?.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,venue.ilike.%${params.search}%,organizer_club.ilike.%${params.search}%`
    );
  }

  if (params?.sort === 'soonest') {
    query = query.order('event_start', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('[eventService] getPublishedEvents error:', error.message);
    throw new Error(error.message);
  }

  // Format events with dynamic registered_count, registration_percentage, and registration_status
  const formatted: Event[] = (data || []).map((e: any) => {
    const registeredCount = e.registrations?.[0]?.count || 0;
    const capacity = e.capacity || 1;
    const percentage = Math.round((registeredCount / capacity) * 100);

    let registrationStatus: 'open' | 'almost_full' | 'full' | 'closed' = 'open';
    if (registeredCount >= capacity) {
      registrationStatus = 'full';
    } else if (percentage >= 80) {
      registrationStatus = 'almost_full';
    } else if (e.registration_deadline && new Date() > new Date(e.registration_deadline)) {
      registrationStatus = 'closed';
    }

    return {
      id: e.id,
      title: e.title,
      description: e.description,
      short_description: e.short_description || e.description.slice(0, 120),
      category: e.category as EventCategory,
      event_start: e.event_start,
      event_end: e.event_end,
      venue: e.venue,
      capacity: e.capacity,
      registered_count: registeredCount,
      banner_url: e.banner_url,
      organizer_id: e.organizer_id,
      organizer_name: e.organizer_club || 'Campus Organization',
      registration_deadline: e.registration_deadline,
      entry_fee: Number(e.entry_fee) || 0,
      is_paid: Boolean(e.is_paid || (Number(e.entry_fee) > 0)),
      gpay_number: e.gpay_number || '9876543210',
      gpay_upi_id: e.gpay_upi_id || 'campusconnect@upi',
      status: e.status,
      created_at: e.created_at,
      registration_status: registrationStatus,
      registration_percentage: percentage,
    };
  });

  if (params?.sort === 'most_registered') {
    formatted.sort((a, b) => b.registered_count - a.registered_count);
  } else if (params?.sort === 'most_available') {
    formatted.sort(
      (a, b) => (a.capacity - a.registered_count) - (b.capacity - b.registered_count)
    );
  }

  return formatted;
}

/**
 * GET /rest/v1/events?id=eq.{id}
 * Fetches a single event by ID.
 */
export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      id, title, description, short_description, category,
      event_start, event_end, venue, capacity,
      banner_url, organizer_id, organizer_club, registration_deadline,
      entry_fee, is_paid, gpay_number, gpay_upi_id,
      status, created_at,
      registrations (count)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    console.error('[eventService] getEventById error:', error.message);
    throw new Error(error.message);
  }

  const registeredCount = data.registrations?.[0]?.count || 0;
  const capacity = data.capacity || 1;
  const percentage = Math.round((registeredCount / capacity) * 100);

  let registrationStatus: 'open' | 'almost_full' | 'full' | 'closed' = 'open';
  if (registeredCount >= capacity) {
    registrationStatus = 'full';
  } else if (percentage >= 80) {
    registrationStatus = 'almost_full';
  } else if (data.registration_deadline && new Date() > new Date(data.registration_deadline)) {
    registrationStatus = 'closed';
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    short_description: data.short_description || data.description.slice(0, 120),
    category: data.category as EventCategory,
    event_start: data.event_start,
    event_end: data.event_end,
    venue: data.venue,
    capacity: data.capacity,
    registered_count: registeredCount,
    banner_url: data.banner_url,
    organizer_id: data.organizer_id,
    organizer_name: data.organizer_club || 'Campus Organization',
    registration_deadline: data.registration_deadline,
    entry_fee: Number(data.entry_fee) || 0,
    is_paid: Boolean(data.is_paid || (Number(data.entry_fee) > 0)),
    gpay_number: data.gpay_number || '9876543210',
    gpay_upi_id: data.gpay_upi_id || 'campusconnect@upi',
    status: data.status,
    created_at: data.created_at,
    registration_status: registrationStatus,
    registration_percentage: percentage,
  };
}

/**
 * GET event registration count (for real-time updates)
 */
export async function getEventRegistrationCount(eventId: string): Promise<number> {
  const { count, error } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .neq('status', 'cancelled');

  if (error) {
    console.error('[eventService] getEventRegistrationCount error:', error.message);
    return 0;
  }

  return count ?? 0;
}

/**
 * Subscribe to real-time registration count changes for an event.
 */
export function subscribeToEventRegistrations(
  eventId: string,
  onCountChange: (count: number) => void
): () => void {
  const channel = supabase
    .channel(`event-registrations-${eventId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'registrations',
        filter: `event_id=eq.${eventId}`,
      },
      async () => {
        const count = await getEventRegistrationCount(eventId);
        onCountChange(count);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
