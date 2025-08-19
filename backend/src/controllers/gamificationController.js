// backend/src/controllers/gamificationController.js

const gamificationService = require('../services/gamificationService');

/**
 * @swagger
 * /api/users/{userId}/financial-insights:
 *   get:
 *     summary: Get personalized financial insights for a user
 *     tags: [Gamification & Insights]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve insights for
 *     responses:
 *       200:
 *         description: Personalized financial insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insights:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found
 */
exports.getFinancialInsights = async (req, res) => {
  try {
    const gamificationService = require('../services/gamificationService');
    const { userId } = req.params;
    const insights = await gamificationService.getFinancialInsights(userId);
    res.status(200).json({ userId: userId, insights: insights
    });
  } catch (error) {
    console.error('Error getting financial insights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/users/{userId}/gamification/challenges:
 *   get:
 *     summary: Get gamification challenges for a user
 *     tags: [Gamification & Insights]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve challenges for
 *     responses:
 *       200:
 *         description: List of gamification challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   progress:
 *                     type: number
 *                   target:
 *                     type: number
 *                   completed:
 *                     type: boolean
 *       404:
 *         description: User not found
 */
exports.getGamificationChallenges = async (req, res) => {
  try {
    const { userId } = req.params;
    const challenges = await gamificationService.getGamificationChallenges(userId);
    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error getting gamification challenges:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @swagger
 * /api/users/{userId}/gamification/leaderboard:
 *   get:
 *     summary: Get the gamification leaderboard
 *     tags: [Gamification & Insights]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user requesting the leaderboard (can be used for highlighting)
 *     responses:
 *       200:
 *         description: Gamification leaderboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   username:
 *                     type: string
 *                   score:
 *                     type: number
 *       404:
 *         description: User not found
 */
exports.getGamificationLeaderboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const leaderboard = await gamificationService.getGamificationLeaderboard(userId);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error getting gamification leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};