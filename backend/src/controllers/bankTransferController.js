// backend/src/controllers/bankTransferController.js

const bankTransferService = require('../services/bankTransferService');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/bank-transfers/incoming:
 *   post:
 *     summary: Simulate an incoming bank transfer
 *     tags: [BankTransfers]
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
const handleIncomingTransfer = async (req, res) => {
  const { userId, amount, currency } = req.body;
  try {
    await bankTransferService.handleIncomingTransfer(userId, amount, currency);
    res.status(200).json({ message: 'Incoming transfer processed successfully.' });
  } catch (error) {
    logger.error('Error handling incoming transfer:', error);
    res.status(500).json({ message: 'Error handling incoming transfer.' });
  }
};

module.exports = { handleIncomingTransfer };
