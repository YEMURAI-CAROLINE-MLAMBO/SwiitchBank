import express from 'express';
import { getDashboardSummaryController } from '../controllers/dashboardController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', auth, getDashboardSummaryController);

export default router;
