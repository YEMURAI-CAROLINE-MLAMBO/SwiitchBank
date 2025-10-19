import { getDashboardSummary } from '../services/dashboardService.js';

export const getDashboardSummaryController = async (req, res) => {
  try {
    const summary = await getDashboardSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard summary' });
  }
};
