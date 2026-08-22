import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * Middleware: Verifies Supabase Bearer JWT and attaches req.user and req.profile
 */
export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Missing or invalid Authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Validate JWT via Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token.',
      });
    }

    // Fetch user profile (role, student_id)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, student_id, created_at')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found.',
      });
    }

    req.user = user;
    req.profile = profile;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed due to server error.',
    });
  }
}

/**
 * Middleware: Enforces user role (e.g. ['admin', 'organizer'])
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.profile || !allowedRoles.includes(req.profile.role)) {
      return res.status(403).json({
        success: false,
        error: `Permission denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.profile?.role || 'none'}`,
      });
    }
    next();
  };
}
