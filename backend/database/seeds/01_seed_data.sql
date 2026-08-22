-- ====================================================================
-- CampusConnect Demo Seed Data Script
-- Populates demo users (Admin, Organisers, Student), sample events,
-- tickets, and Hall QR sessions for demonstration.
-- Enforces @ksrce.ac.in domain for all admin and organiser accounts.
-- ====================================================================

DO $$
DECLARE
    v_admin_id UUID := '11111111-0000-0000-0000-000000000001'::uuid;
    v_org1_id  UUID := '22222222-0000-0000-0000-000000000001'::uuid;
    v_org2_id  UUID := '22222222-0000-0000-0000-000000000002'::uuid;
    v_stu1_id  UUID := '33333333-0000-0000-0000-000000000001'::uuid;
    
    v_evt1_id  UUID := '44444444-0000-0000-0000-000000000001'::uuid;
    v_evt2_id  UUID := '44444444-0000-0000-0000-000000000002'::uuid;
    v_evt3_id  UUID := '44444444-0000-0000-0000-000000000003'::uuid;

    v_reg1_id  UUID := '55555555-0000-0000-0000-000000000001'::uuid;
    v_hall1_id UUID := '66666666-0000-0000-0000-000000000001'::uuid;
BEGIN
    -- 1.1 Admin User (@ksrce.ac.in, password: Campus@123)
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
    VALUES (
        v_admin_id,
        '00000000-0000-0000-0000-000000000000',
        'admin@ksrce.ac.in',
        crypt('Campus@123', gen_salt('bf')),
        now(),
        '{"role": "admin"}'::jsonb,
        'authenticated',
        'authenticated',
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET email = 'admin@ksrce.ac.in';

    -- 1.2 Organiser 1 (ACM Club Lead @ksrce.ac.in, password: Campus@123)
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
    VALUES (
        v_org1_id,
        '00000000-0000-0000-0000-000000000000',
        'acm.lead@ksrce.ac.in',
        crypt('Campus@123', gen_salt('bf')),
        now(),
        '{"role": "organizer"}'::jsonb,
        'authenticated',
        'authenticated',
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET email = 'acm.lead@ksrce.ac.in';

    -- 1.3 Organiser 2 (Cultural Secretary @ksrce.ac.in, password: Campus@123)
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
    VALUES (
        v_org2_id,
        '00000000-0000-0000-0000-000000000000',
        'cultural.sec@ksrce.ac.in',
        crypt('Campus@123', gen_salt('bf')),
        now(),
        '{"role": "organizer"}'::jsonb,
        'authenticated',
        'authenticated',
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET email = 'cultural.sec@ksrce.ac.in';

    -- 1.4 Student User (password: Campus@123)
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
    VALUES (
        v_stu1_id,
        '00000000-0000-0000-0000-000000000000',
        'alex.chen@student.college.edu',
        crypt('Campus@123', gen_salt('bf')),
        now(),
        '{"role": "student", "student_id": "CCS-2026-10492"}'::jsonb,
        'authenticated',
        'authenticated',
        now(),
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Insert Student Academic Profile
    INSERT INTO public.student_profiles (user_id, full_name, roll_number, department, year_of_study, phone)
    VALUES (
        v_stu1_id,
        'Alex Chen',
        '73152413001',
        'Computer Science & Engineering',
        3,
        '+91 98765 43210'
    ) ON CONFLICT (user_id) DO NOTHING;

    -- 3. Insert Sample Events
    INSERT INTO public.events (id, organizer_id, organizer_club, title, short_description, description, category, event_start, event_end, venue, capacity, banner_url, registration_deadline, status)
    VALUES 
    (
        v_evt1_id,
        v_org1_id,
        'ACM Student Chapter',
        'Autonomous AI & LLM Systems Workshop',
        'Hands-on bootcamp building agentic reasoning workflows with Gemini 2.0 and TypeScript.',
        'Join us for an intensive 4-hour deep dive into modern Agentic Workflows. Participants will build multi-step reasoning agents, integrate custom tools via Model Context Protocol (MCP), and deploy autonomous assistants. Laptop required.',
        'Workshop',
        now() + interval '2 days',
        now() + interval '2 days 4 hours',
        'Seminar Hall 3, Tech Block A',
        60,
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        now() + interval '1 day 12 hours',
        'published'
    ),
    (
        v_evt2_id,
        v_org1_id,
        'Google Developer Student Clubs',
        'HackCampus 2026 — 24-Hour Hackathon',
        'Annual campus flagship hackathon solving real-world challenges in healthcare, education, and sustainability.',
        'HackCampus 2026 brings together the brightest student developers, designers, and innovators. Compete for cash prizes, cloud credits, and mentorship from industry leaders over an exhilarating 24 hours of innovation.',
        'Technical',
        now() + interval '5 days',
        now() + interval '6 days',
        'Auditorium Main Hall',
        120,
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
        now() + interval '4 days',
        'published'
    ),
    (
        v_evt3_id,
        v_org2_id,
        'Fine Arts & Cultural Council',
        'Rhapsody 2026 — Inter-Department Cultural Fest',
        'An electrifying evening of acoustic music, battle of the bands, dance showcases, and live drama.',
        'Experience the grandest cultural night of the semester! Witness electrifying performances by student bands, departmental drama troupes, and classical fusion dance teams.',
        'Cultural',
        now() + interval '7 days',
        now() + interval '7 days 5 hours',
        'Open Air Amphitheatre',
        350,
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
        now() + interval '6 days',
        'published'
    ) ON CONFLICT (id) DO NOTHING;

    -- 4. Insert Demo Registration & Ticket Code for Student
    INSERT INTO public.registrations (id, event_id, student_id, ticket_code, status, registered_at)
    VALUES (
        v_reg1_id,
        v_evt1_id,
        v_stu1_id,
        'CC-EVT1-8F3D129A',
        'registered',
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- 5. Insert Hall QR Session for Event 1
    INSERT INTO public.hall_qr_sessions (id, event_id, hall_name, token_hash, valid_from, valid_until, is_active)
    VALUES (
        v_hall1_id,
        v_evt1_id,
        'Seminar Hall 3, Tech Block A',
        'SIGNED_HALL_QR_SESSION_EVT001_TECH_BLOCK_A_SEC2026',
        now() - interval '1 hour',
        now() + interval '3 days',
        true
    ) ON CONFLICT (id) DO NOTHING;

    -- 6. Insert Email Notification Record
    INSERT INTO public.email_notifications (registration_id, event_id, recipient_email, recipient_name, recipient_type, notification_type, subject, template_data, status, sent_at)
    VALUES (
        v_reg1_id,
        v_evt1_id,
        'alex.chen@student.college.edu',
        'Alex Chen',
        'student',
        'registration_confirmation',
        'Your Registration Pass for Autonomous AI & LLM Systems Workshop',
        '{"ticket_code": "CC-EVT1-8F3D129A", "event_title": "Autonomous AI & LLM Systems Workshop", "venue": "Seminar Hall 3, Tech Block A", "scan_url": "/attendance/scan"}'::jsonb,
        'sent',
        now()
    ) ON CONFLICT DO NOTHING;

END $$;
