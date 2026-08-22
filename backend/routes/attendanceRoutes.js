import { Router } from 'express';
import {
  verifyHallAttendance,
  manualAttendanceVerification,
} from '../controllers/attendanceController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Student Hall QR scan check-in
router.post('/scan', authenticateUser, verifyHallAttendance);

// Organiser manual check-in
router.post(
  '/manual',
  authenticateUser,
  requireRole(['organizer', 'admin']),
  manualAttendanceVerification
);

export default router;
