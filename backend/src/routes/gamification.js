const express = require('express');
const gamificationController = require('../controllers/gamificationController');
const apiLimiter = require('../middleware/rateLimiter');
const { param } = require('express-validator');

const router = express.Router();

router.use(apiLimiter);

// GET financial insights for a user
router.get(
  '/users/:userId/financial-insights',
  [param('userId').isUUID().withMessage('User ID must be a valid UUID')],
  gamificationController.getFinancialInsights
);

// GET gamification challenges for a user
router.get(
  '/users/:userId/gamification/challenges',
  [param('userId').isUUID().withMessage('User ID must be a valid UUID')],
  gamificationController.getGamificationChallenges
);

// GET the gamification leaderboard
router.get(
  '/users/:userId/gamification/leaderboard',
  [param('userId').isUUID().withMessage('User ID must be a valid UUID')],
  gamificationController.getGamificationLeaderboard
);

module.exports = router;
