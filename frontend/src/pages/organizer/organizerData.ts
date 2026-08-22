/**
 * organizerData.ts
 * Mock data for the Organizer Portal — KSR College of Engineering.
 */

export interface OrganizerEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  dateISO: string;
  time: string;
  startTime: string;
  endTime: string;
  venue: string;
  capacity: number;
  registered: number;
  attended: number;
  status: 'Draft' | 'Published' | 'Registration Open' | 'Almost Full' | 'Full' | 'Registration Closed' | 'Ongoing' | 'Completed' | 'Cancelled';
  thumbnail: string;
  description: string;
  shortDescription: string;
  organizerClub: string;
  createdBy: string;
  contactEmail: string;
  contactPhone: string;
  deadline: string;
  schedule: Array<{ time: string; title: string }>;
}

export interface StudentRegistration {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  registeredOn: string;
  ticketCode: string;
  attendanceStatus: 'Attended' | 'Not Attended';
  registrationStatus: 'Registered' | 'Confirmed' | 'Cancelled';
  checkInTime?: string;
  verifiedBy?: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  eventTitle: string;
  generatedOn: string;
  generatedBy: string;
  format: 'PDF' | 'CSV' | 'Excel';
  status: 'Ready' | 'Processing';
  downloadUrl?: string;
}

