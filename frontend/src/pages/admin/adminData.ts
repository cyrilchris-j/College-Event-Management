/**
 * adminData.ts
 * Mock data for the Admin Dashboard.
 * All data is representative of KSR College of Engineering.
 */

export interface AdminEvent {
  id: string;
  title: string;
  category: string;
  organizer: string;
  date: string;
  dateISO: string;
  venue: string;
  capacity: number;
  registered: number;
  attended: number;
  status: 'Open' | 'Almost Full' | 'Full' | 'Closed';
  thumbnail: string;
  description: string;
  createdBy: string;
  startTime: string;
  endTime: string;
}

export interface AdminStudent {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: number;
  email: string;
  phone: string;
  eventsRegistered: number;
  eventsAttended: number;
  lastEvent: string;
  status: 'Confirmed' | 'Pending';
}

export interface AdminRegistration {
  id: string;
  student: string;
  rollNumber: string;
  event: string;
  organizer: string;
  registeredOn: string;
  ticketCode: string;
  attended: boolean;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Organizer {
  id: string;
  name: string;
  type: string;
  events: number;
  registrations: number;
  attendanceRate: number;
  color: string;
  initials: string;
}

// ── Events ─────────────────────────────────────────────────────────────────────
export const ADMIN_EVENTS: AdminEvent[] = [];

// ── Organizers ─────────────────────────────────────────────────────────────────
export const ADMIN_ORGANIZERS: Organizer[] = [
  { id: 'org-1', name: 'Google Developer Student Club', type: 'Technical', events: 12, registrations: 1240, attendanceRate: 92, color: '#315CFF', initials: 'GD' },
  { id: 'org-2', name: 'CSE Association', type: 'Technical', events: 10, registrations: 1020, attendanceRate: 88, color: '#8B7CFF', initials: 'CA' },
  { id: 'org-3', name: 'Code Club', type: 'Technical', events: 8, registrations: 980, attendanceRate: 88, color: '#3B82F6', initials: 'CC' },
  { id: 'org-4', name: 'Design Club', type: 'Creative', events: 6, registrations: 640, attendanceRate: 91, color: '#E6A84B', initials: 'DC' },
  { id: 'org-5', name: 'Placement Cell', type: 'Career', events: 5, registrations: 720, attendanceRate: 95, color: '#C8A96B', initials: 'PC' },
  { id: 'org-6', name: 'Cultural Committee', type: 'Cultural', events: 4, registrations: 890, attendanceRate: 94, color: '#E36D6D', initials: 'CC' },
  { id: 'org-7', name: 'Robotics Club', type: 'Technical', events: 6, registrations: 530, attendanceRate: 84, color: '#315CFF', initials: 'RC' },
];

// ── Students / Registrations ──────────────────────────────────────────────────
export const ADMIN_REGISTRATIONS: AdminRegistration[] = [
  { id: 'reg-1', student: 'Sabari Christopher', rollNumber: '73152413003', event: 'AI & Innovation Workshop', organizer: 'GDSC', registeredOn: 'May 20, 2024', ticketCode: 'CC-AIW-7X4P92', attended: true, status: 'Confirmed' },
  { id: 'reg-2', student: 'Abilash Kumar R', rollNumber: '73152413008', event: 'Campus Hackathon 2024', organizer: 'CSE Assoc.', registeredOn: 'May 21, 2024', ticketCode: 'CC-HAC-3R8K41', attended: true, status: 'Confirmed' },
  { id: 'reg-3', student: 'Devaroopa E', rollNumber: '73152413015', event: 'Web Dev Bootcamp', organizer: 'Web Dev Club', registeredOn: 'May 10, 2024', ticketCode: 'CC-WEB-9A2M78', attended: false, status: 'Confirmed' },
  { id: 'reg-4', student: 'Priya Suresh', rollNumber: '73152413022', event: 'UI/UX Design Sprint', organizer: 'Design Club', registeredOn: 'May 18, 2024', ticketCode: 'CC-UIX-5C6N33', attended: true, status: 'Confirmed' },
  { id: 'reg-5', student: 'Karthik Murugan', rollNumber: '73152413029', event: 'Career Guidance Session', organizer: 'Placement Cell', registeredOn: 'May 22, 2024', ticketCode: 'CC-CAR-8X1P55', attended: true, status: 'Confirmed' },
  { id: 'reg-6', student: 'Anjali Ravi', rollNumber: '73152413035', event: 'Cultural Fest 2K24', organizer: 'Cultural Comm.', registeredOn: 'May 24, 2024', ticketCode: 'CC-CFT-2T9Q67', attended: false, status: 'Pending' },
  { id: 'reg-7', student: 'Vikram Shankar', rollNumber: '73152413041', event: 'Cybersecurity Workshop', organizer: 'Cyber Club', registeredOn: 'May 26, 2024', ticketCode: 'CC-CYB-6H4R89', attended: true, status: 'Confirmed' },
  { id: 'reg-8', student: 'Meena Rajendran', rollNumber: '73152413048', event: 'Robotics & Automation Expo', organizer: 'Robotics Club', registeredOn: 'May 28, 2024', ticketCode: 'CC-ROB-1J7S21', attended: true, status: 'Confirmed' },
];

// ── Monthly Chart Data ─────────────────────────────────────────────────────────
export const REGISTRATION_CHART_DATA = [
  { month: 'Jan', registrations: 210, attendance: 180 },
  { month: 'Feb', registrations: 340, attendance: 295 },
  { month: 'Mar', registrations: 580, attendance: 510 },
  { month: 'Apr', registrations: 720, attendance: 650 },
  { month: 'May', registrations: 1240, attendance: 1120 },
  { month: 'Jun', registrations: 890, attendance: 810 },
  { month: 'Jul', registrations: 430, attendance: 380 },
  { month: 'Aug', registrations: 620, attendance: 570 },
];

export const CATEGORY_CHART_DATA = [
  { name: 'Technical', value: 38, color: '#315CFF' },
  { name: 'Workshop', value: 22, color: '#8B7CFF' },
  { name: 'Cultural', value: 15, color: '#E6A84B' },
  { name: 'Seminar', value: 12, color: '#C8A96B' },
  { name: 'Exhibition', value: 8, color: '#38BDF8' },
  { name: 'Hackathon', value: 5, color: '#E36D6D' },
];

export const ATTENDANCE_DATA = [
  { event: 'Career Guidance', rate: 92, color: '#3B82F6' },
  { event: 'Web Dev Bootcamp', rate: 85, color: '#3B82F6' },
  { event: 'AI Workshop', rate: 79, color: '#E6A84B' },
  { event: 'Cultural Fest', rate: 76, color: '#E6A84B' },
  { event: 'Hackathon 2024', rate: 71, color: '#E36D6D' },
  { event: 'Robotics Expo', rate: 84, color: '#3B82F6' },
];

// ── Status Config ──────────────────────────────────────────────────────────────
export const EVENT_STATUS_CONFIG = {
  Open:        { color: '#315CFF', bg: 'rgba(49,92,255,0.1)',   border: 'rgba(49,92,255,0.25)' },
  'Almost Full': { color: '#E6A84B', bg: 'rgba(230,168,75,0.1)',  border: 'rgba(230,168,75,0.25)' },
  Full:        { color: '#E36D6D', bg: 'rgba(227,109,109,0.1)', border: 'rgba(227,109,109,0.25)' },
  Closed:      { color: '#68778C', bg: 'rgba(104,119,140,0.1)', border: 'rgba(104,119,140,0.25)' },
};

export const CATEGORY_COLORS: Record<string, string> = {
  Technical:  '#315CFF',
  Hackathon:  '#8B7CFF',
  Workshop:   '#60A5FA',
  Seminar:    '#C8A96B',
  Cultural:   '#E6A84B',
  Exhibition: '#E36D6D',
  Sports:     '#68778C',
};
