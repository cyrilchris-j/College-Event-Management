-- ====================================================================
-- CampusConnect Database Schema Migration
-- Problem Statement: RWW-8 (Campus Event Management & Registration Portal)
-- Database: PostgreSQL / Supabase
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABLES DEFINITIONS
-- ====================================================================

-- 2.1 PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'organizer', 'admin')),
    student_id TEXT UNIQUE, -- Format: CCS-YYYY-XXXXX (for students)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_staff_email_domain CHECK (role = 'student' OR email LIKE '%@ksrce.ac.in')
);

-- 2.2 STUDENT PROFILES TABLE (Academic identity & student details)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    year_of_study INT NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 EVENTS TABLE (Event lifecycle & details)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    organizer_club TEXT,
    title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 160),
    short_description TEXT,
    description TEXT NOT NULL CHECK (char_length(description) >= 20),
    category TEXT NOT NULL CHECK (category IN ('Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other')),
    event_start TIMESTAMPTZ NOT NULL,
    event_end TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    banner_url TEXT, -- References event-banners storage bucket
    registration_deadline TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 REGISTRATIONS TABLE (Event bookings & digital tickets)
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ticket_code TEXT UNIQUE NOT NULL, -- Format: CC-{EVENT_SHORT_ID}-{RANDOM}
    qr_image_url TEXT, -- References event-qr storage bucket
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
    email_sent BOOLEAN NOT NULL DEFAULT false,
    email_sent_at TIMESTAMPTZ,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_event_student_registration UNIQUE (event_id, student_id)
);

-- 2.5 HALL QR SESSIONS TABLE (Signed venue projector attendance sessions)
CREATE TABLE IF NOT EXISTS public.hall_qr_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    hall_name TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL, -- Cryptographic signed session hash
    qr_image_url TEXT, -- References event-qr storage bucket
    valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 ATTENDANCE TABLE (Idempotent venue entry check-in records)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID UNIQUE NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    hall_qr_session_id UUID REFERENCES public.hall_qr_sessions(id) ON DELETE SET NULL,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL if self-scanned by student
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 EMAIL NOTIFICATIONS TABLE (Transactional email queue & delivery audit)
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('student', 'faculty_organizer')),
    notification_type TEXT NOT NULL CHECK (notification_type IN ('registration_confirmation', 'faculty_alert', 'attendance_confirmation')),
    subject TEXT NOT NULL,
    template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- 3. INDEXES FOR HIGH-SPEED LOOKUPS & CONCURRENCY
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_events_status_start ON public.events(status, event_start);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON public.registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_code ON public.registrations(ticket_code);
CREATE INDEX IF NOT EXISTS idx_hall_qr_token ON public.hall_qr_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_attendance_registration ON public.attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON public.email_notifications(status);

