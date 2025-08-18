const express = require('express');
const router = express.Router();
const cryptoPayoutController = require('../controllers/cryptoPayoutController');
const { protect } = require('../middleware/auth'); // Assuming your auth middleware is here

// Protect all routes in this router
router.use(protect);

/**
 * @swagger
 * /api/crypto-payouts/initiate:
 *   post:
 *     summary: Initiate a crypto-to-bank payout
 *     tags: [Crypto Payouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceCurrency
 *               - sourceAmount
 *               - targetCurrency
 *               - bankAccountId
 *             properties:
 *               sourceCurrency:
 *                 type: string
 *                 description: The cryptocurrency to pay out from (e.g., BTC, ETH).
 *               sourceAmount:
 *                 type: number
 *                 format: float
 *                 description: The amount of cryptocurrency to pay out.
 *               targetCurrency:
 *                 type: string
 *                 description: The fiat currency to receive (e.g., USD, EUR).
 *               bankAccountId:
 *                 type: string
 *                 description: The ID of the linked bank account to receive the payout.
 *     responses:
 *       200:
 *         description: Crypto payout initiated successfully.
 *       400:
 *         description: Bad request or insufficient funds.
 *       401:
 *         description: Unauthorized, no valid token.
 *       500:
 *         description: Internal server error.
 */
// Placeholder POST route to initiate a crypto-to-bank payout
router.post('/initiate', cryptoPayoutController.initiatePayout);

router.get('/supported-currencies', cryptoPayoutController.getSupportedCurrencies);

router.get('/exchange-rate', cryptoPayoutController.getExchangeRate);