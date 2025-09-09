const express = require('express');
const router = express.Router();
const growthController = require('../controllers/growthController');
const authenticate = require('../middleware/auth'); // Assuming your auth middleware is named authenticate

// Apply authentication middleware to all routes in this router
router.use(authenticate);

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
 *                 message:
 *                   type: string
 *                   example: Referral information
 *                 referralInfo:
 *                   type: object
 *                   properties:
 *                     referralCode:
 *                       type: string
 *                       example: USER123ABC
 *                     referredUsersCount:
 *                       type: integer
 *                       example: 5
 *                     earnedRewards:
 *                       type: string
 *                       example: 10.00 USD
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/referral', growthController.getReferralInfo);

/**
 * @swagger
 * /api/growth/referral/generate:
 *   post:
 *     summary: Generate a new referral code for the authenticated user
 *     tags: [Growth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 referralCode:
 *                   type: string
 *                   example: NEWCODE789
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/referral/generate', growthController.generateReferralCode);

/**
 * @swagger
 * /api/growth/referral/apply:
 *   post:
 *     summary: Apply a referral code
 *     tags: [Growth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/referral/apply', growthController.applyReferralCode);

/**
 * @swagger
 * /api/growth/referral/send:
 *   post:
 *     summary: Send a referral invitation to a friend
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Referral invitation sent successfully
 *       400:
 *         description: Invalid email address
 *       401:
 *         description: Unauthorized
 */
router.post('/referral/send', growthController.sendReferral);

/**
 * @swagger
 * /api/growth/referral/status:
 *   get:
 *     summary: Get the status of the authenticated user's referrals
 *     tags: [Growth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of referrals and their statuses
 *       401:
 *         description: Unauthorized
 */
router.get('/referral/status', growthController.getReferralStatus);

module.exports = router;
