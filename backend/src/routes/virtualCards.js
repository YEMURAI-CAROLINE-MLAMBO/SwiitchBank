const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the authentication middleware
const { body, param } = require('express-validator');
const virtualCardController = require('../controllers/virtualCardController');
const marqetaWebhookService = require('../services/marqetaWebhookService');
const apiLimiter = require('../middleware/rateLimiter');

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

/**
 * @swagger
 * /api/virtual-cards:
 *   get:
 *     summary: List virtual cards for the authenticated user
 *     tags: [Virtual Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of virtual cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VirtualCard'
 *       401:
 *         description: Unauthorized
 */
// Use the controller functions for the routes
router.get('/', virtualCardController.listVirtualCards);

/**
 * @swagger
 * /api/virtual-cards/{cardId}:
 *   get:
 *     summary: Get a specific virtual card by ID
 *     tags: [Virtual Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the virtual card to get
 *     responses:
 *       200:
 *         description: Virtual card details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VirtualCard'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Virtual card not found
 */
// Placeholder GET route to get a specific virtual card by ID
router.get('/:cardId', virtualCardController.getVirtualCardById);

/**
 * @swagger
 * /api/virtual-cards:
 *   post:
 *     summary: Create a new virtual card
 *     tags: [Virtual Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Virtual card created successfully
 */
router.post(
  '/',
  [
    body('type').notEmpty().withMessage('Card type is required'),
    body('nickname').notEmpty().withMessage('Card nickname is required'),
  ],
  virtualCardController.createVirtualCard
);

router.post(
  '/:cardId/topup',
  [
    param('cardId')
      .notEmpty()
      .withMessage('Card ID is required')
      .isString()
      .withMessage('Card ID must be a string'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
  ],
  virtualCardController.topupVirtualCard
);

router.post(
  '/:cardId/withdraw',
  [
    param('cardId')
      .notEmpty()
      .withMessage('Card ID is required')
      .isString()
      .withMessage('Card ID must be a string'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
  ],
  virtualCardController.withdrawVirtualCard
);

/**
 * @swagger
 * /api/virtual-cards/webhooks/marqeta:
 *   post:
 *     summary: Receive and process Marqeta webhook events
 *     tags: [Virtual Cards]
 *     requestBody:
 *       required: true
 */
router.post(
  '/webhooks/marqeta',
  apiLimiter,
  marqetaWebhookService.processWebhookEvent
);

module.exports = router;
