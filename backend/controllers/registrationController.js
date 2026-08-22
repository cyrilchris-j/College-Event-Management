import { supabaseAdmin } from '../config/supabase.js';

/**
 * POST /api/registrations (Atomic Student Registration via PostgreSQL RPC)
 */
export async function registerForEvent(req, res) {
  try {
    const studentId = req.user.id;
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({
        success: false,
        error: 'Event ID is required.',
      });
    }

    // Generate unique ticket code: CC-{EVENT_SHORT_ID}-{RANDOM}
    const ticketCode = `CC-${event_id.slice(0, 4).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`;

    // Execute atomic RPC procedure
    const { data: result, error: rpcError } = await supabaseAdmin.rpc(
      'register_student_for_event',
      {
        p_event_id: event_id,
        p_student_id: studentId,
        p_ticket_code: ticketCode,
      }
    );

    if (rpcError) {
      return res.status(400).json({
        success: false,
        error: rpcError.message,
      });
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registration confirmed!',
      registration_id: result.registration_id,
      ticket_code: result.ticket_code,
    });
  } catch (err) {
    console.error('[registerForEvent Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Registration failed due to server error.',
    });
  }
}

/**
 * GET /api/registrations/my (Get Logged-in Student Registrations)
 */
export async function getMyRegistrations(req, res) {
  try {
    const studentId = req.user.id;

    const { data: registrations, error } = await supabaseAdmin
      .from('registrations')
      .select(`
        id, event_id, student_id, ticket_code, qr_image_url, status, registered_at,
        events (
          id, title, category, event_start, event_end, venue, banner_url, organizer_club, status
        )
      `)
      .eq('student_id', studentId)
      .order('registered_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // Format registration objects with nested event
    const formatted = (registrations || []).map(r => ({
      ...r,
      event: r.events,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    console.error('[getMyRegistrations Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch your registrations.',
    });
  }
}

/**
 * GET /api/registrations/:id (Get Single Ticket by ID)
 */
export async function getRegistrationById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: registration, error } = await supabaseAdmin
      .from('registrations')
      .select(`
        id, event_id, student_id, ticket_code, qr_image_url, status, registered_at,
        events (
          id, title, category, event_start, event_end, venue, banner_url, organizer_club, capacity, status
        )
      `)
      .eq('id', id)
      .single();

    if (error || !registration) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found.',
      });
    }

    // Check permission: student must own it or user must be organizer/admin
    if (registration.student_id !== userId && req.profile.role === 'student') {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view this ticket.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...registration,
        event: registration.events,
      },
    });
  } catch (err) {
    console.error('[getRegistrationById Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch ticket details.',
    });
  }
}

/**
 * POST /api/registrations/:id/cancel (Cancel Registration)
 */
export async function cancelRegistration(req, res) {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const { data: updated, error } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error || !updated) {
      return res.status(400).json({
        success: false,
        error: 'Unable to cancel registration.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully.',
    });
  } catch (err) {
    console.error('[cancelRegistration Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to cancel registration.',
    });
  }
}
