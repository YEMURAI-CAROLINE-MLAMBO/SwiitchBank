import express from 'express';
import * as moonpayController from '../controllers/moonpayController.js';
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
router.get('/currencies', moonpayController.getCurrencies);

export default router;
