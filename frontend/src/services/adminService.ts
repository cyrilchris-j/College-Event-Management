import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface AdminDashboardTelemetry {
  metrics: {
    totalEvents: number;
    activeEvents: number;
    totalStudents: number;
    totalOrganizers: number;
    totalRegistrations: number;
    attendanceRate: number;
  };
  events: any[];
  students: any[];
  organizers: any[];
  registrations: any[];
}

/**
 * Fetches EXCLUSIVELY LIVE database records from Supabase for Admin Portal.
 * Returns ONLY registered student records and real Supabase events/registrations.
 */
export async function fetchAdminDashboardData(): Promise<AdminDashboardTelemetry> {
  // 1. Try querying backend API route
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (backendErr) {
    console.warn('[adminService] Backend API fetch warning:', backendErr);
  }

  // 2. Direct Supabase Client Query
  try {
    const [eventsRes, profilesRes, regsRes] = await Promise.allSettled([
      supabase.from('events').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('registrations').select(`
        id, event_id, student_id, ticket_code, status, attended, check_in_time, registered_at,
        profiles ( id, full_name, roll_number, department, year, email, phone, role ),
        events ( id, title, category, venue, organizer_club )
      `).order('registered_at', { ascending: false }),
    ]);

    const eventsData = eventsRes.status === 'fulfilled' && eventsRes.value.data ? eventsRes.value.data : [];
    const profilesData = profilesRes.status === 'fulfilled' && profilesRes.value.data ? profilesRes.value.data : [];
    const regsData = regsRes.status === 'fulfilled' && regsRes.value.data ? regsRes.value.data : [];

    const formattedEvents = eventsData.map((e: any) => ({
      id: e.id,
      title: e.title,
      category: e.category || 'Technical',
      organizer: e.organizer_club || 'Campus Organization',
      date: e.event_start ? new Date(e.event_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
      venue: e.venue || 'Main Hall',
      capacity: e.capacity || 100,
      registered: 0,
      attended: 0,
      status: e.status === 'published' ? 'Live' : 'Open',
      thumbnail: e.banner_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop',
      description: e.description || e.short_description || '',
    }));

    const formattedRegistrations = regsData.map((r: any) => ({
      id: r.id,
      student: r.profiles?.full_name || 'Registered Student',
      rollNumber: r.profiles?.roll_number || 'N/A',
      department: r.profiles?.department || 'N/A',
      year: r.profiles?.year ? `${r.profiles.year} Year` : 'N/A',
      email: r.profiles?.email || 'N/A',
      phone: r.profiles?.phone || 'N/A',
      event: r.events?.title || 'Campus Event',
      organizer: r.events?.organizer_club || 'Campus Club',
      registeredOn: r.registered_at ? new Date(r.registered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
      ticketCode: r.ticket_code || 'CC-REG-000',
      attended: r.attended === true,
      status: r.status || 'Confirmed',
    }));

    // Filter registered students ONLY
    const uniqueStudentsMap = new Map();
    formattedRegistrations.forEach((r: any) => {
      if (!uniqueStudentsMap.has(r.rollNumber)) {
        uniqueStudentsMap.set(r.rollNumber, {
          id: r.id,
          name: r.student,
          rollNumber: r.rollNumber,
          department: r.department,
          year: r.year,
          email: r.email,
          phone: r.phone,
          eventsRegistered: 1,
          status: r.status,
        });
      } else {
        const existing = uniqueStudentsMap.get(r.rollNumber);
        existing.eventsRegistered += 1;
      }
    });

    const registeredStudents = Array.from(uniqueStudentsMap.values());
    const organizers = profilesData.filter((p: any) => p.role === 'organizer' || p.role === 'admin');

    const totalEvents = formattedEvents.length;
    const activeEvents = formattedEvents.filter((e: any) => e.status === 'Live' || e.status === 'Open').length;
    const totalStudents = registeredStudents.length;
    const totalOrganizers = organizers.length;
    const totalRegistrations = formattedRegistrations.length;
    const attendedCount = formattedRegistrations.filter((r: any) => r.attended === true).length;
    const attendanceRate = totalRegistrations > 0 ? Math.round((attendedCount / totalRegistrations) * 100) : 0;

    return {
      metrics: {
        totalEvents,
        activeEvents,
        totalStudents,
        totalOrganizers,
        totalRegistrations,
        attendanceRate,
      },
      events: formattedEvents,
      students: registeredStudents,
      organizers,
      registrations: formattedRegistrations,
    };
  } catch (supabaseErr) {
    console.warn('[adminService] Direct Supabase fetch attempt error:', supabaseErr);
  }

  // Pure Live fallback (empty state if no database rows exist)
  return {
    metrics: {
      totalEvents: 0,
      activeEvents: 0,
      totalStudents: 0,
      totalOrganizers: 0,
      totalRegistrations: 0,
      attendanceRate: 0,
    },
    events: [],
    students: [],
    organizers: [],
    registrations: [],
  };
}
