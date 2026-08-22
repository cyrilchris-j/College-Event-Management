import { Router } from 'express';
import {
  getOrganizerEvents,
  createOrganizerEvent,
  updateOrganizerEvent,
  deleteOrganizerEvent,
  getOrganizerRegistrations,
  verifyRegistrationPayment,
  getOrganizerReports,
} from '../controllers/organizerController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect all organizer routes (allowed: 'organizer', 'admin')
router.use(authenticateUser);
router.use(requireRole(['organizer', 'admin']));

// Event CRUD
router.get('/events', getOrganizerEvents);
router.post('/events', createOrganizerEvent);
router.put('/events/:id', updateOrganizerEvent);
router.delete('/events/:id', deleteOrganizerEvent);

// Registrations & Verification
router.get('/registrations', getOrganizerRegistrations);
router.patch('/registrations/:id/verify-payment', verifyRegistrationPayment);

// Reports & Analytics
router.get('/reports', getOrganizerReports);

export default router;
