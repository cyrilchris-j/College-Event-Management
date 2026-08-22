import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const HomePage = lazy(() =>
  import('@/pages/public/HomePage').then(m => ({ default: m.HomePage }))
);
const EventDetailsPage = lazy(() =>
  import('@/pages/public/EventDetailsPage').then(m => ({ default: m.EventDetailsPage }))
);
const LoginPage = lazy(() =>
  import('@/pages/student/LoginPage').then(m => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import('@/pages/student/SignupPage').then(m => ({ default: m.SignupPage }))
);
const MyRegistrationsPage = lazy(() =>
  import('@/pages/student/MyRegistrationsPage').then(m => ({
    default: m.MyRegistrationsPage,
  }))
);
const TicketPage = lazy(() =>
  import('@/pages/student/TicketPage').then(m => ({ default: m.TicketPage }))
);
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

// Organizer Portal Pages
const OrganizerDashboard = lazy(() => import('@/pages/organizer/OrganizerDashboard').then(m => ({ default: m.OrganizerDashboard })));
const CreateEventPage = lazy(() => import('@/pages/organizer/CreateEventPage').then(m => ({ default: m.CreateEventPage })));
const ManageEventPage = lazy(() => import('@/pages/organizer/ManageEventPage').then(m => ({ default: m.ManageEventPage })));
const OrganizerRegistrationsPage = lazy(() => import('@/pages/organizer/OrganizerRegistrationsPage').then(m => ({ default: m.OrganizerRegistrationsPage })));
const OrganizerAttendancePage = lazy(() => import('@/pages/organizer/OrganizerAttendancePage').then(m => ({ default: m.OrganizerAttendancePage })));
const OrganizerReportsPage = lazy(() => import('@/pages/organizer/OrganizerReportsPage').then(m => ({ default: m.OrganizerReportsPage })));


// ── Page-level loading fallback ───────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span className="text-sm text-slate-500">Loading...</span>
      </div>
    </div>
  );
}

// ── Router ─────────────────────────────────────────────────────────────────────
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected student routes */}
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket/:id"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />

          {/* Attendance scanner */}
          <Route
            path="/attendance/scan"
            element={
              <ProtectedRoute>
                {/* Lazy placeholder — extend later */}
                <Navigate to="/my-registrations" replace />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Organizer routes */}
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/events" element={<OrganizerDashboard />} />
          <Route path="/organizer/events/create" element={<CreateEventPage />} />
          <Route path="/organizer/events/:id" element={<ManageEventPage />} />
          <Route path="/organizer/registrations" element={<OrganizerRegistrationsPage />} />
          <Route path="/organizer/attendance" element={<OrganizerAttendancePage />} />
          <Route path="/organizer/reports" element={<OrganizerReportsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
