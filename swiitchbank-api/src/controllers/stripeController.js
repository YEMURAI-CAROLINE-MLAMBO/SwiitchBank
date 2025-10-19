import { createPaymentIntent, handleWebhook } from '../services/stripe.js';

/**
 * Create a payment intent
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {Promise<void>}
 */
export const createPaymentIntentController = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await createPaymentIntent(amount, currency);
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle incoming Stripe webhooks
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {Promise<void>}
 */
export const handleWebhookController = async (req, res) => {
  try {
    await handleWebhook(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
