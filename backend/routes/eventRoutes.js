import { Router } from 'express';
import { getEvents, getEventById, createEvent } from '../controllers/eventController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Organizer / Admin protected routes
router.post('/', authenticateUser, requireRole(['organizer', 'admin']), createEvent);

export default router;