-- ====================================================================
-- 4. SUPABASE STORAGE BUCKETS CONFIGURATION
-- ====================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('event-banners', 'event-banners', true),
  ('event-qr', 'event-qr', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ====================================================================
-- 5. TRIGGERS & PROCEDURES
-- ====================================================================

-- 5.1 Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER tr_student_profiles_updated_at
    BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_events_updated_at ON public.events;
CREATE TRIGGER tr_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5.2 Auto-create profile upon Supabase Auth sign-up
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role TEXT;
    assigned_student_id TEXT;
BEGIN
    assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    
    IF assigned_role = 'student' THEN
        assigned_student_id := COALESCE(
            NEW.raw_user_meta_data->>'student_id',
            'CCS-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0')
        );
    ELSE
        assigned_student_id := NULL;
    END IF;

    INSERT INTO public.profiles (id, email, role, student_id, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        assigned_role,
        assigned_student_id,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        student_id = COALESCE(profiles.student_id, EXCLUDED.student_id),
        updated_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ====================================================================
-- 6. STORED PROCEDURES (Atomic Booking & QR Attendance)
-- ====================================================================

-- 6.1 Atomic Student Event Registration
CREATE OR REPLACE FUNCTION public.register_student_for_event(
    p_event_id UUID,
    p_student_id UUID,
    p_ticket_code TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_event RECORD;
    v_current_count INT;
    v_existing_reg RECORD;
    v_new_reg RECORD;
    v_student_profile RECORD;
    v_organizer_profile RECORD;
BEGIN
    -- 1. Lock event row for atomic check
    SELECT * INTO v_event FROM public.events WHERE id = p_event_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event not found.');
    END IF;

    IF v_event.status != 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Registration is closed for this event.');
    END IF;

    IF now() > v_event.registration_deadline THEN
        RETURN jsonb_build_object('success', false, 'error', 'Registration deadline has passed.');
    END IF;

    -- 2. Check for duplicate registration
    SELECT * INTO v_existing_reg FROM public.registrations 
    WHERE event_id = p_event_id AND student_id = p_student_id;

    IF FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'You are already registered for this event.');
    END IF;

    -- 3. Check capacity limit
    SELECT COUNT(*) INTO v_current_count FROM public.registrations 
    WHERE event_id = p_event_id AND status != 'cancelled';

    IF v_current_count >= v_event.capacity THEN
        RETURN jsonb_build_object('success', false, 'error', 'Event has reached maximum capacity.');
    END IF;

    -- 4. Create registration
    INSERT INTO public.registrations (event_id, student_id, ticket_code, status, registered_at)
    VALUES (p_event_id, p_student_id, p_ticket_code, 'registered', now())
    RETURNING * INTO v_new_reg;

    -- 5. Queue confirmation email to student
    SELECT * INTO v_student_profile FROM public.student_profiles WHERE user_id = p_student_id;
    SELECT * INTO v_organizer_profile FROM public.profiles WHERE id = v_event.organizer_id;

    INSERT INTO public.email_notifications (
        registration_id,
        event_id,
        recipient_email,
        recipient_name,
        recipient_type,
        notification_type,
        subject,
        template_data,
        status
    )
    VALUES (
        v_new_reg.id,
        p_event_id,
        (SELECT email FROM public.profiles WHERE id = p_student_id),
        COALESCE(v_student_profile.full_name, 'Student Attendee'),
        'student',
        'registration_confirmation',
        'Your Registration Pass for ' || v_event.title,
        jsonb_build_object(
            'ticket_code', p_ticket_code,
            'event_title', v_event.title,
            'venue', v_event.venue,
            'event_start', v_event.event_start,
            'student_name', COALESCE(v_student_profile.full_name, 'Student'),
            'scan_url', '/attendance/scan',
            'ticket_url', '/ticket/' || v_new_reg.id
        ),
        'pending'
    );

    -- 6. Queue notification alert to faculty / organizer
    IF v_organizer_profile.email IS NOT NULL THEN
        INSERT INTO public.email_notifications (
            registration_id,
            event_id,
            recipient_email,
            recipient_name,
            recipient_type,
            notification_type,
            subject,
            template_data,
            status
        )
        VALUES (
            v_new_reg.id,
            p_event_id,
            v_organizer_profile.email,
            'Event Organiser',
            'faculty_organizer',
            'faculty_alert',
            'New Attendee Registered: ' || v_event.title,
            jsonb_build_object(
                'event_title', v_event.title,
                'current_registrations', v_current_count + 1,
                'capacity', v_event.capacity,
                'student_name', COALESCE(v_student_profile.full_name, 'Student Attendee'),
                'ticket_code', p_ticket_code
            ),
            'pending'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'registration_id', v_new_reg.id,
        'ticket_code', p_ticket_code,
        'message', 'Registration confirmed!'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.2 Idempotent Hall QR Attendance Verification
CREATE OR REPLACE FUNCTION public.verify_hall_qr_attendance(
    p_student_id UUID,
    p_token_hash TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_session RECORD;
    v_registration RECORD;
    v_attendance RECORD;
BEGIN
    -- 1. Validate active QR session
    SELECT * INTO v_session FROM public.hall_qr_sessions 
    WHERE token_hash = p_token_hash AND is_active = true;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'state', 'invalid', 'error', 'Invalid or expired Hall QR session.');
    END IF;

    -- 2. Verify student registration for this specific event
    SELECT * INTO v_registration FROM public.registrations 
    WHERE event_id = v_session.event_id AND student_id = p_student_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'state', 'mismatch', 'error', 'You are not registered for the event in this hall.');
    END IF;

    -- 3. Check if already checked in (Idempotency)
    SELECT * INTO v_attendance FROM public.attendance 
    WHERE registration_id = v_registration.id;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'state', 'already_checked_in',
            'message', 'Attendance was already recorded.',
            'checked_in_at', v_attendance.checked_in_at
        );
    END IF;

    -- 4. Record new attendance
    INSERT INTO public.attendance (registration_id, hall_qr_session_id, checked_in_at)
    VALUES (v_registration.id, v_session.id, now())
    RETURNING * INTO v_attendance;

    UPDATE public.registrations 
    SET status = 'attended' 
    WHERE id = v_registration.id;

    RETURN jsonb_build_object(
        'success', true,
        'state', 'success',
        'message', 'Attendance confirmed!',
        'checked_in_at', v_attendance.checked_in_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 7. ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_qr_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- 7.1 PROFILES POLICIES
CREATE POLICY "Public Profiles Read" ON public.profiles
    FOR SELECT TO public USING (true);

CREATE POLICY "Users Update Own Profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 7.2 STUDENT PROFILES POLICIES
CREATE POLICY "Students Read Own Profile" ON public.student_profiles
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Students Insert/Update Own Profile" ON public.student_profiles
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Organizers Read Registered Student Profiles" ON public.student_profiles
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.registrations r
            JOIN public.events e ON e.id = r.event_id
            WHERE r.student_id = student_profiles.user_id 
              AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- 7.3 EVENTS POLICIES
CREATE POLICY "Public Read Published Events" ON public.events
    FOR SELECT TO public USING (status = 'published' OR organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Organizers/Admins Insert Events" ON public.events
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('organizer', 'admin'))
    );

