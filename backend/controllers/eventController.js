import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/events (Public list of events with search, category filtering & registration counts)
 */
export async function getEvents(req, res) {
  try {
    const { category, search, sort } = req.query;

    let query = supabaseAdmin
      .from('events')
      .select(`
        id, organizer_id, organizer_club, title, short_description, description,
        category, event_start, event_end, venue, capacity, banner_url,
        registration_deadline, status, created_at, updated_at,
        registrations (count)
      `)
      .eq('status', 'published');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,venue.ilike.%${search}%,organizer_club.ilike.%${search}%`
      );
    }

    if (sort === 'soonest') {
      query = query.order('event_start', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: events, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // Format registered_count and remaining percentage
    const formattedEvents = (events || []).map(event => {
      const registeredCount = event.registrations?.[0]?.count || 0;
      const capacity = event.capacity || 1;
      const percentage = Math.round((registeredCount / capacity) * 100);

      let registrationStatus = 'open';
      if (registeredCount >= capacity) {
        registrationStatus = 'full';
      } else if (percentage >= 80) {
        registrationStatus = 'almost_full';
      } else if (new Date() > new Date(event.registration_deadline)) {
        registrationStatus = 'closed';
      }

      return {
        ...event,
        registered_count: registeredCount,
        registration_percentage: percentage,
        registration_status: registrationStatus,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedEvents.length,
      data: formattedEvents,
    });
  } catch (err) {
    console.error('[getEvents Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch events.',
    });
  }
}

/**
 * GET /api/events/:id (Public Event Details)
 */
export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .select(`
        id, organizer_id, organizer_club, title, short_description, description,
        category, event_start, event_end, venue, capacity, banner_url,
        registration_deadline, status, created_at, updated_at,
        registrations (count)
      `)
      .eq('id', id)
      .single();

    if (error || !event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found.',
      });
    }

    const registeredCount = event.registrations?.[0]?.count || 0;
    const capacity = event.capacity || 1;
    const percentage = Math.round((registeredCount / capacity) * 100);

    let registrationStatus = 'open';
    if (registeredCount >= capacity) {
      registrationStatus = 'full';
    } else if (percentage >= 80) {
      registrationStatus = 'almost_full';
    } else if (new Date() > new Date(event.registration_deadline)) {
      registrationStatus = 'closed';
    }

    return res.status(200).json({
      success: true,
      data: {
        ...event,
        registered_count: registeredCount,
        registration_percentage: percentage,
        registration_status: registrationStatus,
      },
    });
  } catch (err) {
    console.error('[getEventById Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch event details.',
    });
  }
}

/**
 * POST /api/events (Organizer / Admin Create Event)
 */
export async function createEvent(req, res) {
  try {
    const organizerId = req.user.id;
    const {
      title,
      short_description,
      description,
      category,
      event_start,
      event_end,
      venue,
      capacity,
      banner_url,
      registration_deadline,
      organizer_club,
    } = req.body;

    const { data: newEvent, error } = await supabaseAdmin
      .from('events')
      .insert({
        organizer_id: organizerId,
        organizer_club: organizer_club || 'Campus Organization',
        title,
        short_description,
        description,
        category,
        event_start,
        event_end: event_end || event_start,
        venue,
        capacity: parseInt(capacity, 10),
        banner_url: banner_url || null,
        registration_deadline,
        status: 'published',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: newEvent,
    });
  } catch (err) {
    console.error('[createEvent Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create event.',
    });
  }
}