// ── Organizers Events List ──────────────────────────────────────────────────
export const MOCK_ORGANIZER_EVENTS: OrganizerEvent[] = [
  {
    id: 'org-evt-1',
    title: 'AI & Innovation Workshop',
    category: 'Technical',
    date: 'May 28, 2024',
    dateISO: '2024-05-28',
    time: '10:00 AM – 01:00 PM',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: 'Main Auditorium',
    capacity: 200,
    registered: 124,
    attended: 98,
    status: 'Registration Open',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=250&fit=crop',
    shortDescription: 'Explore the future of AI and machine learning with hands-on labs.',
    description: 'A comprehensive workshop covering Generative AI, Neural Networks, and practical Python implementations for engineering students.',
    organizerClub: 'Google Developer Student Club',
    createdBy: 'Dr. Sarah Johnson',
    contactEmail: 'gdsc@ksrce.ac.in',
    contactPhone: '+91 98765 43210',
    deadline: 'May 27, 2024',
    schedule: [
      { time: '10:00 AM', title: 'Registration & Welcome Note' },
      { time: '10:30 AM', title: 'Session 1: Intro to LLMs & Neural Nets' },
      { time: '11:45 AM', title: 'Hands-on Lab: Building AI Agents' },
      { time: '12:45 PM', title: 'Q&A & Certificate Distribution' },
    ],
  },
  {
    id: 'org-evt-2',
    title: 'Campus Hackathon 2024',
    category: 'Hackathon',
    date: 'May 30 – 31, 2024',
    dateISO: '2024-05-30',
    time: '09:00 AM – 09:00 AM',
    startTime: '09:00 AM',
    endTime: '09:00 AM',
    venue: 'Computer Lab 3',
    capacity: 300,
    registered: 180,
    attended: 145,
    status: 'Almost Full',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
    shortDescription: '24-hour hackathon solving real campus problems.',
    description: 'Compete in teams of 2-4 to build software and hardware prototypes addressing sustainability and smart campus tech.',
    organizerClub: 'CSE Association',
    createdBy: 'Prof. Rajesh Kumar',
    contactEmail: 'cseassoc@ksrce.ac.in',
    contactPhone: '+91 98765 12345',
    deadline: 'May 29, 2024',
    schedule: [
      { time: '09:00 AM', title: 'Hackathon Opening & Problem Release' },
      { time: '01:00 PM', title: 'Mentorship Check-in 1' },
      { time: '09:00 PM', title: 'Mid-way Progress Evaluation' },
      { time: '08:00 AM', title: 'Final Demo & Pitching' },
    ],
  },
  {
    id: 'org-evt-3',
    title: 'Web Development Bootcamp',
    category: 'Workshop',
    date: 'May 16, 2024',
    dateISO: '2024-05-16',
    time: '10:00 AM – 04:00 PM',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: 'Seminar Hall B',
    capacity: 100,
    registered: 85,
    attended: 72,
    status: 'Completed',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
    shortDescription: 'Full-stack web application deployment using React & Tailwind.',
    description: 'Learn modern web standards, UI/UX fundamentals, and live backend integration.',
    organizerClub: 'Web Dev Club',
    createdBy: 'Ms. Priya Nair',
    contactEmail: 'webdev@ksrce.ac.in',
    contactPhone: '+91 94433 22110',
    deadline: 'May 15, 2024',
    schedule: [
      { time: '10:00 AM', title: 'HTML5 & CSS3 Masterclass' },
      { time: '01:00 PM', title: 'React & Component Architecture' },
      { time: '03:00 PM', title: 'Vite & Vercel Deployment' },
    ],
  },
  {
    id: 'org-evt-4',
    title: 'UI/UX Design Sprint',
    category: 'Workshop',
    date: 'June 02, 2024',
    dateISO: '2024-06-02',
    time: '09:30 AM – 01:30 PM',
    startTime: '09:30 AM',
    endTime: '01:30 PM',
    venue: 'Design Studio 1',
    capacity: 80,
    registered: 65,
    attended: 54,
    status: 'Registration Open',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    shortDescription: 'Master Figma, wireframing, and interactive prototyping.',
    description: 'Design user-centric interfaces through real-world design sprint frameworks.',
    organizerClub: 'Design Club',
    createdBy: 'Mr. Karthik Selvam',
    contactEmail: 'designclub@ksrce.ac.in',
    contactPhone: '+91 97890 65432',
    deadline: 'June 01, 2024',
    schedule: [
      { time: '09:30 AM', title: 'User Research & Persona Building' },
      { time: '11:00 AM', title: 'Figma Auto-layout & Component Variants' },
      { time: '12:30 PM', title: 'Prototype Testing & Showcase' },
    ],
  },
  {
    id: 'org-evt-5',
    title: 'Career Guidance Session',
    category: 'Seminar',
    date: 'June 05, 2024',
    dateISO: '2024-06-05',
    time: '02:00 PM – 05:00 PM',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    venue: 'Conference Hall',
    capacity: 150,
    registered: 120,
    attended: 105,
    status: 'Registration Open',
    thumbnail: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=250&fit=crop',
    shortDescription: 'Placement preparation and industry resume building.',
    description: 'Interact with top alumni and HR professionals to get insider tips for campus recruitment.',
    organizerClub: 'Placement Cell',
    createdBy: 'Dr. Meena Krishnan',
    contactEmail: 'placement@ksrce.ac.in',
    contactPhone: '+91 91234 56789',
    deadline: 'June 04, 2024',
    schedule: [
      { time: '02:00 PM', title: 'Keynote: Navigating Corporate Tech Roles' },
      { time: '03:30 PM', title: 'Resume Review & Mock Interviews' },
    ],
  },
];

