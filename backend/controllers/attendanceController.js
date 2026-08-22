import { supabaseAdmin } from '../config/supabase.js';

/**
 * POST /api/attendance/scan (Student Scans Hall QR Code)
 */
export async function verifyHallAttendance(req, res) {
  try {
    const studentId = req.user.id;
    const { token_hash } = req.body;

    if (!token_hash) {
      return res.status(400).json({
        success: false,
        error: 'Hall QR session token is required.',
      });
    }

    // Call stored procedure: verify_hall_qr_attendance(p_student_id, p_token_hash)
    const { data: result, error: rpcError } = await supabaseAdmin.rpc(
      'verify_hall_qr_attendance',
      {
        p_student_id: studentId,
        p_token_hash: token_hash,
      }
    );

    if (rpcError) {
      return res.status(400).json({
        success: false,
        error: rpcError.message,
      });
    }

    if (!result.success && result.state !== 'already_checked_in') {
      return res.status(400).json({
        success: false,
        state: result.state,
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      state: result.state,
      message: result.message,
      checked_in_at: result.checked_in_at,
    });
  } catch (err) {
    console.error('[verifyHallAttendance Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Attendance verification failed.',
    });
  }
}

/**
 * POST /api/attendance/manual (Organiser Manual Verification by Ticket Code / Student ID)
 */
export async function manualAttendanceVerification(req, res) {
  try {
    const organizerId = req.user.id;
    const { event_id, ticket_code, student_id } = req.body;

    if (!event_id || (!ticket_code && !student_id)) {
      return res.status(400).json({
        success: false,
        error: 'Event ID and either Ticket Code or Student ID are required.',
      });
    }

    // Find registration
    let query = supabaseAdmin
      .from('registrations')
      .select('id, event_id, student_id, ticket_code, status')
      .eq('event_id', event_id);

    if (ticket_code) {
      query = query.eq('ticket_code', ticket_code.trim().toUpperCase());
    } else if (student_id) {
      // Find student profile by student_id
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('student_id', student_id.trim().toUpperCase())
        .single();

      if (!profile) {
        return res.status(404).json({ success: false, error: 'Student ID not found.' });
      }
      query = query.eq('student_id', profile.id);
    }

    const { data: registration, error: regError } = await query.single();

    if (regError || !registration) {
      return res.status(404).json({
        success: false,
        error: 'Attendee registration not found for this event.',
      });
    }

    // Check if already attended
    const { data: existingAttendance } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('registration_id', registration.id)
      .maybeSingle();

    if (existingAttendance) {
      return res.status(200).json({
        success: true,
        state: 'already_checked_in',
        message: 'Attendee is already checked in.',
        checked_in_at: existingAttendance.checked_in_at,
      });
    }

    // Create attendance record
    const { data: newAttendance, error: attError } = await supabaseAdmin
      .from('attendance')
      .insert({
        registration_id: registration.id,
        verified_by: organizerId,
      })
      .select()
      .single();

    if (attError) {
      return res.status(400).json({ success: false, error: attError.message });
    }

    // Update registration status
    await supabaseAdmin
      .from('registrations')
      .update({ status: 'attended' })
      .eq('id', registration.id);

    return res.status(200).json({
      success: true,
      state: 'success',
      message: 'Attendance verified manually!',
      checked_in_at: newAttendance.checked_in_at,
    });
  } catch (err) {
    console.error('[manualAttendanceVerification Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Manual verification failed.',
    });
  }
}
