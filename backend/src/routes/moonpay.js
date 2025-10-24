import express from 'express';
import { getSupportedCurrenciesController, getQuoteController } from '../controllers/moonpayController.js';
import { handleWebhook } from '../services/moonpayService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * /api/moonpay/currencies:
 *   get:
 *     summary: Get a list of supported cryptocurrencies from MoonPay
 *     tags: [MoonPay]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of supported cryptocurrencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/currencies', getSupportedCurrenciesController);

/**
 * @swagger
 * /api/moonpay/quote:
 *   get:
 *     summary: Get a quote for a cryptocurrency purchase from MoonPay
 *     tags: [MoonPay]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: baseCurrencyCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The cryptocurrency to buy (e.g., 'btc')
 *       - in: query
 *         name: quoteCurrencyCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The fiat currency to pay with (e.g., 'usd')
 *       - in: query
 *         name: baseCurrencyAmount
 *         schema:
 *           type: number
 *         required: true
 *         description: The amount of cryptocurrency to buy
 *     responses:
 *       200:
 *         description: The quote for the transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/quote', getQuoteController);

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // Forward to the service for handling
  handleWebhook(req, res);
});


export default router;
