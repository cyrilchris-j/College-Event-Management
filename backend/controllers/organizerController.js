import { supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/organizer/events (Organizer's Events with live stats)
 */
export async function getOrganizerEvents(req, res) {
  try {
    const organizerId = req.user.id;
    const userRole = req.profile.role;

    let query = supabaseAdmin
      .from('events')
      .select(`
        id, organizer_id, organizer_club, title, short_description, description,
        category, event_start, event_end, venue, capacity, banner_url,
        registration_deadline, status, entry_fee, is_paid, gpay_number, gpay_upi_id,
        created_at, updated_at,
        registrations (id, status, payment_status)
      `);

    // If organizer, filter by organizer_id; if admin, can view all
    if (userRole !== 'admin') {
      query = query.eq('organizer_id', organizerId);
    }

    query = query.order('created_at', { ascending: false });

    const { data: events, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // Format events with registration count, attended count, and revenue
    const formattedEvents = (events || []).map(event => {
      const allRegs = event.registrations || [];
      const activeRegs = allRegs.filter(r => r.status !== 'cancelled');
      const registeredCount = activeRegs.length;
      const attendedCount = allRegs.filter(r => r.status === 'attended').length;
      const capacity = event.capacity || 1;
      const percentage = Math.round((registeredCount / capacity) * 100);
      const totalRevenue = event.is_paid
        ? activeRegs.filter(r => r.payment_status === 'verified').length * (event.entry_fee || 0)
        : 0;

      return {
        ...event,
        registered_count: registeredCount,
        attended_count: attendedCount,
        registration_percentage: percentage,
        total_revenue: totalRevenue,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedEvents.length,
      data: formattedEvents,
    });
  } catch (err) {
    console.error('[getOrganizerEvents Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch organizer events.',
    });
  }
}

/**
 * POST /api/organizer/events (Create Event)
 */
export async function createOrganizerEvent(req, res) {
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
      entry_fee = 0,
      is_paid = false,
      gpay_number = '9876543210',
      gpay_upi_id = 'campusconnect@upi',
      status = 'published',
    } = req.body;

    if (!title || !category || !event_start || !venue || !capacity) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required event details.',
      });
    }

    const { data: newEvent, error } = await supabaseAdmin
      .from('events')
      .insert({
        organizer_id: organizerId,
        organizer_club: organizer_club || 'Campus Organization',
        title: title.trim(),
        short_description: short_description ? short_description.trim() : description.slice(0, 140),
        description: description.trim(),
        category,
        event_start,
        event_end: event_end || event_start,
        venue: venue.trim(),
        capacity: parseInt(capacity, 10),
        banner_url: banner_url || null,
        registration_deadline: registration_deadline || event_start,
        entry_fee: parseFloat(entry_fee) || 0,
        is_paid: Boolean(is_paid || parseFloat(entry_fee) > 0),
        gpay_number: gpay_number || '9876543210',
        gpay_upi_id: gpay_upi_id || 'campusconnect@upi',
        status,
      })
      .select()
      .single();

    if (error || !newEvent) {
      return res.status(400).json({ success: false, error: error?.message || 'Failed to create event.' });
    }

    // Auto-create hall QR session token for checking in
    const sessionToken = `HQR-${newEvent.id.slice(0, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    await supabaseAdmin
      .from('hall_qr_sessions')
      .insert({
        event_id: newEvent.id,
        created_by: organizerId,
        hall_name: venue.trim(),
        token_hash: sessionToken,
        valid_from: event_start,
        valid_until: event_end || event_start,
        is_active: true,
      });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: {
        ...newEvent,
        qr_session_token: sessionToken,
      },
    });
  } catch (err) {
    console.error('[createOrganizerEvent Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create event.',
    });
  }
}

/**
 * PUT /api/organizer/events/:id (Update Event Details & Status)
 */
export async function updateOrganizerEvent(req, res) {
  try {
    const organizerId = req.user?.id;
    const userRole = req.profile?.role;
    const { id } = req.params;

    const allowedColumns = [
      'title',
      'short_description',
      'description',
      'category',
      'event_start',
      'event_end',
      'venue',
      'capacity',
      'banner_url',
      'registration_deadline',
      'status',
      'entry_fee',
      'is_paid',
      'gpay_number',
      'gpay_upi_id',
      'organizer_club'
    ];

    const sanitizedUpdates = {};
    for (const key of Object.keys(req.body || {})) {
      if (allowedColumns.includes(key) && req.body[key] !== undefined) {
        sanitizedUpdates[key] = req.body[key];
      }
    }
    sanitizedUpdates.updated_at = new Date().toISOString();

    let query = supabaseAdmin
      .from('events')
      .update(sanitizedUpdates)
      .eq('id', id);

    if (userRole !== 'admin' && organizerId) {
      query = query.eq('organizer_id', organizerId);
    }

    const { data: updatedEvent, error } = await query.select().single();

    if (error || !updatedEvent) {
      return res.status(400).json({
        success: false,
        error: error?.message || 'Unable to update event.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: updatedEvent,
    });
  } catch (err) {
    console.error('[updateOrganizerEvent Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update event.',
    });
  }
}

/**
 * DELETE /api/organizer/events/:id (Delete / Cancel Event)
 */
export async function deleteOrganizerEvent(req, res) {
  try {
    const organizerId = req.user.id;
    const userRole = req.profile.role;
    const { id } = req.params;

    let query = supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (userRole !== 'admin') {
      query = query.eq('organizer_id', organizerId);
    }

    const { error } = await query;

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (err) {
    console.error('[deleteOrganizerEvent Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete event.',
    });
  }
}

/**
 * GET /api/organizer/registrations (List student registrations with academic profiles)
 */
export async function getOrganizerRegistrations(req, res) {
  try {
    const organizerId = req.user.id;
    const userRole = req.profile.role;
    const { event_id } = req.query;

    let query = supabaseAdmin
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

    if (event_id) {
      query = query.eq('event_id', event_id);
    }

    const { data: registrations, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    // Filter by organizer's events if not admin
    const filtered = (registrations || []).filter(r => {
      if (userRole === 'admin') return true;
      return r.events?.organizer_id === organizerId;
    });

    // Fetch student academic profiles
    const studentUserIds = [...new Set(filtered.map(r => r.student_id))];
    const { data: studentProfiles } = await supabaseAdmin
      .from('student_profiles')
      .select('user_id, full_name, roll_number, department, year_of_study, phone')
      .in('user_id', studentUserIds);

    const profileMap = new Map((studentProfiles || []).map(p => [p.user_id, p]));

    const formatted = filtered.map(r => {
      const p = profileMap.get(r.student_id);
      return {
        id: r.id,
        event_id: r.event_id,
        event_title: r.events?.title || 'Unknown Event',
        event_category: r.events?.category,
        student_id: r.student_id,
        ticket_code: r.ticket_code,
        student_name: p?.full_name || 'Student',
        roll_number: p?.roll_number || 'N/A',
        department: p?.department || 'General',
        year_of_study: p?.year_of_study || 1,
        phone: p?.phone || 'N/A',
        status: r.status,
        payment_mode: r.payment_mode,
        payment_proof_url: r.payment_proof_url,
        payment_status: r.payment_status,
        registered_at: r.registered_at,
        is_attended: Boolean(r.attendance && r.attendance.length > 0) || r.status === 'attended',
        checked_in_at: r.attendance?.[0]?.checked_in_at || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    console.error('[getOrganizerRegistrations Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations.',
    });
  }
}

/**
 * PATCH /api/organizer/registrations/:id/verify-payment (Approve or Reject payment proof)
 */
export async function verifyRegistrationPayment(req, res) {
  try {
    const { id } = req.params;
    const { payment_status } = req.body; // 'verified' | 'rejected'

    if (!['verified', 'rejected', 'pending_verification'].includes(payment_status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment status.',
      });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('registrations')
      .update({ payment_status })
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      return res.status(400).json({ success: false, error: error?.message || 'Update failed.' });
    }

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${payment_status}.`,
      data: updated,
    });
  } catch (err) {
    console.error('[verifyRegistrationPayment Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update payment status.',
    });
  }
}