// ── Student Registrations ─────────────────────────────────────────────────────
export const MOCK_STUDENT_REGISTRATIONS: StudentRegistration[] = [
  {
    id: 'sreg-1',
    studentName: 'Sabari Christopher',
    rollNumber: '73152413003',
    department: 'CSE',
    year: '3rd Year',
    email: 'sabari@ksrce.ac.in',
    phone: '+91 98765 00001',
    registeredOn: 'May 20, 2024',
    ticketCode: 'CC-AIW-7X4P92',
    attendanceStatus: 'Attended',
    registrationStatus: 'Confirmed',
    checkInTime: '10:42 AM',
    verifiedBy: 'Organizer (GDSC)',
  },
  {
    id: 'sreg-2',
    studentName: 'Abilash Kumar R',
    rollNumber: '73152413008',
    department: 'CSE',
    year: '3rd Year',
    email: 'abilash@ksrce.ac.in',
    phone: '+91 98765 00002',
    registeredOn: 'May 21, 2024',
    ticketCode: 'CC-AIW-3R8K41',
    attendanceStatus: 'Attended',
    registrationStatus: 'Confirmed',
    checkInTime: '10:38 AM',
    verifiedBy: 'Organizer (GDSC)',
  },
  {
    id: 'sreg-3',
    studentName: 'Devaroopa E',
    rollNumber: '73152413015',
    department: 'ECE',
    year: '2nd Year',
    email: 'devaroopa@ksrce.ac.in',
    phone: '+91 98765 00003',
    registeredOn: 'May 22, 2024',
    ticketCode: 'CC-AIW-9A2M78',
    attendanceStatus: 'Not Attended',
    registrationStatus: 'Confirmed',
  },
  {
    id: 'sreg-4',
    studentName: 'Priya Suresh',
    rollNumber: '73152413022',
    department: 'IT',
    year: '4th Year',
    email: 'priya@ksrce.ac.in',
    phone: '+91 98765 00004',
    registeredOn: 'May 22, 2024',
    ticketCode: 'CC-AIW-5C6N33',
    attendanceStatus: 'Attended',
    registrationStatus: 'Confirmed',
    checkInTime: '10:40 AM',
    verifiedBy: 'Organizer (GDSC)',
  },
  {
    id: 'sreg-5',
    studentName: 'Karthik Murugan',
    rollNumber: '73152413029',
    department: 'EEE',
    year: '3rd Year',
    email: 'karthik@ksrce.ac.in',
    phone: '+91 98765 00005',
    registeredOn: 'May 23, 2024',
    ticketCode: 'CC-AIW-8X1P55',
    attendanceStatus: 'Attended',
    registrationStatus: 'Confirmed',
    checkInTime: '10:35 AM',
    verifiedBy: 'Organizer (GDSC)',
  },
  {
    id: 'sreg-6',
    studentName: 'Rahul Kumar',
    rollNumber: '73152413035',
    department: 'MECH',
    year: '2nd Year',
    email: 'rahul@ksrce.ac.in',
    phone: '+91 98765 00006',
    registeredOn: 'May 24, 2024',
    ticketCode: 'CC-AIW-2T9Q67',
    attendanceStatus: 'Not Attended',
    registrationStatus: 'Confirmed',
  },
  {
    id: 'sreg-7',
    studentName: 'Anjali Devi',
    rollNumber: '73152413042',
    department: 'AI&DS',
    year: '1st Year',
    email: 'anjali@ksrce.ac.in',
    phone: '+91 98765 00007',
    registeredOn: 'May 25, 2024',
    ticketCode: 'CC-AIW-6H4R89',
    attendanceStatus: 'Attended',
    registrationStatus: 'Confirmed',
    checkInTime: '10:45 AM',
    verifiedBy: 'Organizer (GDSC)',
  },
];

// ── Report History ────────────────────────────────────────────────────────────
export const MOCK_REPORT_HISTORY: GeneratedReport[] = [
  {
    id: 'rep-1',
    title: 'Attendance Report',
    eventTitle: 'AI & Innovation Workshop',
    generatedOn: 'May 28, 2024',
    generatedBy: 'Dr. Sarah Johnson',
    format: 'PDF',
    status: 'Ready',
  },
  {
    id: 'rep-2',
    title: 'Full Event Summary',
    eventTitle: 'Web Development Bootcamp',
    generatedOn: 'May 17, 2024',
    generatedBy: 'Ms. Priya Nair',
    format: 'CSV',
    status: 'Ready',
  },
  {
    id: 'rep-3',
    title: 'Student Participation Log',
    eventTitle: 'Campus Hackathon 2024',
    generatedOn: 'May 10, 2024',
    generatedBy: 'Prof. Rajesh Kumar',
    format: 'PDF',
    status: 'Ready',
  },
];
