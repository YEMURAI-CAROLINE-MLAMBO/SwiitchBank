const express = require('express');
const gamificationController = require('../controllers/gamificationController');

const router = express.Router();

// GET financial insights for a user
router.get('/users/:userId/financial-insights', gamificationController.getFinancialInsights);

// GET gamification challenges for a user
router.get('/users/:userId/gamification/challenges', gamificationController.getGamificationChallenges);

// GET the gamification leaderboard
router.get('/users/:userId/gamification/leaderboard', gamificationController.getGamificationLeaderboard);

module.exports = router;