import Stripe from 'stripe';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import HighCapacitySophiaService from './HighCapacitySophiaService.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency, userId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId },
    });
    return paymentIntent;
  } catch (error) {
    logger.error('Error creating payment intent:', error);
    throw new Error('Error creating payment intent');
  }
};

export const handleStripeWebhook = async (rawBody, sig) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error('Webhook signature verification failed.');
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      logger.info(`PaymentIntent for ${paymentIntent.amount} was successful!`);

      const transaction = new Transaction({
        user: paymentIntent.metadata.userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        stripePaymentIntentId: paymentIntent.id,
        status: 'succeeded',
      });
      await transaction.save();

      const user = await User.findById(paymentIntent.metadata.userId);
      if (user) {
        HighCapacitySophiaService.sendNotification(
          `Hi ${user.firstName}, your payment of $${paymentIntent.amount / 100} was successful.`
        );
      } else {
        logger.error(`User not found for payment intent: ${paymentIntent.id}`);
      }
      break;
    default:
      logger.warn(`Unhandled event type ${event.type}`);
  }
};
