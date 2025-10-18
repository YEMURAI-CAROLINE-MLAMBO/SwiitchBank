import express from 'express';
import { celebrate as validate } from 'celebrate';
import paymentRequestValidation from '../validations/paymentRequestValidation.js';
import * as paymentController from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware to protect all payment routes
router.use(auth);

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Creates a payment intent for Stripe
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentIntentRequest'
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntentResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/create-payment-intent',
  validate(paymentRequestValidation.createPaymentIntent),
  paymentController.createPaymentIntent,
);

/**
 * @swagger
 * /api/payments/stripe-webhook:
 *   post:
 *     summary: Handles Stripe webhooks
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook handled successfully
 *       400:
 *         description: Invalid input or signature error
 *       500:
 *         description: Internal server error
 */
router.post('/stripe-webhook', paymentController.handleStripeWebhook);

export default router;
