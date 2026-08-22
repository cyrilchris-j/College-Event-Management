/**
 * eventService.ts
 * All Supabase API calls related to events.
 * Endpoint: Supabase REST → `events` table
 */

import { supabase } from './supabase';
import type { Event, EventCategory, SortOption } from '@/types';

// ─── Mock data (used when Supabase is not configured) ────────────────────────
export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'AI & Innovation Workshop',
    description:
      'Explore the future of AI and machine learning with hands-on sessions and expert talks covering the latest advancements in artificial intelligence.',
    short_description:
      'Explore the future of AI and machine learning with hands-on sessions and expert talks.',
    category: 'Technical',
    event_start: '2024-05-28T10:00:00',
    event_end: '2024-05-28T13:00:00',
    venue: 'Main Auditorium',
    capacity: 200,
    registered_count: 124,
    banner_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop',
    organizer_id: 'org-1',
    organizer_name: 'Dept. of Computer Science',
    registration_deadline: '2024-05-26T23:59:00',
    status: 'published',
    created_at: '2024-05-01T00:00:00',
  },
  {
    id: '2',
    title: 'Campus Hackathon 2024',
    description:
      'Build, code and innovate in a 24-hour challenge to create real-world solutions. Form teams and compete for exciting prizes.',
    short_description:
      'Build, code and innovate in a 24-hour challenge to create real-world solutions.',
    category: 'Hackathon',
    event_start: '2024-05-30T09:00:00',
    event_end: '2024-05-31T09:00:00',
    venue: 'Computer Lab 3',
    capacity: 300,
    registered_count: 180,
    banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
    organizer_id: 'org-2',
    organizer_name: 'CSE Association',
    registration_deadline: '2024-05-28T23:59:00',
    status: 'published',
    created_at: '2024-05-02T00:00:00',
  },
  {
    id: '3',
    title: 'Web Development Bootcamp',
    description:
      'Learn full-stack web development from scratch with practical projects. Covers HTML, CSS, JavaScript, React, and Node.js.',
    short_description:
      'Learn full-stack web development from scratch with practical projects.',
    category: 'Workshop',
    event_start: '2024-05-16T10:00:00',
    event_end: '2024-05-16T16:00:00',
    venue: 'Seminar Hall',
    capacity: 100,
    registered_count: 85,
    banner_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
    organizer_id: 'org-1',
    organizer_name: 'Web Dev Club',
    registration_deadline: '2024-05-14T23:59:00',
    status: 'published',
    created_at: '2024-05-03T00:00:00',
  },
  {
    id: '4',
    title: 'UI/UX Design Sprint',
    description:
      'Design intuitive interfaces in this fast-paced sprint with real user problems. Learn design thinking and prototyping.',
    short_description:
      'Design intuitive interfaces in this fast-paced sprint with real user problems.',
    category: 'Workshop',
    event_start: '2024-05-20T09:00:00',
    event_end: '2024-05-20T13:00:00',
    venue: 'Design Studio',
    capacity: 100,
    registered_count: 65,
    banner_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    organizer_id: 'org-3',
    organizer_name: 'Design Club',
    registration_deadline: '2024-05-18T23:59:00',
    status: 'published',
    created_at: '2024-05-04T00:00:00',
  },
  {
    id: '5',
    title: 'Career Guidance Session',
    description:
      'Get expert advice on career paths, placements and skill building from industry professionals and campus placement cell.',
    short_description:
      'Get expert advice on career paths, placements and skill building.',
    category: 'Seminar',
    event_start: '2024-05-25T14:00:00',
    event_end: '2024-05-25T16:00:00',
    venue: 'Seminar Hall',
    capacity: 150,
    registered_count: 120,
    banner_url: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=250&fit=crop',
    organizer_id: 'org-4',
    organizer_name: 'Placement Cell',
    registration_deadline: '2024-05-23T23:59:00',
    status: 'published',
    created_at: '2024-05-05T00:00:00',
  },
  {
    id: '6',
    title: 'Cultural Fest 2K24',
    description:
      'A celebration of our culture with music, dance, and creative performances. A grand event showcasing diverse talents.',
    short_description:
      'A celebration of our culture with music, dance, and creative performances.',
    category: 'Cultural',
    event_start: '2024-05-30T18:00:00',
    event_end: '2024-05-31T22:00:00',
    venue: 'Open Auditorium',
    capacity: 500,
    registered_count: 300,
    banner_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=250&fit=crop',
    organizer_id: 'org-5',
    organizer_name: 'Cultural Committee',
    registration_deadline: '2024-05-28T23:59:00',
    status: 'published',
    created_at: '2024-05-06T00:00:00',
  },
  {
    id: '7',
    title: 'Cybersecurity Workshop',
    description:
      'Hands-on workshop on ethical hacking, network security and cyber awareness with live demos and CTF challenges.',
    short_description:
      'Hands-on workshop on ethical hacking, network security and cyber awareness.',
    category: 'Technical',
    event_start: '2024-06-05T10:00:00',
    event_end: '2024-06-05T14:00:00',
    venue: 'Computer Lab 2',
    capacity: 120,
    registered_count: 90,
    banner_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
    organizer_id: 'org-1',
    organizer_name: 'Cybersecurity Club',
    registration_deadline: '2024-06-03T23:59:00',
    status: 'published',
    created_at: '2024-05-07T00:00:00',
  },
  {
    id: '8',
    title: 'Robotics & Automation Expo',
    description:
      'Exhibition of innovative robotics projects and automation technologies developed by students across departments.',
    short_description:
      'Exhibition of innovative robotics projects and automation technologies.',
    category: 'Exhibition',
    event_start: '2024-06-08T11:00:00',
    event_end: '2024-06-08T16:00:00',
    venue: 'Main Auditorium Lobby',
    capacity: 250,
    registered_count: 210,
    banner_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
    organizer_id: 'org-6',
    organizer_name: 'Robotics Club',
    registration_deadline: '2024-06-06T23:59:00',
    status: 'published',
    created_at: '2024-05-08T00:00:00',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isSupabaseConfigured = (): boolean => {
  return (
    !!import.meta.env.VITE_SUPABASE_URL &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
};

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * GET /rest/v1/events?status=eq.published
 * Fetches all published events with optional category filter.
 */
export async function getPublishedEvents(params?: {
  category?: EventCategory | 'All';
  sort?: SortOption;
  search?: string;
}): Promise<Event[]> {
  // If Supabase isn't configured yet, return mock data
  if (!isSupabaseConfigured()) {
    let events = [...MOCK_EVENTS];
    if (params?.category && params.category !== 'All') {
      events = events.filter(e => e.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      events = events.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    if (params?.sort === 'most_registered') {
      events.sort((a, b) => b.registered_count - a.registered_count);
    } else if (params?.sort === 'most_available') {
      events.sort(
        (a, b) =>
          (a.capacity - a.registered_count) - (b.capacity - b.registered_count)
      );
    } else {
      // soonest first
      events.sort(
        (a, b) =>
          new Date(a.event_start).getTime() - new Date(b.event_start).getTime()
      );
    }
    return events;
  }

  // ── Supabase query ──────────────────────────────────────────────────────
  let query = supabase
    .from('events')
    .select(`
      id, title, description, short_description, category,
      event_start, event_end, venue, capacity, registered_count,
      banner_url, organizer_id, registration_deadline, status, created_at,
      users!organizer_id ( full_name )
    `)
    .eq('status', 'published');

  if (params?.category && params.category !== 'All') {
    query = query.eq('category', params.category);
  }

  if (params?.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,venue.ilike.%${params.search}%`
    );
  }

  if (params?.sort === 'most_registered') {
    query = query.order('registered_count', { ascending: false });
  } else if (params?.sort === 'most_available') {
    // sort by (capacity - registered_count) DESC
    query = query.order('registered_count', { ascending: true });
  } else {
    query = query.order('event_start', { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.error('[eventService] getPublishedEvents error:', error.message);
    throw new Error(error.message);
  }

  return (data as Event[]) ?? [];
}

/**
 * GET /rest/v1/events?id=eq.{id}
 * Fetches a single event by ID.
 */
export async function getEventById(id: string): Promise<Event | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.find(e => e.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from('events')
    .select(`
      id, title, description, short_description, category,
      event_start, event_end, venue, capacity, registered_count,
      banner_url, organizer_id, registration_deadline, status, created_at
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(error.message);
  }

  return data as Event;
}

/**
 * GET event registration count (for real-time updates)
 * Endpoint: Supabase RPC or count query on registrations table
 */
export async function getEventRegistrationCount(eventId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    const mock = MOCK_EVENTS.find(e => e.id === eventId);
    return mock?.registered_count ?? 0;
  }

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
 * Returns unsubscribe function.
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
