# 🎓 CampusConnect

### **Campus Event Management and Registration Portal**
*A centralized, secure, and modern event lifecycle platform for colleges and universities.*

[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-RWW--8-blue?style=for-the-badge)](https://github.com)
[![Category](https://img.shields.io/badge/Category-Software%20%7C%20Campus%20Utility-orange?style=for-the-badge)](https://github.com)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Supabase%20%7C%20TailwindCSS-brightgreen?style=for-the-badge)](https://github.com)
[![Build Status](https://img.shields.io/badge/Status-Hackathon%20MVP-success?style=for-the-badge)](https://github.com)

---

## 👥 Team Details

| Team Member | Roll / Register No. | Role & Responsibility |
| :--- | :--- | :--- |
| **Abilash Kumar R** | `73152413003` | **Frontend Architecture & Student Experience**<br>• Scrollable Home feed, Event Discovery & Details<br>• Student Registration Form & Digital Ticket UI |
| **Devaroopa E** | `73152413035` | **Organiser Suite & Verification Engine**<br>• Organiser & Admin Dashboards, Analytics Metrics<br>• Hall QR Attendance Scanner & Verification Logic |
| **Cyril Christopher J** | `73152413029` | **Backend, Database & Security Lead**<br>• Supabase Schema, Relational Integrity & RLS Policies<br>• Authentication, Role-based Access & API Contract |

---

## 📌 Problem Statement

### **Context & Current Challenges**
College clubs, student chapters, and administrative bodies frequently organize technical symposiums, cultural fests, workshops, and sports meets. However, event coordination remains highly fragmented:
- **Scattered Discovery:** Events are promoted across disparate WhatsApp groups, Instagram stories, and printed flyers, leading to poor visibility and missed deadlines.
- **Messy Registrations:** Using generic forms (e.g., Google Forms) leads to duplicate registrations, unmanaged capacity limits, and lack of real-time seat tracking.
- **Entry Bottlenecks:** Venue check-ins rely on physical name sheets or screenshot inspections, causing long queues, entry disputes, and proxy check-ins.
- **Zero Visibility:** Organisers and faculty lack live insight into attendance rates, capacity utilization, and participant demographics.

### **The CampusConnect Solution**
**CampusConnect** transforms campus event management into a unified digital pipeline:
> **Admin provisions Organisers ➔ Organiser publishes Event with capacity ➔ Student discovers & registers (receives unique Student ID + Ticket) ➔ Student checks in on event day by scanning the signed Hall QR code ➔ Live Attendance Dashboard updates instantly.**

---

## 🚀 Key Features

* **🌟 Single-Page Scrollable Event Discovery:** Seamless home feed with live search, category filtering, remaining seat indicators, and dynamic status badges (`Open`, `Almost Full`, `Closed`).
* **🆔 Campus Student Identity & Digital Tickets:** First-time registration automatically issues a permanent CampusConnect Student ID (`CCS-2026-XXXXX`) and a unique cryptographic Ticket Code (`CC-{EVENT_ID}-{RANDOM}`).
* **🛡️ Strict 3-Tier Role-Based Access Control (RBAC):** Zero public staff registration. Admins provision Organisers; Organisers manage their events; Students register and check in.
* **📱 Secure Hall-Specific QR Attendance:** Students check in by scanning the dynamic, cryptographically signed QR code displayed inside the event hall.
* **⚡ Idempotent Check-in & Database Constraints:** Database-level uniqueness constraints eliminate duplicate registrations and duplicate attendance records.
* **📊 Organiser Analytics Dashboard:** Real-time visibility into total registrations, capacity percentage, check-in count, and attendance conversion rates.
* **🔄 Organiser Manual Fallback:** Organisers can search by Ticket Code or Student ID for manual verification if student devices have camera/battery issues.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 / TypeScript** | Declarative component UI, robust type safety, and fast client-side state management. |
| **Build & Tooling** | **Vite** | Blazing-fast Hot Module Replacement (HMR) and optimized production bundles. |
| **Styling & Design** | **Tailwind CSS** | Clean campus-utility design system with responsive layouts and dark/light accents. |
| **Icons & Assets** | **Lucide React** | Modern, lightweight, and accessible icon primitives. |
| **Database** | **PostgreSQL (via Supabase)** | Relational data integrity, unique constraints, foreign keys, and ACID compliance. |
| **Authentication & RLS** | **Supabase Auth & RLS** | Secure JWT-based session handling and Row-Level Security policy enforcement. |
| **QR Code Engine** | **`html5-qrcode` & `qrcode.react`** | High-speed mobile camera scanning and high-contrast hall QR token generation. |
| **Hosting & CI/CD** | **Vercel / GitHub Actions** | Global CDN distribution, automated preview deployments, and zero-downtime releases. |

---

## 🏛️ System Architecture

### **1. High-Level Architecture Overview**
```mermaid
flowchart TB
    subgraph Clients["📱 Client Layer (Responsive Web)"]
        S[Student Participant\n- Mobile/Desktop Browser]
        O[Club Organiser\n- Desktop/Tablet Dashboard]
        A[Administrator\n- Admin Portal]
    end

    subgraph AppShell["⚡ React + TypeScript Application (Vite)"]
        Router[React Router DOM]
        AuthCtx[Auth & Role Context]
        QRScanner[HTML5 QR Scanner Engine]
        QRGen[Hall QR Generator]
        DashUI[Real-time Dashboard & Metrics]
    end

    subgraph Backend["☁️ Supabase Cloud Platform"]
        AuthSvc[Supabase Auth\n- JWT Session Tokens]
        API[PostgreSQL REST / Realtime API]
        RLS[Row-Level Security Policies]
        DB[(PostgreSQL Database)]
    end

    S --> Router
    O --> Router
    A --> Router
    Router --> AuthCtx
    AuthCtx --> AuthSvc
    Router --> QRScanner
    Router --> QRGen
    Router --> DashUI
    DashUI --> API
    QRScanner --> API
    API --> RLS
    RLS --> DB
```

---

### **2. Core User Flows**

#### **A. Student Discovery & Registration Journey**
```mermaid
flowchart TD
    Start([Student opens Home Page]) --> Browse[Browse & Filter Events in #events feed]
    Browse --> Select[Select Event & Open Details]
    Select --> ClickReg[Click 'Register Now']
    ClickReg --> Form[Fill Student Registration Form\nName, Email, Roll No, Dept, Year]
    Form --> AccCheck{Existing Account?}
    AccCheck -- No --> CreateAcc[Create Student Account\nGenerate Student ID: CCS-2026-XXXX]
    AccCheck -- Yes --> MatchAcc[Match Existing Student Profile]
    CreateAcc --> InsertReg[Atomic Transaction:\nVerify Capacity & Lock Row]
    MatchAcc --> InsertReg
    InsertReg --> DupCheck{Already Registered?}
    DupCheck -- Yes --> ShowErr[Show Friendly Duplicate Warning]
    DupCheck -- No --> GenTicket[Generate Ticket: CC-EVT-XXXX\nAssign Ticket to Student]
    GenTicket --> TicketView([Display Digital Ticket & Confirmation])
```

#### **B. Event-Day Hall QR Attendance Verification**
```mermaid
flowchart TD
    Venue([Student arrives at Event Hall]) --> Login[Sign in with Student ID / Email]
    Login --> OpenScanner[Open 'Scan Hall QR' on Mobile]
    OpenScanner --> Scan[Scan Signed QR Code on Hall Screen]
    Scan --> ServerVal{Server-Side Validation}
    
    ServerVal -->|Invalid Token| Err1[❌ Invalid / Expired QR Session]
    ServerVal -->|Wrong Event / Hall| Err2[❌ Ticket does not match this Hall/Event]
    ServerVal -->|Not in Window| Err3[❌ Attendance Window Closed]
    ServerVal -->|Already Attended| Warn[⚠️ Already Checked In\nShow original timestamp]
    
    ServerVal -->|Valid| Record[✅ Record Attendance in DB\nStore checkedInAt & sessionId]
    Record --> UI[Display 'Attendance Confirmed' Badge]
    Record --> Realtime[Update Organiser Dashboard Count in Real Time]
```

#### **C. Organiser Event Lifecycle**
```mermaid
flowchart LR
    Admin[Admin Provisions Organiser] --> Create[Create Draft Event\nSet Venue, Capacity, Dates]
    Create --> Publish[Publish Event\nVisible on Home Feed]
    Publish --> Monitor[Monitor Registrations & Capacity]
    Monitor --> HallQR[Generate Signed Hall QR Display]
    HallQR --> CheckIn[Students Scan QR / Fallback Code Entry]
    CheckIn --> Close[Close Event & View Final Attendance Rate]
```

---

## 🗄️ Database Schema & Data Integrity

### **Entity-Relationship Diagram (ERD)**

```mermaid
erDiagram
    USERS ||--o{ STUDENT_PROFILES : has
    USERS ||--o{ EVENTS : creates
    USERS ||--o{ REGISTRATIONS : makes
    EVENTS ||--o{ REGISTRATIONS : receives
    EVENTS ||--o{ HALL_QR_SESSIONS : generates
    REGISTRATIONS ||--o| ATTENDANCE : records
    HALL_QR_SESSIONS ||--o{ ATTENDANCE : validates

    USERS {
        uuid id PK
        text email UK
        text role "admin | organizer | student"
        text student_id UK "e.g. CCS-2026-00421"
        timestamp created_at
    }

    STUDENT_PROFILES {
        uuid id PK
        uuid user_id FK
        text full_name
        text roll_number UK
        text department
        int year_of_study
        text phone
    }

    EVENTS {
        uuid id PK
        uuid organizer_id FK
        text title
        text description
        text category "Technical | Cultural | Sports | Workshop | Seminar"
        timestamp event_start
        timestamp event_end
        text venue
        int capacity
        timestamp registration_deadline
        text status "draft | published | closed | completed"
        timestamp created_at
    }

    REGISTRATIONS {
        uuid id PK
        uuid event_id FK
        uuid student_id FK
        text ticket_code UK "e.g. CC-104-9F8A62BC"
        text status "registered | attended | cancelled"
        timestamp registered_at
    }

    HALL_QR_SESSIONS {
        uuid id PK
        uuid event_id FK
        text hall_name
        text token_hash UK
        timestamp valid_from
        timestamp valid_until
        boolean is_active
    }

    ATTENDANCE {
        uuid id PK
        uuid registration_id FK, UK
        uuid hall_qr_session_id FK
        uuid verified_by FK "NULL if self-scanned"
        timestamp checked_in_at
    }
```

### **Database Integrity & Concurrency Constraints**
To prevent race conditions, overselling, and duplicate entries at the database layer:

```sql
-- 1. Prevent duplicate registrations for the same event by a student
ALTER TABLE registrations 
ADD CONSTRAINT unique_event_student_registration 
UNIQUE (event_id, student_id);

-- 2. Enforce global ticket code uniqueness
ALTER TABLE registrations 
ADD CONSTRAINT unique_ticket_code 
UNIQUE (ticket_code);

-- 3. Idempotent attendance: one check-in per registration
ALTER TABLE attendance 
ADD CONSTRAINT unique_single_attendance 
UNIQUE (registration_id);

-- 4. Identity uniqueness constraints
ALTER TABLE users ADD CONSTRAINT unique_user_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT unique_student_id UNIQUE (student_id);
ALTER TABLE student_profiles ADD CONSTRAINT unique_student_roll_number UNIQUE (roll_number);
```

---

## 🗺️ Application Route Map

| Route | Page / View | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | **Home Page** | Public | Branded landing hero, search & filters, and scrollable all-events feed (`#events`). |
| `/events/:id` | **Event Details** | Public | Complete event info, venue, remaining capacity bar, and "Register" CTA. |
| `/events/:id/register` | **Student Registration** | Public / Student | Comprehensive form collecting student info, auto-generating Student ID & Ticket. |
| `/student/login` | **Student Portal Sign-In** | Public | Student ID/Email and password authentication. |
| `/my-registrations` | **My Tickets** | Authenticated Student | View active/past tickets, status badges, and launch attendance scanner. |
| `/ticket/:id` | **Digital Ticket** | Authenticated Student | High-contrast mobile ticket with Ticket Code, Student ID, and QR. |
| `/attendance/scan` | **Hall QR Scanner** | Authenticated Student | Live mobile camera scanner to check in by scanning the venue QR. |
| `/organizer` | **Organiser Dashboard** | Organiser / Admin | Real-time analytics, event list, capacity tracking, and participant roster. |
| `/organizer/events/new` | **Create Event** | Organiser / Admin | Event creation form with capacity limits, venue selection, and deadlines. |
| `/organizer/events/:id/hall-qr` | **Hall QR Display** | Organiser / Admin | Full-screen dynamic signed QR code for projector/display at the hall entrance. |
| `/organizer/events/:id/verify` | **Manual Check-In** | Organiser / Admin | Fallback search by Ticket Code / Student ID for manual verification. |
| `/admin` | **Admin Dashboard** | Admin Only | Provision Organiser & Admin accounts; platform-wide oversight. |

---

## 🔒 Security & Privacy Architecture

1. **Zero-Trust Staff Provisioning:** No public sign-up for Organiser or Admin roles. All staff accounts must be explicitly provisioned by a Super Admin.
2. **Cryptographic Hall QR Sessions:** Hall QR codes do not embed raw database IDs. They contain an encrypted/signed token with a restricted validity window bound to the specific event venue.
3. **Data Minimization:** QR codes never store student phone numbers, email addresses, or personal credentials. Verification requests only expose necessary operational details.
4. **Row-Level Security (RLS):** Supabase RLS ensures students can only read/update their own registrations, while organisers can only view and manage events they created.

---

## 💻 Folder Structure

```
CampusConnect/
├── frontend/                     # Client-side React + TypeScript Application
│   ├── public/                   # Static public assets
│   │   └── assets/               # Logos, icons & imagery
│   └── src/
│       ├── components/           # Reusable UI component modules
│       │   ├── dashboard/        # MetricsGrid, MetricCard, ParticipantTable
│       │   ├── events/           # EventCard, EventGrid, CapacityBar
│       │   ├── layout/           # AppShell, Navbar, Footer, MobileNav
│       │   ├── scanner/          # CameraScanner, HallQRDisplay, VerificationBadge
│       │   ├── tickets/          # DigitalTicket, TicketCard, TicketQR
│       │   └── ui/               # Button, Input, Modal, Card, Badge, Table
│       ├── context/              # React Context Providers (AuthContext, ThemeContext)
│       ├── hooks/                # Custom React client hooks
│       ├── pages/                # Page route views
│       │   ├── admin/            # Admin staff-provisioning dashboard
│       │   ├── organizer/        # Organiser event management & metrics
│       │   ├── public/           # Scrollable HomePage & EventDetailsPage
│       │   └── student/          # StudentLoginPage, MyRegistrationsPage, TicketPage
│       ├── routes/               # Client-side route configuration & guards
│       ├── services/             # API client fetchers & Supabase client
│       ├── types/                # Frontend TypeScript models & interfaces
│       └── utils/                # Date/time formatters, validators & helpers
│
├── backend/                      # Server-side API & Database Logic
│   ├── config/                   # Environment & server configurations
│   ├── controllers/              # Request handlers (Auth, Events, Attendance)
│   ├── database/                 # Database schema definitions & migrations
│   │   ├── migrations/           # SQL migration scripts (PostgreSQL / Supabase)
│   │   └── seeds/                # Initial demo seeds (Admin, Organisers, Events)
│   ├── middleware/               # Auth guards, role verification & rate-limiting
│   ├── models/                   # Database entity models & schemas
│   ├── routes/                   # API endpoint route declarations
│   ├── services/                 # Backend business logic services
│   │   ├── attendance/           # Idempotent check-in verification
│   │   ├── auth/                 # Authentication & token verification
│   │   ├── events/               # Event publishing & capacity verification
│   │   ├── qr/                   # Cryptographic signed QR token generator
│   │   └── registration/         # Atomic registration & ticket generation
│   ├── types/                    # Backend TypeScript interfaces & DB types
│   └── utils/                    # Hash generators, validators & response helpers
│
├── .env                          # Local environment secrets (ignored by git)
├── .gitignore                    # Git ignore rules
├── CampusConnect.md              # Revised Product Requirements Document
├── campusconnect1.md             # Initial Product Requirements Document
└── README.md                     # Project documentation & architecture plan
```

---

## ⚡ Getting Started & Local Setup

### **Prerequisites**
- **Node.js**: `v18.x` or higher
- **npm** or **pnpm** / **yarn**
- **Supabase Account** (or local Supabase CLI instance)

### **1. Clone the Repository**
```bash
git clone https://github.com/cyrilchris-j/College-Event-Management.git
cd College-Event-Management
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### **4. Run Database Migrations**
Run the SQL schema scripts provided in the `supabase/migrations/` directory inside your Supabase SQL Editor to set up tables, constraints, and Row-Level Security policies.

### **5. Start the Development Server**
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📈 Future Roadmap

- [ ] **Phase 2 (Campus Operations):** Automated digital certificate generation with verifiable QR codes upon event completion.
- [ ] **Phase 3 (Student Engagement):** Automated waitlisting when events reach capacity, triggering automated seat allocation upon cancellations.
- [ ] **Phase 4 (Offline Check-in):** Offline local storage caching for entry volunteers in low-connectivity underground auditoriums.
- [ ] **Phase 5 (Multi-College Federation):** Inter-college fest registration supporting external college student verification.

---

## 📜 License & Acknowledgements

Developed for the **College Hackathon — Problem Statement RWW-8 (Campus Event Management and Registration Portal)**.

*Designed and engineered with passion by **Abilash Kumar R**, **Devaroopa E**, and **Cyril Christopher J**.*
