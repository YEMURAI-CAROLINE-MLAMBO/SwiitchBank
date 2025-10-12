// backend/src/controllers/growthController.js

const referralService = require('../services/referralService');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/growth/referral:
 *   get:
 *     summary: Get referral information for the authenticated user
 *     tags: [Growth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 referralCode:
 *                   type: string
 *                 completedReferrals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       referralId:
 *                         type: string
 *                       referredUserId:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [pending, completed, expired]
 *       500:
 *         description: Internal server error
 */
exports.getReferralInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    // Call the referral service function to get referral details
    const referralInfo = await referralService.getReferralDetails(userId);
    
    if (!referralInfo) {
      return res.status(404).json({ message: 'Referral information not found' });
    }

    res.status(200).json(referralInfo);

  } catch (error) {
    logger.error('Error fetching referral info:', error);
    res.status(500).json({ message: 'Failed to fetch referral information' });
  }
};

/**
 * @swagger
 * /api/growth/referral/apply:
 *   post:
 *     summary: Apply a referral code
 *     tags: [Growth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - referralCode
 *             properties:
 *               referralCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Referral applied successfully
 *       400:
 *         description: Invalid or expired referral code
 *       500:
 *         description: Internal server error
 */
exports.applyReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const userId = req.user.id;

    const success = await referralService.processReferral(referralCode, userId);

    if (success) {
      res.status(200).json({ message: 'Referral applied successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired referral code' });
    }

  } catch (error) {
    logger.error('Error applying referral code:', error);
    res.status(500).json({ message: 'Failed to apply referral code' });
  }
};

/**
 * @swagger
 * /api/growth/referral/generate:
 *   post:
 *     summary: Generate a referral code for the authenticated user
 *     tags: [Growth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral code and offer generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                 reward:
 *                   type: object
 *                   properties:
 *                     rewardId:
 *                       type: string
 *                     rewardType:
 *                       type: string
 *                       enum: [cash, points, crypto]
 *                     amount:
 *                       type: number
 *                 shareMessage:
 *                   type: string
 *                 shareableImage:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
exports.generateReferralCode = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authenticated user

    // Call the referral service function to generate a referral offer
    const referralOffer = await referralService.generateReferralOffer(userId);

    res.status(200).json(referralOffer);
  } catch (error) {
    logger.error('Error generating referral code:', error);
    res.status(500).json({ message: 'Failed to generate referral code' });
  }
};