/**
 * GET /api/organizer/reports (Aggregate Analytics)
 */
export async function getOrganizerReports(req, res) {
  try {
    const organizerId = req.user.id;
    const userRole = req.profile.role;

    // 1. Fetch events
    let eventQuery = supabaseAdmin
      .from('events')
      .select('id, title, category, capacity, entry_fee, is_paid, status, created_at');

    if (userRole !== 'admin') {
      eventQuery = eventQuery.eq('organizer_id', organizerId);
    }

    const { data: events } = await eventQuery;
    const eventIds = (events || []).map(e => e.id);

    // 2. Fetch registrations for these events
    const { data: registrations } = await supabaseAdmin
      .from('registrations')
      .select('id, event_id, student_id, status, payment_status, registered_at')
      .in('event_id', eventIds.length > 0 ? eventIds : ['00000000-0000-0000-0000-000000000000']);

    // 3. Fetch attendance
    const regIds = (registrations || []).map(r => r.id);
    const { data: attendance } = await supabaseAdmin
      .from('attendance')
      .select('id, registration_id, checked_in_at')
      .in('registration_id', regIds.length > 0 ? regIds : ['00000000-0000-0000-0000-000000000000']);

    const totalEvents = (events || []).length;
    const activeRegistrations = (registrations || []).filter(r => r.status !== 'cancelled');
    const totalRegistrations = activeRegistrations.length;
    const totalAttended = (attendance || []).length;
    const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 0;

    // Calculate revenue
    let totalRevenue = 0;
    const eventFeeMap = new Map((events || []).map(e => [e.id, e.entry_fee || 0]));
    activeRegistrations.forEach(r => {
      if (r.payment_status === 'verified') {
        totalRevenue += eventFeeMap.get(r.event_id) || 0;
      }
    });

    // Category breakdown
    const categoryCounts = {};
    (events || []).forEach(e => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalEvents,
        totalRegistrations,
        totalAttended,
        attendanceRate,
        totalRevenue,
        categoryBreakdown: categoryCounts,
        recentEvents: (events || []).slice(0, 5),
      },
    });
  } catch (err) {
    console.error('[getOrganizerReports Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate reports.',
    });
  }
}
