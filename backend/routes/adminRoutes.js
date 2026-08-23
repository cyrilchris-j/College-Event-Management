import express from 'express';
import {
  getAdminDashboardStats,
  createOrganizerAccount,
  deleteOrganizerAccount
} from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', getAdminDashboardStats);

// POST /api/admin/organizers
router.post('/organizers', createOrganizerAccount);

// DELETE /api/admin/organizers/:id
router.delete('/organizers/:id', deleteOrganizerAccount);

export default router;
