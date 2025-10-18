import * as paymentService from '../services/paymentService.js';
import logger from '../utils/logger.js';

export const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;
  const userId = req.user.id;

  try {
    const paymentIntent = await paymentService.createPaymentIntent(
      amount,
      currency,
      userId,
    );
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.rawBody;

  try {
    await paymentService.handleStripeWebhook(rawBody, sig);
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Error handling Stripe webhook:', error);
    res.status(400).json({ message: 'Error handling Stripe webhook' });
  }
};