CREATE POLICY "Organizers/Admins Update Events" ON public.events
    FOR UPDATE TO authenticated USING (
        organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 7.4 REGISTRATIONS POLICIES
CREATE POLICY "Students Read Own Registrations" ON public.registrations
    FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Organizers Read Event Registrations" ON public.registrations
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = registrations.event_id 
              AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

CREATE POLICY "Students Insert Registrations" ON public.registrations
    FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

-- 7.5 HALL QR SESSIONS POLICIES
CREATE POLICY "Public/Students Read Active Hall QR" ON public.hall_qr_sessions
    FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Organizers Manage Hall QR" ON public.hall_qr_sessions
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.events e 
            WHERE e.id = hall_qr_sessions.event_id 
              AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- 7.6 ATTENDANCE POLICIES
CREATE POLICY "Students View Own Attendance" ON public.attendance
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.registrations r 
            WHERE r.id = attendance.registration_id AND r.student_id = auth.uid()
        )
    );

CREATE POLICY "Organizers View Event Attendance" ON public.attendance
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.registrations r
            JOIN public.events e ON e.id = r.event_id
            WHERE r.id = attendance.registration_id 
              AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

CREATE POLICY "Organizers Insert Attendance" ON public.attendance
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.registrations r
            JOIN public.events e ON e.id = r.event_id
            WHERE r.id = attendance.registration_id 
              AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- 7.7 EMAIL NOTIFICATIONS POLICIES
CREATE POLICY "Organizers View Event Notifications" ON public.email_notifications
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.events e 
            WHERE e.id = email_notifications.event_id 
              AND (e.organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- 7.8 STORAGE OBJECTS RLS POLICIES
CREATE POLICY "Public Read Event Banners" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'event-banners');

CREATE POLICY "Public Read Event QR" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'event-qr');

CREATE POLICY "Authenticated Upload Event Banners" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-banners');

CREATE POLICY "Authenticated Upload Event QR" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-qr');
