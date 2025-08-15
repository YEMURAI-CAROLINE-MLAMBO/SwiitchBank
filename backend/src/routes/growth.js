const express = require('express');
const router = express.Router();
const growthController = require('../controllers/growthController');

router.get('/referral', growthController.getReferralCode);
router.get('/leaderboard', growthController.getLeaderboard);
router.get('/insights', growthController.getPersonalizedInsights);

module.exports = router;
