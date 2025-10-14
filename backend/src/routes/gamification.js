import express from 'express';
import * as gamificationController from '../controllers/gamificationController.js';

const router = express.Router();

// GET financial insights for a user
router.get('/users/:userId/financial-insights', gamificationController.getFinancialInsights);

// GET gamification challenges for a user
router.get('/users/:userId/gamification/challenges', gamificationController.getGamificationChallenges);

// GET the gamification leaderboard
router.get('/users/:userId/gamification/leaderboard', gamificationController.getGamificationLeaderboard);

export default router;