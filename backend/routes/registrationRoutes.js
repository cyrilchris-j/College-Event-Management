import { Router } from 'express';
import {
  registerDirect,
  registerForEvent,
  getMyRegistrations,
  getRegistrationById,
  cancelRegistration,
} from '../controllers/registrationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Public Direct Registration (Auto creates student account + stores GPay payment proof)
router.post('/direct', registerDirect);

// Student Protected routes (for logged-in students)
router.post('/', authenticateUser, registerForEvent);
router.get('/my', authenticateUser, getMyRegistrations);
router.get('/:id', authenticateUser, getRegistrationById);
router.post('/:id/cancel', authenticateUser, cancelRegistration);

export default router;
