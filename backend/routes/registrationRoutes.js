import { Router } from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  getRegistrationById,
  cancelRegistration,
} from '../controllers/registrationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Student Protected routes
router.post('/', authenticateUser, registerForEvent);
router.get('/my', authenticateUser, getMyRegistrations);
router.get('/:id', authenticateUser, getRegistrationById);
router.post('/:id/cancel', authenticateUser, cancelRegistration);

export default router;
