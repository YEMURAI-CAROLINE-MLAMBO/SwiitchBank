// backend/src/controllers/automatedSavingsController.js

const automatedSavingsService = require('../services/automatedSavingsService');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/automated-savings/trigger:
 *   post:
 *     summary: Manually trigger automated savings for a user
 *     tags: [AutomatedSavings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *               - currency
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 */
const triggerAutomatedSavings = async (req, res) => {
  const { userId, amount, currency } = req.body;
  try {
    await automatedSavingsService.triggerSavings(userId, amount, currency);
    res.status(200).json({ message: 'Automated savings triggered successfully.' });
  } catch (error) {
    logger.error('Error triggering automated savings:', error);
    res.status(500).json({ message: 'Error triggering automated savings.' });
  }
};

module.exports = { triggerAutomatedSavings };
