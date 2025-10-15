import express from 'express';
import CrashAnalytics from '../analytics/CrashAnalytics.js';

const router = express.Router();

router.get('/stability', (req, res) => {
  try {
    const stabilityMetrics = CrashAnalytics.calculateStability();
    const recentErrors = CrashAnalytics.getRecentErrors('24h');
    res.json({ ...stabilityMetrics, recentErrors });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating stability metrics', error });
  }
});

export default router;
