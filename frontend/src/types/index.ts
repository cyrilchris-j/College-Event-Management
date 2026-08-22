// ─── Event ──────────────────────────────────────────────────────────────────

export type EventCategory =
  | 'Technical'
  | 'Hackathon'
  | 'Workshop'
  | 'Seminar'
  | 'Cultural'
  | 'Exhibition'
  | 'Sports';

export type EventStatus =
  | 'draft'
  | 'published'
  | 'closed'
  | 'completed';

export type RegistrationStatus =
  | 'open'
  | 'almost_full'
  | 'full'
  | 'closed';

export interface Event {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  category: EventCategory;
  event_start: string;       // ISO datetime
  event_end?: string;        // ISO datetime
  venue: string;
  capacity: number;
  registered_count: number;
  banner_url?: string;
  organizer_id: string;
  organizer_name?: string;
  registration_deadline?: string; // ISO datetime
  status: EventStatus;
  created_at: string;
  // Computed
  registration_status?: RegistrationStatus;
  registration_percentage?: number;
}

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'organizer' | 'student';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  student_id?: string;   // e.g. CCS-2026-00421
  created_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string;
  roll_number: string;
  department: string;
  year_of_study: number;
  phone?: string;
}

// ─── Registration ─────────────────────────────────────────────────────────────

export type TicketStatus = 'registered' | 'attended' | 'cancelled';

export interface Registration {
  id: string;
  event_id: string;
  student_id: string;
  ticket_code: string;   // e.g. CC-EVT-9F8A62BC
  status: TicketStatus;
  registered_at: string;
  // Joined
  event?: Event;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface Attendance {
  id: string;
  registration_id: string;
  hall_qr_session_id?: string;
  verified_by?: string;
  checked_in_at: string;
}

// ─── Hall QR Session ─────────────────────────────────────────────────────────

export interface HallQRSession {
  id: string;
  event_id: string;
  hall_name: string;
  token_hash: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

// ─── Filter & Search State ──────────────────────────────────────────────────

export type SortOption = 'soonest' | 'most_registered' | 'most_available';

export interface FilterState {
  search: string;
  category: EventCategory | 'All';
  sort: SortOption;
}

// ─── API Response Wrappers ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
  initialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  full_name: string;
  roll_number: string;
  department: string;
  year_of_study: number;
  phone?: string;
}
