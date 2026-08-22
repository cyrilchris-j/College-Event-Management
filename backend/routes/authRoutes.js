import { Router } from 'express';
import { registerStudent, login, getMe } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Public auth endpoints
router.post('/register', registerStudent);
router.post('/login', login);

// Authenticated auth endpoints
router.get('/me', authenticateUser, getMe);

export default router;
