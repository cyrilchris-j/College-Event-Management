import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * POST /api/auth/register (Student Account & Academic Profile Creation)
 */
export async function registerStudent(req, res) {
  try {
    const { email, password, full_name, roll_number, department, year_of_study, phone } = req.body;

    if (!email || !password || !full_name || !roll_number || !department || !year_of_study) {
      return res.status(400).json({
        success: false,
        error: 'Missing required registration fields.',
      });
    }

    // 1. Create user in Supabase Auth with student role
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'student',
          full_name,
        },
      },
    });

    if (authError || !authData.user) {
      return res.status(400).json({
        success: false,
        error: authError?.message || 'Failed to create student authentication account.',
      });
    }

    const userId = authData.user.id;

    // 2. Insert Student Academic Profile
    const { data: studentProfile, error: profileError } = await supabaseAdmin
      .from('student_profiles')
      .insert({
        user_id: userId,
        full_name,
        roll_number,
        department,
        year_of_study: parseInt(year_of_study, 10),
        phone: phone || null,
      })
      .select()
      .single();

    if (profileError) {
      console.error('[authController] student_profiles insert error:', profileError);
    }

    // 3. Fetch newly synchronized profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role, student_id, created_at')
      .eq('id', userId)
      .single();

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      user: profile,
      profile: studentProfile,
      session: authData.session,
    });
  } catch (err) {
    console.error('[registerStudent Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Registration failed due to internal server error.',
    });
  }
}

/**
 * POST /api/auth/login (Unified Sign-in for Admin, Organiser, Student)
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({
        success: false,
        error: authError?.message || 'Invalid email or password.',
      });
    }

    const userId = authData.user.id;

    // Fetch user profile and student academic profile if applicable
    const [profileRes, studentProfileRes] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('id, email, role, student_id, created_at')
        .eq('id', userId)
        .single(),
      supabaseAdmin
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: profileRes.data,
      profile: studentProfileRes.data,
      session: authData.session,
    });
  } catch (err) {
    console.error('[login Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Login failed due to internal server error.',
    });
  }
}

/**
 * GET /api/auth/me (Get Authenticated User Profile)
 */
export async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const [profileRes, studentProfileRes] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('id, email, role, student_id, created_at')
        .eq('id', userId)
        .single(),
      supabaseAdmin
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

    return res.status(200).json({
      success: true,
      user: profileRes.data,
      profile: studentProfileRes.data,
    });
  } catch (err) {
    console.error('[getMe Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile.',
    });
  }
}
