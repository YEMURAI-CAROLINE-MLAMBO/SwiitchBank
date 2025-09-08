// backend/src/controllers/cryptoPayoutController.js

const cryptoService = require('../services/cryptoService');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/crypto/currencies:
 *   get:
 *     summary: Get supported crypto currencies for payouts
 *     tags: [Crypto]
 *     responses:
 *       200:
 *         description: A list of supported currencies
 *         content:
 *           application/json:
 *             schema:
 */
const getSupportedCurrencies = async (req, res) => {
  try {
    const supportedCurrencies = await cryptoService.getSupportedCurrencies();
    res.status(200).json(supportedCurrencies);
  } catch (error) {
    logger.error('Error getting supported currencies:', error);
    res.status(500).json({ message: 'Error getting supported currencies' });
  }
};

/**
 * @swagger
 * /api/crypto/exchange-rate:
 *   get:
 *     summary: Get exchange rate between two currencies
 *     tags: [Crypto]
 *     parameters:
 *       - in: query
 *         name: fromCurrency
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: toCurrency
 *         required: true
 *         schema:
 *           type: string
 */
const getExchangeRate = async (req, res) => {
  const { fromCurrency, toCurrency } = req.query;
  try {
    const rate = await cryptoService.getExchangeRate(fromCurrency, toCurrency);
    res.status(200).json({ rate });
  } catch (error) {
    logger.error('Error getting exchange rate:', error);
    res.status(500).json({ message: 'Error getting exchange rate' });
  }
};

/**
 * @swagger
 * /api/crypto/payouts:
 *   post:
 *     summary: Initiate a crypto payout
 *     tags: [Crypto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *               - recipientAddress
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               recipientAddress:
 *                 type: string
 */
const initiateCryptoPayout = async (req, res) => {
  const { amount, currency, recipientAddress } = req.body;
  try {
    if (!amount || !currency || !recipientAddress) {
      return res.status(400).json({
        message: 'Amount, currency, and recipient address are required',
      });
    }

    if (typeof amount !== 'number' || typeof currency !== 'string') {
      return res
        .status(400)
        .json({ message: 'Invalid amount or currency type' });
    }

    const payoutResult = await cryptoService.initiatePayout(
      amount,
      currency,
      recipientAddress
    );
    res.status(200).json({
      message: 'Crypto payout initiated successfully',
      payout: payoutResult,
    });
  } catch (error) {
    logger.error('Error initiating crypto payout:', error);
    res.status(500).json({ message: 'Error initiating crypto payout' });
  }
};
module.exports = {
  getSupportedCurrencies,
  getExchangeRate,
  initiateCryptoPayout,
};
