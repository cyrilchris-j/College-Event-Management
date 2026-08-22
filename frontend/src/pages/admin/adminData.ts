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
  status: 'Open' | 'Almost Full' | 'Full' | 'Closed' | 'Live';
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
export const ADMIN_EVENTS: AdminEvent[] = [
  {
    id: 'evt-1',
    title: 'AI & Innovation Workshop',
    category: 'Technical',
    organizer: 'Google Developer Student Club',
    date: 'May 28, 2024',
    dateISO: '2024-05-28',
    venue: 'Main Auditorium',
    capacity: 200,
    registered: 124,
    attended: 98,
    status: 'Live',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=300&h=200&fit=crop',
    description: 'Explore the future of AI and machine learning with hands-on sessions and expert talks covering the latest advancements in artificial intelligence.',
    createdBy: 'Dr. Sarah Johnson',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
  },
  {
    id: 'evt-2',
    title: 'Campus Hackathon 2024',
    category: 'Hackathon',
    organizer: 'CSE Association',
    date: 'May 30 – 31, 2024',
    dateISO: '2024-05-30',
    venue: 'Computer Lab 3',
    capacity: 300,
    registered: 180,
    attended: 128,
    status: 'Open',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=200&fit=crop',
    description: 'Build, code and innovate in a 24-hour challenge to create real-world solutions.',
    createdBy: 'Prof. Rajesh Kumar',
    startTime: '09:00 AM',
    endTime: '09:00 AM',
  },
  {
    id: 'evt-3',
    title: 'Web Development Bootcamp',
    category: 'Workshop',
    organizer: 'Web Dev Club',
    date: 'May 16, 2024',
    dateISO: '2024-05-16',
    venue: 'Seminar Hall',
    capacity: 100,
    registered: 85,
    attended: 72,
    status: 'Almost Full',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop',
    description: 'Learn full-stack web development from scratch with practical projects.',
    createdBy: 'Ms. Priya Nair',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
  },
  {
    id: 'evt-4',
    title: 'UI/UX Design Sprint',
    category: 'Workshop',
    organizer: 'Design Club',
    date: 'May 20, 2024',
    dateISO: '2024-05-20',
    venue: 'Design Studio',
    capacity: 100,
    registered: 65,
    attended: 59,
    status: 'Open',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop',
    description: 'Design intuitive interfaces in this fast-paced sprint with real user problems.',
    createdBy: 'Mr. Karthik Selvam',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
  },
  {
    id: 'evt-5',
    title: 'Career Guidance Session',
    category: 'Seminar',
    organizer: 'Placement Cell',
    date: 'May 25, 2024',
    dateISO: '2024-05-25',
    venue: 'Seminar Hall',
    capacity: 150,
    registered: 120,
    attended: 110,
    status: 'Open',
    thumbnail: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=300&h=200&fit=crop',
    description: 'Get expert advice on career paths, placements and skill building.',
    createdBy: 'Dr. Meena Krishnan',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
  },
  {
    id: 'evt-6',
    title: 'Cultural Fest 2K24',
    category: 'Cultural',
    organizer: 'Cultural Committee',
    date: 'May 30 – 31, 2024',
    dateISO: '2024-05-30',
    venue: 'Open Auditorium',
    capacity: 500,
    registered: 300,
    attended: 285,
    status: 'Open',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop',
    description: 'A celebration of culture with music, dance, and creative performances.',
    createdBy: 'Ms. Anjali Reddy',
    startTime: '06:00 PM',
    endTime: '10:00 PM',
  },
  {
    id: 'evt-7',
    title: 'Cybersecurity Workshop',
    category: 'Technical',
    organizer: 'Cybersecurity Club',
    date: 'June 05, 2024',
    dateISO: '2024-06-05',
    venue: 'Computer Lab 2',
    capacity: 120,
    registered: 90,
    attended: 67,
    status: 'Open',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop',
    description: 'Hands-on workshop on ethical hacking, network security and cyber awareness.',
    createdBy: 'Mr. Vijay Anand',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
  },
  {
    id: 'evt-8',
    title: 'Robotics & Automation Expo',
    category: 'Exhibition',
    organizer: 'Robotics Club',
    date: 'June 08, 2024',
    dateISO: '2024-06-08',
    venue: 'Main Auditorium Lobby',
    capacity: 250,
    registered: 210,
    attended: 176,
    status: 'Almost Full',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop',
    description: 'Exhibition of innovative robotics projects and automation technologies.',
    createdBy: 'Dr. Suresh Babu',
    startTime: '11:00 AM',
    endTime: '04:00 PM',
  },
];

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
  Live:        { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' },
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
